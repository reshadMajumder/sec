from rest_framework import serializers
import datetime
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken



class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    image = serializers.ImageField(required=False)
    enrollment_year = serializers.IntegerField(required=True)
    enrollment_semester = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            'id',
            'sec_userid',
            'email',
            'password',
            'first_name',
            'last_name',
            'image',
            'phone',
            'whatsapp',
            'facebook_profile',
            'personal_email',
            'present_address',
            'permanent_address',
            'student_id',
            'registration_number',
            'enrollment_semester',
            'enrollment_year',
            'department',
            'batch',
            'section',
            'professional_skills',
            'organizational_skills',
            'interested_in',
            'other_professional_skill',
            'other_organizational_skill',
            'other_interest',
        ]
        read_only_fields = ['id', 'sec_userid']

    def create(self, validated_data):
        # Ensure users cannot set `sec_userid` manually; remove if present
        validated_data.pop('sec_userid', None)

        password = validated_data.pop('password')

        # Ensure enrollment_year is int and semester is normalized before creating user
        year = validated_data.get('enrollment_year')
        semester = validated_data.get('enrollment_semester')
        if year is not None:
            try:
                validated_data['enrollment_year'] = int(year)
            except Exception:
                validated_data['enrollment_year'] = datetime.date.today().year

        if semester is not None:
            validated_data['enrollment_semester'] = str(semester).upper()

        return User.objects.create_user(password=password, **validated_data)

    def validate_enrollment_semester(self, value):
        if not value:
            raise serializers.ValidationError('enrollment_semester is required.')
        val = str(value).strip().upper()
        allowed = {'SPRING', 'SUMMER', 'FALL'}
        if val not in allowed:
            raise serializers.ValidationError('enrollment_semester must be one of: SPRING, SUMMER, FALL')
        return val

    def validate_enrollment_year(self, value):
        try:
            year = int(value)
        except Exception:
            raise serializers.ValidationError('enrollment_year must be a valid year (integer).')

        current_year = datetime.date.today().year
        if year < 2000 or year > current_year + 1:
            raise serializers.ValidationError(f'enrollment_year must be between 2000 and {current_year + 1}.')
        return year




class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'sec_userid',
            'email',
            'first_name',
            'last_name',
            'image',
            'phone',
            'whatsapp',
            'facebook_profile',
            'personal_email',
            'present_address',
            'permanent_address',
            'student_id',
            'registration_number',
            'enrollment_semester',
            'enrollment_year',
            'department',
            'batch',
            'section',
            'professional_skills',
            'organizational_skills',
            'interested_in',
            'other_professional_skill',
            'other_organizational_skill',
            'other_interest',
            'is_email_verified',
            'is_payment_verified',
        ]
        read_only_fields = ['id', 'sec_userid', 'email', 'is_email_verified', 'is_payment_verified']

class LoginSerializer(serializers.Serializer):
    sec_userid = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        sec_userid = data.get('sec_userid')
        email = data.get('email')
        password = data.get('password')

        if not password:
            raise serializers.ValidationError("Password is required.")

        user = None

        if sec_userid:
            try:
                user = User.objects.get(sec_userid=sec_userid)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid SEC User ID or password.")

            if not user.is_active:
                raise serializers.ValidationError("This account is inactive.")

            if not user.is_payment_verified:
                raise serializers.ValidationError("Payment verification is required to login with SEC User ID. Use email and password instead.")

            if not user.check_password(password):
                raise serializers.ValidationError("Invalid SEC User ID or password.")

        elif email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid email or password.")

            if not user.is_active:
                raise serializers.ValidationError("This account is inactive.")

            if not user.check_password(password):
                raise serializers.ValidationError("Invalid email or password.")
        else:
            raise serializers.ValidationError("Email or SEC User ID is required.")

        if not user.is_email_verified:
            raise serializers.ValidationError("Email not verified. Please verify your email first.")

        data['user'] = user
        data['login_method'] = 'sec_userid' if sec_userid else 'email'
        return data

    def create_tokens(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }