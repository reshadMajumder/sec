import uuid
import secrets
import re
import datetime

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from cloudinary.models import CloudinaryField


class CustomUserManager(BaseUserManager):

    def _generate_unique_sec_userid(self):
        # legacy fallback if no context provided: random numeric id
        for _ in range(10):
            candidate = f"SEC{secrets.randbelow(10**8):08d}"
            if not self.model.objects.filter(sec_userid=candidate).exists():
                return candidate

        return 'SEC' + uuid.uuid4().hex[:12]

    def _generate_unique_sec_userid_with_context(self, year=None, semester=None):
        """
        Generate sec_userid with pattern: SEC + YY + semester_code + sequence
        where semester_code: SPRING=01, SUMMER=02, FALL=03
        sequence is a zero-padded 5-digit number, e.g. SEC260300001
        """
        sem_map = {
            'SPRING': '01',
            'SUMMER': '02',
            'FALL': '03',
        }

        if year:
            try:
                yy = int(str(year)[-2:])
            except Exception:
                yy = datetime.date.today().year % 100
        else:
            yy = datetime.date.today().year % 100

        sem_code = '00'
        if semester:
            sem_code = sem_map.get(str(semester).upper(), '00')

        prefix = f"{yy:02d}{sem_code}"

        # find highest existing sequence for this prefix
        qs = self.model.objects.filter(sec_userid__startswith=prefix).order_by('-sec_userid')
        if not qs.exists():
            seq = 1
        else:
            last = qs.first().sec_userid
            # extract trailing digits after prefix
            tail = last.replace(prefix, '')
            try:
                seq = int(re.sub(r"[^0-9]", "", tail)) + 1
            except Exception:
                seq = 1

        return f"{prefix}{seq:05d}"

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            raise ValueError("Email must be provided")

        email = self.normalize_email(email)

        sec_userid = extra_fields.pop('sec_userid', None)

        # If caller provided enrollment context, use it to build a deterministic SEC id
        enrollment_year = extra_fields.get('enrollment_year') or extra_fields.get('enrollment_year')
        enrollment_semester = extra_fields.get('enrollment_semester') or extra_fields.get('enrollment_semester')

        if not sec_userid:
            try:
                sec_userid = self._generate_unique_sec_userid_with_context(
                    year=enrollment_year, semester=enrollment_semester
                )
            except Exception:
                sec_userid = self._generate_unique_sec_userid()

        user = self.model(
            sec_userid=sec_userid,
            email=email,
            **extra_fields
        )

        user.set_password(password)

        user.is_staff = extra_fields.get('is_staff', False)
        user.is_superuser = extra_fields.get('is_superuser', False)

        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    # =========================
    # CHOICES
    # =========================

    SEMESTER_CHOICES = (
        ('SPRING', 'Spring'),
        ('SUMMER', 'Summer'),
        ('FALL', 'Fall'),
    )

    DEPARTMENT_CHOICES = (
        ('SWE', 'Software Engineering'),
        ('CSE', 'Computer Science & Engineering'),
        ('ITM', 'Information Technology & Management'),
        ('MCT', 'Multimedia & Creative Technology'),
        ('CIS', 'Computing & Information System'),
    )

    # =========================
    # AUTH SECTION
    # =========================

    sec_userid = models.CharField(max_length=32,unique=True,editable=False)

    email = models.EmailField(unique=True)

    otp = models.CharField(max_length=6,blank=True,null=True)

    is_email_verified = models.BooleanField(default=False,db_index=True)
    is_payment_verified = models.BooleanField(default=False,db_index=True)

    is_active = models.BooleanField(default=True,db_index=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    # =========================
    # BASIC INFORMATION
    # =========================

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True)

    image = CloudinaryField('profile_image',blank=True,null=True)

    phone = models.CharField(max_length=20,blank=True,null=True)

    whatsapp = models.CharField(max_length=20,blank=True,null=True)

    facebook_profile = models.URLField(blank=True,null=True)

    personal_email = models.EmailField(blank=True,null=True)

    present_address = models.TextField(blank=True,null=True)

    permanent_address = models.TextField(blank=True,null=True)

    # =========================
    # UNIVERSITY INFORMATION
    # =========================

    student_id = models.CharField(max_length=30,unique=True,blank=True,null=True)

    registration_number = models.CharField(max_length=50,blank=True,null=True)

    enrollment_semester = models.CharField(max_length=10,choices=SEMESTER_CHOICES,blank=True,null=True)

    enrollment_year = models.PositiveIntegerField(blank=True,null=True)

    department = models.CharField(max_length=10,choices=DEPARTMENT_CHOICES,blank=True,null=True)

    batch = models.CharField(max_length=20,blank=True,null=True)

    section = models.CharField(max_length=20,blank=True,null=True)

    # =========================
    # SKILLS & INTERESTS
    # =========================

    professional_skills = models.JSONField(default=list,blank=True)

    organizational_skills = models.JSONField(default=list,blank=True)

    interested_in = models.JSONField(default=list,blank=True)

    other_professional_skill = models.CharField(max_length=255,blank=True,null=True)

    other_organizational_skill = models.CharField(max_length=255,blank=True,null=True)

    other_interest = models.CharField(max_length=255,blank=True,null=True)

    # =========================
    # MANAGER CONFIG
    # =========================

    objects = CustomUserManager()

    USERNAME_FIELD = 'sec_userid'
    REQUIRED_FIELDS = ['email']

    # =========================
    # METHODS
    # =========================

    def save(self, *args, **kwargs):

        if not self.sec_userid:
            self.sec_userid = CustomUserManager()._generate_unique_sec_userid()

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.sec_userid} ({self.email})"