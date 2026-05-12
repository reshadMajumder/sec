from collections import defaultdict

from django.db.models import Q
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.models import User

from .models import Assignment, CommitteeTerm, Position, Wing
from .serializers import AssignmentSerializer, CommitteeTermSerializer, MemberSerializer, PositionSerializer, WingSerializer


def _parse_bool_param(value):
	if value is None:
		return None
	normalized = str(value).strip().lower()
	if normalized in {'true', '1', 'yes'}:
		return True
	if normalized in {'false', '0', 'no'}:
		return False
	return None


def _resolve_committee_term(request):
	term_slug = request.query_params.get('committee_term')
	if term_slug:
		return CommitteeTerm.objects.filter(slug=term_slug).first()
	active_term = CommitteeTerm.objects.filter(is_active=True).order_by('-start_date').first()
	if active_term:
		return active_term
	return CommitteeTerm.objects.order_by('-start_date').first()


def _group_assignments_by_position(assignments):
	grouped = defaultdict(list)
	positions = {}
	for assignment in assignments:
		positions[assignment.position_id] = assignment.position
		grouped[assignment.position_id].append(assignment)

	result = []
	for position_id, items in sorted(
		grouped.items(),
		key=lambda item: (
			item[1][0].position.hierarchy_level,
			item[1][0].position.title.lower(),
		),
	):
		position = positions[position_id]
		result.append(
			{
				'position': PositionSerializer(position).data,
				'assignment_count': len(items),
				'members': [MemberSerializer(item.member).data for item in items],
				'assignments': AssignmentSerializer(items, many=True).data,
			}
		)
	return result


class MemberViewSet(viewsets.ModelViewSet):
	serializer_class = MemberSerializer
	lookup_field = 'sec_userid'
	lookup_url_kwarg = 'sec_userid'

	def get_queryset(self):
		queryset = User.objects.all()
		search = self.request.query_params.get('search')
		if search:
			queryset = queryset.filter(
				Q(sec_userid__icontains=search)
				| Q(first_name__icontains=search)
				| Q(last_name__icontains=search)
				| Q(email__icontains=search)
				| Q(phone__icontains=search)
				| Q(batch__icontains=search)
				| Q(department__icontains=search)
			)

		batch = self.request.query_params.get('batch')
		if batch:
			queryset = queryset.filter(batch__iexact=batch)

		department = self.request.query_params.get('department')
		if department:
			queryset = queryset.filter(department__iexact=department)

		active = _parse_bool_param(self.request.query_params.get('active'))
		if active is not None:
			queryset = queryset.filter(is_active=active)

		ordering = self.request.query_params.get('ordering', 'full_name')
		allowed_ordering = {'sec_userid', 'first_name', 'last_name', 'email', 'batch', 'department', 'is_active'}
		if ordering.lstrip('-') in allowed_ordering:
			queryset = queryset.order_by(ordering)
		else:
			queryset = queryset.order_by('first_name', 'last_name')

		return queryset

	@action(detail=True, methods=['get'])
	def timeline(self, request, sec_userid=None):
		member = self.get_object()
		assignments = (
			Assignment.objects.filter(member=member)
			.select_related('committee_term', 'wing', 'position')
			.order_by('committee_term__start_date', 'assigned_at', 'created_at')
		)
		return Response(
			{
				'member': MemberSerializer(member).data,
				'count': assignments.count(),
				'timeline': AssignmentSerializer(assignments, many=True).data,
			},
			status=status.HTTP_200_OK,
		)


