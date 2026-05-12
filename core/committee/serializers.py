from rest_framework import serializers

from accounts.models import User

from .models import Assignment, CommitteeTerm, Position, Wing


class LinkedUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = [
			'id',
			'sec_userid',
			'email',
			'first_name',
			'last_name',
			'phone',
			'batch',
			'department',
			'is_active',
		]
		read_only_fields = fields


class MemberSerializer(serializers.ModelSerializer):
	member_id = serializers.CharField(source='sec_userid', read_only=True)
	full_name = serializers.SerializerMethodField()

	class Meta:
		model = User
		fields = [
			'id',
			'member_id',
			'sec_userid',
			'full_name',
			'first_name',
			'last_name',
			'email',
			'phone',
			'image',
			'batch',
			'department',
			'is_active',
			'is_email_verified',
			'is_payment_verified',
		]
		read_only_fields = fields

	def get_full_name(self, obj):
		return f"{obj.first_name} {obj.last_name or ''}".strip() or obj.sec_userid


class CommitteeTermSerializer(serializers.ModelSerializer):
	class Meta:
		model = CommitteeTerm
		fields = [
			'id',
			'name',
			'slug',
			'description',
			'start_date',
			'end_date',
			'is_active',
			'created_at',
		]
		read_only_fields = ['id', 'slug', 'created_at']

	def validate(self, attrs):
		start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
		end_date = attrs.get('end_date', getattr(self.instance, 'end_date', None))
		if start_date and end_date and end_date < start_date:
			raise serializers.ValidationError({'end_date': 'end_date must be greater than or equal to start_date.'})
		return attrs


class WingSerializer(serializers.ModelSerializer):
	class Meta:
		model = Wing
		fields = [
			'id',
			'name',
			'slug',
			'description',
			'banner_image',
			'icon',
			'establishment_date',
			'created_at',
		]
		read_only_fields = ['id', 'slug', 'created_at']


class PositionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Position
		fields = [
			'id',
			'title',
			'slug',
			'hierarchy_level',
			'category',
			'is_executive',
			'description',
			'created_at',
		]
		read_only_fields = ['id', 'slug', 'created_at']


class AssignmentSerializer(serializers.ModelSerializer):
	member = MemberSerializer(read_only=True)
	member_id = serializers.SlugRelatedField(source='member', slug_field='sec_userid', queryset=User.objects.all(), write_only=True)
	committee_term = CommitteeTermSerializer(read_only=True)
	committee_term_id = serializers.SlugRelatedField(source='committee_term', slug_field='slug', queryset=CommitteeTerm.objects.all(), write_only=True)
	wing = WingSerializer(read_only=True)
	wing_id = serializers.SlugRelatedField(source='wing', slug_field='slug', queryset=Wing.objects.all(), write_only=True, required=False, allow_null=True)
	position = PositionSerializer(read_only=True)
	position_id = serializers.SlugRelatedField(source='position', slug_field='slug', queryset=Position.objects.all(), write_only=True)

	class Meta:
		model = Assignment
		fields = [
			'id',
			'member',
			'member_id',
			'committee_term',
			'committee_term_id',
			'wing',
			'wing_id',
			'position',
			'position_id',
			'assigned_at',
			'is_active',
			'notes',
			'created_at',
		]
		read_only_fields = ['id', 'created_at']
		validators = []

	def validate(self, attrs):
		member = attrs.get('member', getattr(self.instance, 'member', None))
		committee_term = attrs.get('committee_term', getattr(self.instance, 'committee_term', None))
		wing = attrs.get('wing', getattr(self.instance, 'wing', None))
		position = attrs.get('position', getattr(self.instance, 'position', None))
		assigned_at = attrs.get('assigned_at', getattr(self.instance, 'assigned_at', None))

		duplicate = Assignment.objects.filter(
			member=member,
			committee_term=committee_term,
			wing=wing,
			position=position,
		)
		if self.instance:
			duplicate = duplicate.exclude(pk=self.instance.pk)
		if duplicate.exists():
			raise serializers.ValidationError('This assignment already exists.')

		if committee_term and assigned_at and assigned_at.date() < committee_term.start_date:
			raise serializers.ValidationError({'assigned_at': 'assigned_at cannot be earlier than the committee term start date.'})

		return attrs
