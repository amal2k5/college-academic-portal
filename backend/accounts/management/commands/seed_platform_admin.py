from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = "Create the initial Platform Admin"

    def handle(self, *args, **kwargs):

        email = "dominic@gmail.com"

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(
                    "Platform Admin already exists."
                )
            )
            return

        user = User.objects.create_user(
            email=email,
            password="amal1234",
            first_name="Dominic",
            last_name="Admin",
        )

        user.role = User.Role.PLATFORM_ADMIN
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                "Platform Admin created successfully!"
            )
        )