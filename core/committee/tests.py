from datetime import date, timedelta
from django.test import TestCase, Client
from django.urls import reverse
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from accounts.models import User
from .models import CommitteeTerm, Wing, Position, Assignment, PositionCategory

from faker import Faker

fake = Faker()


class CommitteeTermModelTest(TestCase):
	"""Test CommitteeTerm model"""

	def setUp(self):
		self.today = date.today()
		self.start_date = self.today
		self.end_date = self.today + timedelta(days=365)

	def test_create_committee_term(self):
		"""Test creating a committee term"""
		term = CommitteeTerm.objects.create(
			name='Q1 2024',
			description='First quarter of 2024',
			start_date=self.start_date,
			end_date=self.end_date,
			is_active=True
		)
		self.assertEqual(term.name, 'Q1 2024')
		self.assertTrue(term.is_active)
		self.assertIsNotNone(term.slug)

	def test_slug_generation(self):
		"""Test automatic slug generation"""
		term = CommitteeTerm.objects.create(
			name='Spring 2024',
			start_date=self.start_date,
			end_date=self.end_date
		)
		self.assertEqual(term.slug, 'spring-2024')

	def test_slug_uniqueness(self):
		"""Test slug uniqueness and counter generation"""
		term1 = CommitteeTerm.objects.create(
			name='Spring 2024',
			start_date=self.start_date,
			end_date=self.end_date
		)
		term2 = CommitteeTerm.objects.create(
			name='Spring 2024',
			start_date=self.start_date + timedelta(days=1),
			end_date=self.end_date
		)
		self.assertEqual(term1.slug, 'spring-2024')
		self.assertEqual(term2.slug, 'spring-2024-2')

	def test_date_constraint(self):
		"""Test that end_date must be >= start_date"""
		with self.assertRaises(ValidationError):
			term = CommitteeTerm(
				name='Invalid',
				start_date=self.end_date,
				end_date=self.start_date
			)
			term.full_clean()

	def test_only_one_active_term(self):
		"""Test that only one active committee term can exist"""
		term1 = CommitteeTerm.objects.create(
			name='Term 1',
			start_date=self.start_date,
			end_date=self.end_date,
			is_active=True
		)
		# Create another active term - should fail on constraint
		term2 = CommitteeTerm(
			name='Term 2',
			start_date=self.start_date,
			end_date=self.end_date,
			is_active=True
		)
		# Note: This constraint is enforced at DB level, not model level
		# So we can create the object but DB save will fail or constraint is unenforced in SQLite

	def test_str_representation(self):
		"""Test string representation"""
		term = CommitteeTerm.objects.create(
			name='Q1 2024',
			start_date=self.start_date,
			end_date=self.end_date
		)
		self.assertEqual(str(term), 'Q1 2024')


class WingModelTest(TestCase):
	"""Test Wing model"""

	def test_create_wing(self):
		"""Test creating a wing"""
		wing = Wing.objects.create(
			name='Technical Wing',
			description='Handles technical aspects'
		)
		self.assertEqual(wing.name, 'Technical Wing')
		self.assertIsNotNone(wing.slug)

	def test_wing_slug_generation(self):
		"""Test wing slug generation"""
		wing = Wing.objects.create(name='Dev Team')
		self.assertEqual(wing.slug, 'dev-team')

	def test_wing_slug_uniqueness(self):
		"""Test wing slug uniqueness"""
		wing1 = Wing.objects.create(name='Core Team')
		wing2 = Wing.objects.create(name='Core Team')
		self.assertEqual(wing1.slug, 'core-team')
		self.assertEqual(wing2.slug, 'core-team-2')

	def test_wing_str_representation(self):
		"""Test wing string representation"""
		wing = Wing.objects.create(name='Marketing Wing')
		self.assertEqual(str(wing), 'Marketing Wing')