class CommitteeTermViewSet(viewsets.ModelViewSet):
	serializer_class = CommitteeTermSerializer
	lookup_field = 'slug'
	lookup_url_kwarg = 'slug'

	def get_queryset(self):
		queryset = CommitteeTerm.objects.all()
		search = self.request.query_params.get('search')
		if search:
			queryset = queryset.filter(Q(name__icontains=search) | Q(slug__icontains=search))

		is_active = _parse_bool_param(self.request.query_params.get('is_active'))
		if is_active is not None:
			queryset = queryset.filter(is_active=is_active)

		ordering = self.request.query_params.get('ordering', '-start_date')
		allowed_ordering = {'name', 'slug', 'start_date', 'end_date', 'is_active', 'created_at'}
		if ordering.lstrip('-') in allowed_ordering:
			queryset = queryset.order_by(ordering)
		else:
			queryset = queryset.order_by('-start_date')

		return queryset

	@action(detail=False, methods=['get'])
	def active(self, request):
		term = CommitteeTerm.objects.filter(is_active=True).order_by('-start_date').first()
		if not term:
			return Response({'message': 'No active committee term found.'}, status=status.HTTP_404_NOT_FOUND)
		return Response(CommitteeTermSerializer(term).data, status=status.HTTP_200_OK)


class WingViewSet(viewsets.ModelViewSet):
	serializer_class = WingSerializer
	lookup_field = 'slug'
	lookup_url_kwarg = 'slug'

	def get_queryset(self):
		queryset = Wing.objects.all()
		search = self.request.query_params.get('search')
		if search:
			queryset = queryset.filter(Q(name__icontains=search) | Q(slug__icontains=search))

		ordering = self.request.query_params.get('ordering', 'name')
		allowed_ordering = {'name', 'slug', 'establishment_date', 'created_at'}
		if ordering.lstrip('-') in allowed_ordering:
			queryset = queryset.order_by(ordering)
		else:
			queryset = queryset.order_by('name')

		return queryset

	@action(detail=True, methods=['get'])
	def hierarchy(self, request, slug=None):
		wing = self.get_object()
		term = _resolve_committee_term(request)
		assignments = Assignment.objects.filter(wing=wing)
		if term:
			assignments = assignments.filter(committee_term=term)
		assignments = assignments.select_related('member', 'committee_term', 'wing', 'position').order_by('position__hierarchy_level', 'position__title', 'member__first_name', 'member__last_name')

		return Response(
			{
				'wing': WingSerializer(wing).data,
				'committee_term': CommitteeTermSerializer(term).data if term else None,
				'positions': _group_assignments_by_position(assignments),
			},
			status=status.HTTP_200_OK,
		)

	@action(detail=True, methods=['get'])
	def members(self, request, slug=None):
		wing = self.get_object()
		term = _resolve_committee_term(request)
		assignments = Assignment.objects.filter(wing=wing)
		if term:
			assignments = assignments.filter(committee_term=term)
		assignments = assignments.select_related('member', 'committee_term', 'wing', 'position').order_by('member__first_name', 'member__last_name', 'position__hierarchy_level')
		return Response(
			{
				'wing': WingSerializer(wing).data,
				'committee_term': CommitteeTermSerializer(term).data if term else None,
				'count': assignments.count(),
				'assignments': AssignmentSerializer(assignments, many=True).data,
			},
			status=status.HTTP_200_OK,
		)


class PositionViewSet(viewsets.ModelViewSet):
	serializer_class = PositionSerializer
	lookup_field = 'slug'
	lookup_url_kwarg = 'slug'

	def get_queryset(self):
		queryset = Position.objects.all()
		search = self.request.query_params.get('search')
		if search:
			queryset = queryset.filter(
				Q(title__icontains=search)
				| Q(slug__icontains=search)
				| Q(category__icontains=search)
			)

		category = self.request.query_params.get('category')
		if category:
			queryset = queryset.filter(category__iexact=category)

		is_executive = _parse_bool_param(self.request.query_params.get('is_executive'))
		if is_executive is not None:
			queryset = queryset.filter(is_executive=is_executive)

		ordering = self.request.query_params.get('ordering', 'hierarchy_level')
		allowed_ordering = {'title', 'slug', 'hierarchy_level', 'category', 'is_executive', 'created_at'}
		if ordering.lstrip('-') in allowed_ordering:
			queryset = queryset.order_by(ordering)
		else:
			queryset = queryset.order_by('hierarchy_level', 'title')

		return queryset

	@action(detail=False, methods=['get'])
	def hierarchy(self, request):
		queryset = self.get_queryset().order_by('category', 'hierarchy_level', 'title')
		groups = defaultdict(list)
		for position in queryset:
			groups[position.category].append(PositionSerializer(position).data)
		return Response(groups, status=status.HTTP_200_OK)


