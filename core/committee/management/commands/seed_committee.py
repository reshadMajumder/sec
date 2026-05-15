import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker

from accounts.models import User
from committee.models import CommitteeTerm, Wing, Position, Assignment, PositionCategory

class Command(BaseCommand):
    help = 'Seeds the database with fake users and committee assignments.'

    def handle(self, *args, **options):
        fake = Faker()
        self.stdout.write(self.style.SUCCESS('Seeding database with fake members and committee...'))

        # Create 20 random users
        users = []
        for i in range(20):
            sec_userid = f"faker_{fake.random_int(min=1000, max=9999)}_{i}"
            user, created = User.objects.get_or_create(
                sec_userid=sec_userid,
                defaults={
                    'email': fake.unique.email(),
                    'first_name': fake.first_name(),
                    'last_name': fake.last_name(),
                    'batch': str(fake.random_int(min=2015, max=2025)),
                    'department': fake.random_element(elements=('CS', 'ME', 'EE', 'CE', 'CIVIL', 'BBA')),
                    'phone': fake.phone_number()[:15]
                }
            )
            if created:
                user.set_password('testpass123')
                user.save()
            users.append(user)

        # Create a committee term
        today = timezone.now().date()
        term, _ = CommitteeTerm.objects.get_or_create(
            name=f'Faker Term {today.year}',
            defaults={
                'start_date': today - timedelta(days=30),
                'end_date': today + timedelta(days=335),
                'is_active': True,
                'description': 'Automatically generated committee term.'
            }
        )

        # Create some Wings
        wing_names = ['Technical Wing', 'Cultural Wing', 'Sports Wing', 'Marketing Wing']
        wings = []
        for name in wing_names:
            wing, _ = Wing.objects.get_or_create(name=name, defaults={'description': f'Description for {name}'})
            wings.append(wing)

        # Create some Positions
        positions = []
        positions_data = [
            ('President', 1, PositionCategory.LEADERSHIP, True),
            ('Vice President', 2, PositionCategory.LEADERSHIP, True),
            ('General Secretary', 3, PositionCategory.LEADERSHIP, True),
            ('Technical Lead', 4, PositionCategory.WING_MANAGEMENT, False),
            ('Cultural Lead', 4, PositionCategory.WING_MANAGEMENT, False),
            ('Member', 5, PositionCategory.WING_MEMBER, False),
        ]
        for title, level, cat, is_exec in positions_data:
            pos, _ = Position.objects.get_or_create(
                title=title,
                defaults={
                    'hierarchy_level': level,
                    'category': cat,
                    'is_executive': is_exec
                }
            )
            positions.append(pos)

        # Assign users to committee
        assigned_count = 0
        for user in users:
            position = random.choice(positions)
            wing = random.choice(wings) if position.category in [PositionCategory.WING_MANAGEMENT, PositionCategory.WING_MEMBER] else None

            if not Assignment.objects.filter(member=user, committee_term=term, position=position, wing=wing).exists():
                try:
                    # using tz aware datetime
                    assigned_at_dt = timezone.make_aware(timezone.datetime.combine(term.start_date + timedelta(days=random.randint(1, 10)), timezone.datetime.min.time()))
                    Assignment.objects.create(
                        member=user,
                        committee_term=term,
                        position=position,
                        wing=wing,
                        assigned_at=assigned_at_dt
                    )
                    assigned_count += 1
                except Exception as e:
                    self.stdout.write(self.style.WARNING(f"Could not assign user {user.sec_userid}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f'Successfully created {len(users)} users and {assigned_count} assignments!'))