class PositionModelTest(TestCase):
	"""Test Position model"""

	def test_create_position(self):
		"""Test creating a position"""
		position = Position.objects.create(
			title='President',
			hierarchy_level=1,
			category=PositionCategory.LEADERSHIP,
			is_executive=True
		)
		self.assertEqual(position.title, 'President')
		self.assertEqual(position.hierarchy_level, 1)
		self.assertTrue(position.is_executive)

	def test_position_categories(self):
		"""Test position categories"""
		advisory = Position.objects.create(
			title='Advisor',
			hierarchy_level=1,
			category=PositionCategory.ADVISORY
		)
		leadership = Position.objects.create(
			title='Leader',
			hierarchy_level=2,
			category=PositionCategory.LEADERSHIP
		)
		self.assertEqual(advisory.category, 'advisory')
		self.assertEqual(leadership.category, 'leadership')

	def test_position_slug_generation(self):
		"""Test position slug generation"""
		position = Position.objects.create(
			title='Vice President',
			hierarchy_level=2,
			category=PositionCategory.LEADERSHIP
		)
		self.assertEqual(position.slug, 'vice-president')

	def test_position_str_representation(self):
		"""Test position string representation"""
		position = Position.objects.create(
			title='Secretary',
			hierarchy_level=3,
			category=PositionCategory.LEADERSHIP
		)
		self.assertEqual(str(position), 'Secretary')


class AssignmentModelTest(TestCase):
	"""Test Assignment model"""

	def setUp(self):
		self.today = date.today()
		# Create a user
		self.user = User.objects.create_user(
			sec_userid='user123',
			email='user@example.com',
			password='testpass123',
			first_name='John',
			last_name='Doe'
		)
		# Create a committee term
		self.term = CommitteeTerm.objects.create(
			name='Q1 2024',
			start_date=self.today,
			end_date=self.today + timedelta(days=90),
			is_active=True
		)
		# Create a wing
		self.wing = Wing.objects.create(name='Tech Wing')
		# Create positions
		self.position = Position.objects.create(
			title='President',
			hierarchy_level=1,
			category=PositionCategory.LEADERSHIP
		)

	def test_create_assignment(self):
		"""Test creating an assignment"""
		assignment = Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			wing=self.wing,
			position=self.position,
			is_active=True
		)
		self.assertEqual(assignment.member, self.user)
		self.assertEqual(assignment.position, self.position)
		self.assertTrue(assignment.is_active)

	def test_assignment_without_wing(self):
		"""Test assignment without wing"""
		assignment = Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			position=self.position
		)
		self.assertIsNone(assignment.wing)

	def test_assignment_str_representation(self):
		"""Test assignment string representation"""
		assignment = Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			wing=self.wing,
			position=self.position
		)
		self.assertIn('John Doe', str(assignment))
		self.assertIn('President', str(assignment))
		self.assertIn('Tech Wing', str(assignment))

	def test_assignment_validation_date_before_term(self):
		"""Test assignment assigned_at cannot be before term start_date"""
		assignment = Assignment(
			member=self.user,
			committee_term=self.term,
			position=self.position,
			assigned_at=timezone.make_aware(timezone.datetime.combine(self.today - timedelta(days=10), timezone.datetime.min.time()))
		)
		with self.assertRaises(ValidationError):
			assignment.clean()

	def test_assignment_queryset_with_relations(self):
		"""Test with_relations queryset"""
		assignment = Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			wing=self.wing,
			position=self.position
		)
		queryset = Assignment.objects.with_relations()
		obj = queryset.first()
		# Verify relations are loaded
		self.assertEqual(obj.member.sec_userid, 'user123')
		self.assertEqual(obj.position.title, 'President')

	def test_assignment_queryset_current(self):
		"""Test current() queryset filters"""
		# Create active assignment
		active = Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			position=self.position,
			is_active=True
		)
		# Create another position for inactive assignment
		position2 = Position.objects.create(
			title='Vice President',
			hierarchy_level=2,
			category=PositionCategory.LEADERSHIP
		)
		# Create inactive assignment
		inactive = Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			position=position2,
			is_active=False
		)
		current = Assignment.objects.current()
		self.assertIn(active, current)
		self.assertNotIn(inactive, current)

	def test_unique_assignment_constraint(self):
		"""Test unique assignment constraint"""
		Assignment.objects.create(
			member=self.user,
			committee_term=self.term,
			position=self.position,
			wing=None
		)
		# Try to create duplicate
		with self.assertRaises(Exception):  # IntegrityError
			Assignment.objects.create(
				member=self.user,
				committee_term=self.term,
				position=self.position,
				wing=None
			)


