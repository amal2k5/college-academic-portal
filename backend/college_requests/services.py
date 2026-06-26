from django.db import transaction
from django.utils import timezone

from colleges.models import College

from accounts.services import (
    create_college_admin,
    generate_setup_token,
    send_setup_email,
    send_rejection_email,
)

from .models import CollegeRegistration


@transaction.atomic
def approve_registration(registration, approved_by):
    """
    Approve a college registration request.

    Workflow:
    1. Validate request status
    2. Create College
    3. Create College Admin
    4. Generate setup token
    5. Send setup email
    6. Update registration status

    Entire operation is atomic.
    """

    if registration.status != CollegeRegistration.Status.PENDING:
        raise ValueError(
            "Only pending registration requests can be approved."
        )

    # Extract email domain
    email_domain = registration.email.split("@")[-1]

    # Prevent duplicate college
    if College.objects.filter(email_domain=email_domain).exists():
        raise ValueError(
            "A college with this email domain already exists."
        )

    # Create College
    college = College.objects.create(
        name=registration.college_name,
        email_domain=email_domain,
        location=f"{registration.city}, {registration.state}",
    )

    # Split contact person's name
    names = registration.contact_person.strip().split()

    first_name = names[0]

    last_name = " ".join(names[1:]) if len(names) > 1 else ""

    # Create College Admin
    user = create_college_admin(
        first_name=first_name,
        last_name=last_name,
        email=registration.email,
        college_id=college.id,
    )

    # Generate setup token
    token = generate_setup_token(user)

    # Send setup email
    send_setup_email(user, token)

    # Update registration
    registration.status = CollegeRegistration.Status.APPROVED
    registration.approved_by = approved_by
    registration.approved_at = timezone.now()

    registration.save()

    return registration


@transaction.atomic
def reject_registration(
    registration,
    rejected_by,
    reason=""
):
    """
    Reject a college registration request.
    """

    if registration.status != CollegeRegistration.Status.PENDING:
        raise ValueError(
            "Only pending registration requests can be rejected."
        )

    registration.status = CollegeRegistration.Status.REJECTED
    registration.rejected_by = rejected_by
    registration.rejected_at = timezone.now()
    registration.rejection_reason = reason

    registration.save(
        update_fields=[
            "status",
            "rejected_by",
            "rejected_at",
            "rejection_reason",
        ]
    )

    send_rejection_email(
        email=registration.email,
        college_name=registration.college_name,
        reason=reason,
    )

    return registration