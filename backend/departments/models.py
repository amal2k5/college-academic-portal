from django.db import models
from colleges.models import College


class Department(models.Model):
    name = models.CharField(max_length=255)

    college = models.ForeignKey(
        College,
        on_delete=models.CASCADE,
        related_name="departments"
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name