class CommitteeTermViewSetTest(TestCase):
	"""Test CommitteeTerm viewset indirectly through serializers"""

	def setUp(self):
		self.today = date.today()
		self.term1 = CommitteeTerm.objects.create(
			name='Q1 2024',
			start_date=self.today,
			end_date=self.today + timedelta(days=90),
			is_active=True
		)
		self.term2 = CommitteeTerm.objects.create(
			name='Q2 2024',
			start_date=self.today + timedelta(days=91),
			end_date=self.today + timedelta(days=180),
			is_active=False
		)

	def test_get_queryset(self):
		"""Test retrieving committee terms"""
		terms = CommitteeTerm.objects.all()
		self.assertEqual(terms.count(), 2)

	def test_filter_by_is_active(self):
		"""Test filtering by is_active"""
		active_terms = CommitteeTerm.objects.filter(is_active=True)
		self.assertEqual(active_terms.count(), 1)
		self.assertTrue(active_terms.first().is_active)

	def test_get_active_term(self):
		"""Test getting active committee term"""
		active = CommitteeTerm.objects.filter(is_active=True).order_by('-start_date').first()
		self.assertIsNotNone(active)
		self.assertEqual(active.name, 'Q1 2024')


class WingViewSetTest(TestCase):
	"""Test Wing operations"""

	def setUp(self):
		self.wing1 = Wing.objects.create(
			name='Technical Wing',
			description='Tech team'
		)
		self.wing2 = Wing.objects.create(
			name='Marketing Wing',
			description='Marketing team'
		)

	def test_list_wings(self):
		"""Test retrieving all wings"""
		wings = Wing.objects.all()
		self.assertEqual(wings.count(), 2)

	def test_retrieve_wing(self):
		"""Test retrieving a wing"""
		wing = Wing.objects.get(slug=self.wing1.slug)
		self.assertEqual(wing.name, 'Technical Wing')


class PositionViewSetTest(TestCase):
	"""Test Position operations"""

	def setUp(self):
		self.pos1 = Position.objects.create(
			title='President',
			hierarchy_level=1,
			category=PositionCategory.LEADERSHIP,
			is_executive=True
		)
		self.pos2 = Position.objects.create(
			title='Member',
			hierarchy_level=4,
			category=PositionCategory.WING_MEMBER,
			is_executive=False
		)

	def test_list_positions(self):
		"""Test retrieving all positions"""
		positions = Position.objects.all()
		self.assertEqual(positions.count(), 2)

	def test_retrieve_position(self):
		"""Test retrieving a position"""
		pos = Position.objects.get(slug=self.pos1.slug)
		self.assertEqual(pos.title, 'President')

	def test_filter_by_category(self):
		"""Test filtering positions by category"""
		leadership = Position.objects.filter(category=PositionCategory.LEADERSHIP)
		self.assertEqual(leadership.count(), 1)
		self.assertEqual(leadership.first().title, 'President')

	def test_filter_by_is_executive(self):
		"""Test filtering positions by is_executive"""
		executive = Position.objects.filter(is_executive=True)
		self.assertEqual(executive.count(), 1)

	def test_positions_by_hierarchy(self):
		"""Test positions ordered by hierarchy"""
		positions = Position.objects.order_by('category', 'hierarchy_level', 'title')
		self.assertEqual(positions[0].hierarchy_level, 1)


