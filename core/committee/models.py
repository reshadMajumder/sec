from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.utils.text import slugify
from django.utils import timezone

from cloudinary.models import CloudinaryField


def _generate_unique_slug(model_cls, source_value, instance=None):
	base_slug = slugify(source_value) or 'default'
	slug = base_slug
	counter = 2
	queryset = model_cls.objects.all()
	if instance and instance.pk:
		queryset = queryset.exclude(pk=instance.pk)
	while queryset.filter(slug=slug).exists():
		slug = f"{base_slug}-{counter}"
		counter += 1
	return slug
class PositionCategory(models.TextChoices):
	ADVISORY = 'advisory', 'Advisory'
	LEADERSHIP = 'leadership', 'Leadership'
	WING_MANAGEMENT = 'wing_management', 'Wing Management'
	WING_MEMBER = 'wing_member', 'Wing Member'


class CommitteeTerm(models.Model):
	name = models.CharField(max_length=255)
	slug = models.SlugField(max_length=255, unique=True, editable=False)
	description = models.TextField(blank=True, null=True)
	start_date = models.DateField()
	end_date = models.DateField()
	is_active = models.BooleanField(default=False, db_index=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-start_date', '-created_at']
		constraints = [
			models.CheckConstraint(check=Q(end_date__gte=models.F('start_date')), name='committee_term_end_gte_start'),
			models.UniqueConstraint(fields=['is_active'], condition=Q(is_active=True), name='unique_active_committee_term'),
		]
		indexes = [
			models.Index(fields=['slug']),
			models.Index(fields=['is_active']),
			models.Index(fields=['start_date', 'end_date']),
		]

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = _generate_unique_slug(CommitteeTerm, self.name, self)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class Wing(models.Model):
	name = models.CharField(max_length=255)
	slug = models.SlugField(max_length=255, unique=True, editable=False)
	description = models.TextField(blank=True, null=True)
	banner_image = CloudinaryField('wing_banner_image', blank=True, null=True)
	icon = models.CharField(max_length=120, blank=True, null=True)
	establishment_date = models.DateField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['name']
		indexes = [
			models.Index(fields=['slug']),
			models.Index(fields=['name']),
		]

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = _generate_unique_slug(Wing, self.name, self)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.name


class Position(models.Model):
	title = models.CharField(max_length=255)
	slug = models.SlugField(max_length=255, unique=True, editable=False)
	hierarchy_level = models.PositiveIntegerField(db_index=True)
	category = models.CharField(max_length=30, choices=PositionCategory.choices, db_index=True)
	is_executive = models.BooleanField(default=False, db_index=True)
	description = models.TextField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['hierarchy_level', 'title']
		indexes = [
			models.Index(fields=['slug']),
			models.Index(fields=['category', 'hierarchy_level']),
			models.Index(fields=['is_executive']),
		]

	def save(self, *args, **kwargs):
		if not self.slug:
			self.slug = _generate_unique_slug(Position, self.title, self)
		super().save(*args, **kwargs)

	def __str__(self):
		return self.title


class AssignmentQuerySet(models.QuerySet):
	def with_relations(self):
		return self.select_related('member', 'committee_term', 'wing', 'position')

	def current(self):
		return self.with_relations().filter(is_active=True, committee_term__is_active=True)

	def history(self):
		return self.with_relations()


class Assignment(models.Model):
	member = models.ForeignKey('accounts.User', on_delete=models.PROTECT, related_name='committee_assignments')
	committee_term = models.ForeignKey(CommitteeTerm, on_delete=models.PROTECT, related_name='assignments')
	wing = models.ForeignKey(Wing, on_delete=models.PROTECT, related_name='assignments', null=True, blank=True)
	position = models.ForeignKey(Position, on_delete=models.PROTECT, related_name='assignments')
	assigned_at = models.DateTimeField(default=timezone.now, db_index=True)
	is_active = models.BooleanField(default=True, db_index=True)
	notes = models.TextField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)

	objects = AssignmentQuerySet.as_manager()

	class Meta:
		ordering = ['-assigned_at', '-created_at']
		constraints = [
			models.UniqueConstraint(
				fields=['member', 'committee_term', 'position'],
				condition=Q(wing__isnull=True),
				name='unique_assignment_without_wing',
			),
			models.UniqueConstraint(
				fields=['member', 'committee_term', 'wing', 'position'],
				condition=Q(wing__isnull=False),
				name='unique_assignment_with_wing',
			),
		]
		indexes = [
			models.Index(fields=['member', 'committee_term']),
			models.Index(fields=['committee_term', 'wing']),
			models.Index(fields=['committee_term', 'position']),
			models.Index(fields=['is_active', 'assigned_at']),
			models.Index(fields=['committee_term', 'is_active']),
		]

	def clean(self):
		super().clean()
		if self.committee_term_id and self.assigned_at and self.assigned_at.date() < self.committee_term.start_date:
			raise ValidationError({'assigned_at': 'assigned_at cannot be earlier than the committee term start date.'})

	def __str__(self):
		wing_name = self.wing.name if self.wing else 'No Wing'
		member_name = f"{self.member.first_name} {self.member.last_name or ''}".strip() or self.member.sec_userid
		return f"{member_name} - {self.position.title} - {wing_name}"