class AssignmentViewSet(
	mixins.CreateModelMixin,
	mixins.ListModelMixin,
	mixins.RetrieveModelMixin,
	viewsets.GenericViewSet,
	):
	serializer_class = AssignmentSerializer

	def get_queryset(self):
		queryset = Assignment.objects.with_relations()

		member_id = self.request.query_params.get('member_id')
		if member_id:
			queryset = queryset.filter(member__sec_userid=member_id)

		committee_term = self.request.query_params.get('committee_term')
		if committee_term:
			queryset = queryset.filter(committee_term__slug=committee_term)

		wing = self.request.query_params.get('wing')
		if wing:
			queryset = queryset.filter(wing__slug=wing)

		position = self.request.query_params.get('position')
		if position:
			queryset = queryset.filter(position__slug=position)

		is_active = _parse_bool_param(self.request.query_params.get('is_active'))
		if is_active is not None:
			queryset = queryset.filter(is_active=is_active)

		search = self.request.query_params.get('search')
		if search:
			queryset = queryset.filter(
				Q(member__sec_userid__icontains=search)
				| Q(member__first_name__icontains=search)
				| Q(member__last_name__icontains=search)
				| Q(position__title__icontains=search)
				| Q(wing__name__icontains=search)
				| Q(committee_term__name__icontains=search)
			)

		ordering = self.request.query_params.get('ordering', '-assigned_at')
		allowed_ordering = {
			'assigned_at',
			'created_at',
			'is_active',
			'member__first_name',
			'member__last_name',
			'committee_term__start_date',
			'wing__name',
			'position__hierarchy_level',
		}
		if ordering.lstrip('-') in allowed_ordering:
			queryset = queryset.order_by(ordering)
		else:
			queryset = queryset.order_by('-assigned_at', '-created_at')

		return queryset

	@action(detail=False, methods=['get'])
	def current(self, request):
		queryset = self.get_queryset().current()
		term = _resolve_committee_term(request)
		if term:
			queryset = queryset.filter(committee_term=term)
		return Response(
			{
				'committee_term': CommitteeTermSerializer(term).data if term else None,
				'count': queryset.count(),
				'assignments': self.get_serializer(queryset, many=True).data,
			},
			status=status.HTTP_200_OK,
		)

	@action(detail=False, methods=['get'])
	def history(self, request):
		queryset = self.get_queryset().history()
		return Response(
			{
				'count': queryset.count(),
				'assignments': self.get_serializer(queryset, many=True).data,
			},
			status=status.HTTP_200_OK,
		)

	@action(detail=False, methods=['get'])
	def structure(self, request):
		term = _resolve_committee_term(request)
		assignments = self.get_queryset()
		if term:
			assignments = assignments.filter(committee_term=term)
		assignments = assignments.select_related('member', 'committee_term', 'wing', 'position').order_by('position__hierarchy_level', 'member__first_name', 'member__last_name')

		advisory = assignments.filter(position__category='advisory')
		leadership = assignments.filter(position__category='leadership')
		wing_management = assignments.filter(position__category='wing_management')
		wing_members = assignments.filter(position__category='wing_member')

		wings_payload = []
		for wing in Wing.objects.order_by('name'):
			wing_assignments = assignments.filter(wing=wing)
			if not wing_assignments.exists():
				continue
			wings_payload.append(
				{
					'wing': WingSerializer(wing).data,
					'hierarchy': _group_assignments_by_position(wing_assignments),
				}
			)

		return Response(
			{
				'committee_term': CommitteeTermSerializer(term).data if term else None,
				'advisory_board': _group_assignments_by_position(advisory),
				'core_leadership': _group_assignments_by_position(leadership),
				'wing_management': _group_assignments_by_position(wing_management),
				'general_members': _group_assignments_by_position(wing_members),
				'wings': wings_payload,
			},
			status=status.HTTP_200_OK,
		)
