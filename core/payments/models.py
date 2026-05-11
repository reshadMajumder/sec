from django.conf import settings
from django.db import models


class Payment(models.Model):
	METHOD_CASH = 'cash'
	METHOD_BKASH = 'bkash'
	METHOD_NAGAD = 'nagad'

	PAYMENT_METHOD_CHOICES = [
		(METHOD_CASH, 'Cash'),
		(METHOD_BKASH, 'Bkash'),
		(METHOD_NAGAD, 'Nagad'),
	]

	TYPE_MEMBER_REGISTRATION_YEARLY = 'member_registration_yearly'
	TYPE_MEMBER_REGISTRATION_FULL = 'member_registration_full'
	TYPE_EVENT_REGISTRATION = 'event_registration'
	TYPE_OTHER = 'other'

	PAYMENT_TYPE_CHOICES = [
		(TYPE_MEMBER_REGISTRATION_YEARLY, 'Member Registration - Yearly'),
		(TYPE_MEMBER_REGISTRATION_FULL, 'Member Registration - Full Studentship'),
		(TYPE_EVENT_REGISTRATION, 'Event Registration'),
		(TYPE_OTHER, 'Other'),
	]

	STATUS_PENDING = 'pending'
	STATUS_SUCCESS = 'success'
	STATUS_FAILED = 'failed'

	STATUS_CHOICES = [
		(STATUS_PENDING, 'Pending'),
		(STATUS_SUCCESS, 'Success'),
		(STATUS_FAILED, 'Failed'),
	]

	user = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		on_delete=models.CASCADE,
		related_name='payments'
	)
	amount = models.DecimalField(max_digits=10, decimal_places=2)
	method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
	sender_mobile = models.CharField(max_length=20, blank=True, null=True)
	transaction_id = models.CharField(max_length=255, blank=True, null=True, unique=False)
	payment_type = models.CharField(
		max_length=50, choices=PAYMENT_TYPE_CHOICES, default=TYPE_OTHER
	)
	status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
	notes = models.TextField(blank=True, null=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		user_ident = getattr(self.user, 'email', str(self.user))
		return f"{user_ident} — {self.amount} ({self.method})"

