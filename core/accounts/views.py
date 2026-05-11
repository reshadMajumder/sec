from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from rest_framework.views import APIView
from .otp_adapter import EmailOTPAdapter
from .utils import generate_otp
from core.throttles import AuthRateThrottle, OTPRateThrottle
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from payments.models import Payment

class RegisterView(generics.CreateAPIView):
    """
    Register a normal user and send OTP via email.
    Tokens will be issued only after OTP verification.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    authentication_classes = []


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate and save OTP
        otp_code = generate_otp()
        user.otp = otp_code
        user.save()

        # Send OTP via email adapter
        otp_sender = EmailOTPAdapter()
        otp_sender.send_otp(user, otp_code)

        return Response({
            "message": "Registration successful. OTP sent to your email.",
            "user": {
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        }, status=status.HTTP_201_CREATED)



class ProfileView(generics.RetrieveUpdateAPIView):
    """
    user can view and updte profile
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


    def retrieve(self, request, *args, **kwargs):
        user = request.user

        if not user.is_email_verified:
            return Response({"message": "Verify your email first."}, status=status.HTTP_403_FORBIDDEN)

        # Check all member registration payments (yearly and full)
        yearly_payment = (
            Payment.objects.filter(
                user=user,
                payment_type=Payment.TYPE_MEMBER_REGISTRATION_YEARLY,
            )
            .order_by('-created_at')
            .first()
        )
        full_payment = (
            Payment.objects.filter(
                user=user,
                payment_type=Payment.TYPE_MEMBER_REGISTRATION_FULL,
            )
            .order_by('-created_at')
            .first()
        )

        # Check if all existing member registration payments are successful
        all_member_payments_successful = True
        pending_payment = None

        if yearly_payment and yearly_payment.status != Payment.STATUS_SUCCESS:
            all_member_payments_successful = False
            if yearly_payment.status == Payment.STATUS_PENDING:
                pending_payment = yearly_payment

        if full_payment and full_payment.status != Payment.STATUS_SUCCESS:
            all_member_payments_successful = False
            if full_payment.status == Payment.STATUS_PENDING:
                pending_payment = full_payment

        # Only allow access if all existing member registration payments are successful
        if (yearly_payment or full_payment) and all_member_payments_successful:
            serializer = self.get_serializer(user)
            return Response(
                {
                    "message": "Profile fetched successfully.",
                    "user": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        # If there is a pending member registration payment, inform the user to wait
        if pending_payment:
            return Response(
                {"message": "Your member registration payment is pending. Please wait for approval."},
                status=status.HTTP_202_ACCEPTED,
            )

        # Otherwise require the user to complete payment
        return Response(
            {"message": "Complete the payment first."},
            status=status.HTTP_403_FORBIDDEN,
        )



class LoginView(APIView):
    """
    User login view that returns JWT tokens upon successful authentication.
    
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    authentication_classes = []



    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            user = serializer.validated_data['user']
            tokens = serializer.create_tokens(user)

            return Response({
                'message': 'Login successful',
                'login_method': serializer.validated_data.get('login_method'),
                'access': tokens['access'],
                'refresh': tokens['refresh'],
            }, status=status.HTTP_200_OK)

        except serializers.ValidationError as ve:
            return Response({
                'message': str(ve),
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'message': 'An error occurred during login',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SuperuserLoginView(APIView):
    """
    Dedicated login endpoint for superusers only.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthRateThrottle]
    authentication_classes = []

    @swagger_auto_schema(
        operation_summary="Superuser login",
        operation_description="Login endpoint that only allows superuser accounts.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['sec_userid', 'password'],
            properties={
                'sec_userid': openapi.Schema(type=openapi.TYPE_STRING, description='Superuser SEC User ID.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='Superuser account password.'),
            },
            examples={
                'application/json': {
                    'sec_userid': 'SEC00000001',
                    'password': 'your-password'
                }
            },
        ),
        responses={
            200: openapi.Response(
                description='Superuser login successful',
                examples={
                    'application/json': {
                        'message': 'Superuser login successful',
                        'access': 'jwt-access-token',
                        'refresh': 'jwt-refresh-token'
                    }
                }
            ),
            400: 'Validation error',
            401: 'Invalid credentials',
            403: 'Not a superuser'
        }
    )
    def post(self, request):
        try:
            sec_userid = request.data.get('sec_userid')
            password = request.data.get('password')

            if not sec_userid or not password:
                return Response(
                    {'message': 'sec_userid and password are required.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = authenticate(request=request, sec_userid=sec_userid, password=password)
            if not user:
                return Response(
                    {'message': 'Invalid credentials.'},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

            if not user.is_superuser:
                return Response(
                    {'message': 'Only superuser can login here.'},
                    status=status.HTTP_403_FORBIDDEN,
                )

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'message': 'Superuser login successful',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    'message': 'An error occurred during superuser login.',
                    'error': str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        



class LogoutView(APIView):
    """
    takes the refresh token and blacklist for logout
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_205_RESET_CONTENT)
        
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    """
    Verify OTP and mark the email as verified.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRateThrottle]
    authentication_classes = []


    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')

        if not email or not otp:
            return Response({"detail": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if user.otp != otp:
            return Response({"detail": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # OTP verified
        user.otp = None
        user.is_email_verified = True  # mark email as verified
        user.save()

        return Response({
            "detail": "OTP verified successfully.",
            "login_with": "email"
        }, status=status.HTTP_200_OK)

class ResendOTPView(APIView):
    """
    resend otp to the user email again with newly generated otp
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [OTPRateThrottle]
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        otp_code = generate_otp()
        user.otp = otp_code
        user.save()

        otp_sender = EmailOTPAdapter()
        otp_sender.send_otp(user, otp_code)

        return Response({"detail": "OTP resent successfully."}, status=status.HTTP_200_OK)


""" we will implement later"""

class ChangePasswordView(APIView):
    pass

class ForgotPasswordView(APIView):
    pass

class ResetPasswordView(APIView):
    pass

class PasswordResetConfirmView(APIView):
    pass
