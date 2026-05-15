from rest_framework import serializers

from .models import Payment


class PaymentCreateSerializer(serializers.ModelSerializer):
	sender_mobile = serializers.CharField(required=True)
	payment_type = serializers.ChoiceField(choices=Payment.PAYMENT_TYPE_CHOICES, required=True)
	transaction_id = serializers.CharField(required=True)
	class Meta:
		model = Payment
		fields = [
			'amount',
			'method',
			'sender_mobile',
			'transaction_id',
			'payment_type',
			'notes',
		]


class PaymentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Payment
		fields = [
			'id',
			'user',
			'amount',
			'method',
			'sender_mobile',
			'transaction_id',
			'payment_type',
			'status',
			'notes',
			'created_at',
			'updated_at',
		]
		read_only_fields = fields


class AdminPaymentUpdateSerializer(serializers.ModelSerializer):
	class Meta:
		model = Payment
		fields = [
			'amount',
			'method',
			'sender_mobile',
			'transaction_id',
			'payment_type',
			'status',
			'notes',
		]
