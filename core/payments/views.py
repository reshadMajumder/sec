from decimal import Decimal, InvalidOperation

from rest_framework import permissions, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsAdmin
from .models import Payment
from .serializers import AdminPaymentUpdateSerializer, PaymentCreateSerializer, PaymentSerializer


class UserPaymentAPIView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request):
		try:
			serializer = PaymentCreateSerializer(data=request.data)
			serializer.is_valid(raise_exception=True)

			payment_type = serializer.validated_data.get('payment_type')
			# Only enforce one-time payment for full studentship; yearly can be paid multiple times
			if payment_type == Payment.TYPE_MEMBER_REGISTRATION_FULL:
				existing_full_payment = Payment.objects.filter(
					user=request.user,
					payment_type=Payment.TYPE_MEMBER_REGISTRATION_FULL,
				).exists()
				if existing_full_payment:
					return Response(
						{
							'message': 'Full studentship registration fee can be paid only once.',
						},
						status=status.HTTP_400_BAD_REQUEST,
					)

			payment = serializer.save(
				user=request.user,
				status=Payment.STATUS_PENDING,
			)

			response_serializer = PaymentSerializer(payment)
			return Response(
				{
					'message': 'Payment created successfully.',
					'payment': response_serializer.data,
				},
				status=status.HTTP_201_CREATED,
			)

		except serializers.ValidationError as ve:
			return Response(
				{
					'message': 'Validation failed.',
					'errors': ve.detail,
				},
				status=status.HTTP_400_BAD_REQUEST,
			)

		except Exception as e:
			return Response(
				{
					'message': 'An error occurred while creating payment.',
					'error': str(e),
				},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)

	def get(self, request):
		try:
			payments = Payment.objects.filter(user=request.user).order_by('-created_at')
			serializer = PaymentSerializer(payments, many=True)

			return Response(
				{
					'message': 'Payments fetched successfully.',
					'count': len(serializer.data),
					'payments': serializer.data,
				},
				status=status.HTTP_200_OK,
			)

		except Exception as e:
			return Response(
				{
					'message': 'An error occurred while fetching payments.',
					'error': str(e),
				},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)


class AdminPaymentListAPIView(APIView):
	permission_classes = [IsAdmin]

	def get(self, request):
		try:
			payments = Payment.objects.select_related('user').all()

			user_id = request.query_params.get('user_id')
			status_param = request.query_params.get('status')
			method = request.query_params.get('method')
			payment_type = request.query_params.get('payment_type')
			transaction_id = request.query_params.get('transaction_id')
			min_amount = request.query_params.get('min_amount')
			max_amount = request.query_params.get('max_amount')

			if user_id:
				payments = payments.filter(user_id=user_id)
			if status_param:
				payments = payments.filter(status=status_param)
			if method:
				payments = payments.filter(method=method)
			if payment_type:
				payments = payments.filter(payment_type=payment_type)
			if transaction_id:
				payments = payments.filter(transaction_id__icontains=transaction_id)

			if min_amount:
				try:
					payments = payments.filter(amount__gte=Decimal(min_amount))
				except (InvalidOperation, ValueError):
					return Response(
						{'message': 'min_amount must be a valid number.'},
						status=status.HTTP_400_BAD_REQUEST,
					)

			if max_amount:
				try:
					payments = payments.filter(amount__lte=Decimal(max_amount))
				except (InvalidOperation, ValueError):
					return Response(
						{'message': 'max_amount must be a valid number.'},
						status=status.HTTP_400_BAD_REQUEST,
					)

			allowed_sort_fields = {
				'id',
				'amount',
				'method',
				'payment_type',
				'status',
				'created_at',
				'updated_at',
			}
			sort_by = request.query_params.get('sort_by', 'created_at')
			sort_order = request.query_params.get('sort_order', 'desc').lower()

			if sort_by not in allowed_sort_fields:
				return Response(
					{'message': 'Invalid sort_by field.'},
					status=status.HTTP_400_BAD_REQUEST,
				)

			if sort_order not in {'asc', 'desc'}:
				return Response(
					{'message': 'sort_order must be asc or desc.'},
					status=status.HTTP_400_BAD_REQUEST,
				)

			ordering = sort_by if sort_order == 'asc' else f'-{sort_by}'
			payments = payments.order_by(ordering)

			serializer = PaymentSerializer(payments, many=True)
			return Response(
				{
					'message': 'All payments fetched successfully.',
					'count': len(serializer.data),
					'payments': serializer.data,
				},
				status=status.HTTP_200_OK,
			)

		except Exception as e:
			return Response(
				{
					'message': 'An error occurred while fetching all payments.',
					'error': str(e),
				},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)


class AdminPaymentDetailAPIView(APIView):
	permission_classes = [IsAdmin]

	def patch(self, request, payment_id):
		try:
			try:
				payment = Payment.objects.get(id=payment_id)
			except Payment.DoesNotExist:
				return Response(
					{'message': 'Payment not found.'},
					status=status.HTTP_404_NOT_FOUND,
				)

			serializer = AdminPaymentUpdateSerializer(payment, data=request.data, partial=True)
			serializer.is_valid(raise_exception=True)
			updated_payment = serializer.save()

			response_serializer = PaymentSerializer(updated_payment)
			return Response(
				{
					'message': 'Payment updated successfully.',
					'payment': response_serializer.data,
				},
				status=status.HTTP_200_OK,
			)

		except serializers.ValidationError as ve:
			return Response(
				{
					'message': 'Validation failed.',
					'errors': ve.detail,
				},
				status=status.HTTP_400_BAD_REQUEST,
			)

		except Exception as e:
			return Response(
				{
					'message': 'An error occurred while updating payment.',
					'error': str(e),
				},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR,
			)
