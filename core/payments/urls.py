from django.urls import path

from .views import AdminPaymentDetailAPIView, AdminPaymentListAPIView, AdminUserPaymentHistoryAPIView, UserPaymentAPIView

urlpatterns = [
	path('', UserPaymentAPIView.as_view(), name='user-payments'),
	path('admin/', AdminPaymentListAPIView.as_view(), name='admin-payments-list'),
	path('admin/<int:payment_id>/', AdminPaymentDetailAPIView.as_view(), name='admin-payment-detail'),
	path('admin/user/<int:user_id>/', AdminUserPaymentHistoryAPIView.as_view(), name='admin-user-payment-history'),
]