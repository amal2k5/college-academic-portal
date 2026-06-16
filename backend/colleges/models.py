from django.db import models


class College(models.Model):
    name = models.CharField(max_length=255)
    email_domain = models.CharField(max_length=255, unique=True)
    location = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="college_logos/", null=True, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name