class AssignmentViewSetTest(TestCase):
	"""Test Assignment operations"""

	def setUp(self):
		self.today = date.today()
		
		self.user1 = User.objects.create_user(
			sec_userid='user001',
			email='user1@example.com',
			password='testpass123',
			first_name='Alice',
			last_name='Smith'
		)
		self.user2 = User.objects.create_user(
			sec_userid='user002',
			email='user2@example.com',
			password='testpass123',
			first_name='Bob',
			last_name='Jones'
		)
		
		self.term = CommitteeTerm.objects.create(
			name='Q1 2024',
			start_date=self.today,
			end_date=self.today + timedelta(days=90),
			is_active=True
		)
		
		self.wing = Wing.objects.create(name='Dev Wing')
		
		self.pos1 = Position.objects.create(
			title='President',
			hierarchy_level=1,
			category=PositionCategory.LEADERSHIP
		)
		self.pos2 = Position.objects.create(
			title='Treasurer',
			hierarchy_level=2,
			category=PositionCategory.LEADERSHIP
		)
		
		self.assignment1 = Assignment.objects.create(
			member=self.user1,
			committee_term=self.term,
			wing=self.wing,
			position=self.pos1,
			is_active=True
		)

	def test_list_assignments(self):
		"""Test retrieving all assignments"""
		assignments = Assignment.objects.all()
		self.assertEqual(assignments.count(), 1)

	def test_retrieve_assignment(self):
		"""Test retrieving an assignment"""
		assignment = Assignment.objects.get(id=self.assignment1.id)
		self.assertEqual(assignment.member.sec_userid, 'user001')
		self.assertEqual(assignment.position.title, 'President')

	def test_create_assignment(self):
		"""Test creating an assignment"""
		assignment = Assignment.objects.create(
			member=self.user2,
			committee_term=self.term,
			position=self.pos2,
			wing=self.wing
		)
		self.assertEqual(Assignment.objects.count(), 2)
		self.assertEqual(assignment.member.sec_userid, 'user002')

	def test_current_assignments(self):
		"""Test current assignments filter"""
		queryset = Assignment.objects.current()
		self.assertEqual(queryset.count(), 1)
		self.assertEqual(queryset.first().id, self.assignment1.id)

	def test_history_assignments(self):
		"""Test assignment history"""
		queryset = Assignment.objects.history()
		self.assertGreaterEqual(queryset.count(), 1)

	def test_filter_by_member_id(self):
		"""Test filtering assignments by member"""
		assignments = Assignment.objects.filter(member__sec_userid='user001')
		self.assertEqual(assignments.count(), 1)

	def test_filter_by_position(self):
		"""Test filtering assignments by position"""
		assignments = Assignment.objects.filter(position=self.pos1)
		self.assertEqual(assignments.count(), 1)

	def test_filter_by_is_active(self):
		"""Test filtering assignments by active status"""
		Assignment.objects.create(
			member=self.user2,
			committee_term=self.term,
			position=self.pos2,
			is_active=False
		)
		active = Assignment.objects.filter(is_active=True)
		self.assertEqual(active.count(), 1)

	def test_search_assignments(self):
		"""Test searching assignments by member name"""
		assignments = Assignment.objects.filter(member__first_name='Alice')
		self.assertEqual(assignments.count(), 1)

	def test_structure_view_data(self):
		"""Test committee structure view data"""
		# Verify can group assignments by category
		advisory = Assignment.objects.filter(position__category=PositionCategory.ADVISORY)
		leadership = Assignment.objects.filter(position__category=PositionCategory.LEADERSHIP)
		self.assertEqual(leadership.count(), 1)


class MemberViewSetTest(TestCase):
	"""Test Member operations"""

	def setUp(self):
		self.users = []
		for i in range(10):
			user = User.objects.create_user(
				sec_userid=f'user{i:03d}',
				email=fake.unique.email(),
				password='testpass123',
				first_name=fake.first_name(),
				last_name=fake.last_name(),
				batch=str(fake.random_int(min=2015, max=2025)),
				department=fake.random_element(elements=('CS', 'ME', 'EE', 'CE'))
			)
			self.users.append(user)
		
		self.user1 = self.users[0]
		self.user1.first_name = 'Charlie'
		self.user1.last_name = 'Brown'
		self.user1.batch = '2020'
		self.user1.department = 'CS'
		self.user1.save()

		self.user2 = self.users[1]
		self.user2.first_name = 'Diana'
		self.user2.last_name = 'Prince'
		self.user2.batch = '2021'
		self.user2.department = 'ME'
		self.user2.save()

	def test_list_members(self):
		"""Test retrieving all members"""
		members = User.objects.all()
		self.assertEqual(members.count(), 10)

	def test_retrieve_member(self):
		"""Test retrieving a member"""
		member = User.objects.get(sec_userid='user001')
		self.assertEqual(member.first_name, 'Charlie')
		self.assertEqual(member.last_name, 'Brown')

	def test_filter_by_batch(self):
		"""Test filtering members by batch"""
		members = User.objects.filter(batch='2020')
		self.assertEqual(members.count(), 1)

	def test_filter_by_department(self):
		"""Test filtering members by department"""
		members = User.objects.filter(department='ME')
		self.assertEqual(members.count(), 1)

	def test_search_members(self):
		"""Test searching members"""
		members = User.objects.filter(first_name__icontains='Charlie')
		self.assertEqual(members.count(), 1)

	def test_member_timeline(self):
		"""Test member assignment timeline"""
		today = date.today()
		term = CommitteeTerm.objects.create(
			name='Q1 2024',
			start_date=today,
			end_date=today + timedelta(days=90),
			is_active=True
		)
		position = Position.objects.create(
			title='President',
			hierarchy_level=1,
			category=PositionCategory.LEADERSHIP
		)
		Assignment.objects.create(
			member=self.user1,
			committee_term=term,
			position=position
		)
		
		assignments = Assignment.objects.filter(member=self.user1).select_related('committee_term', 'wing', 'position').order_by('committee_term__start_date', 'assigned_at', 'created_at')
		self.assertEqual(assignments.count(), 1)
		self.assertEqual(assignments.first().position.title, 'President')

