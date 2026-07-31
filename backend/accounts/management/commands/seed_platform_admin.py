import os
from django.core.management.base import BaseCommand, CommandError
from accounts.models import User


class Command(BaseCommand):
    help = "Create the initial Platform Admin"

    def handle(self, *args, **kwargs):

        email = os.environ.get("PLATFORM_ADMIN_EMAIL")
        password = os.environ.get("PLATFORM_ADMIN_PASSWORD")
        first_name = os.environ.get("PLATFORM_ADMIN_FIRST_NAME", "Platform")
        last_name = os.environ.get("PLATFORM_ADMIN_LAST_NAME", "Admin")

        if not email or not password:
            raise CommandError(
                "PLATFORM_ADMIN_EMAIL and PLATFORM_ADMIN_PASSWORD "
                "must be set as environment variables before running this command."
            )

        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(
                    "Platform Admin already exists."
                )
            )
            return

        user = User.objects.create_user(
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        user.role = User.Role.PLATFORM_ADMIN
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Platform Admin created successfully: {email}"
            )
        )