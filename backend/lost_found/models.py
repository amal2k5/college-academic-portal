from django.db import models
from cloudinary.models import CloudinaryField

from students.models import Student


class LostFoundPost(models.Model):

    class Category(models.TextChoices):
        ELECTRONICS = "ELECTRONICS", "Electronics"
        ID_CARD = "ID_CARD", "ID Card"
        BOOK = "BOOK", "Book"
        BAG = "BAG", "Bag"
        WALLET = "WALLET", "Wallet"
        KEYS = "KEYS", "Keys"
        OTHER = "OTHER", "Other"

    class Status(models.TextChoices):
        LOST = "LOST", "Lost"
        FOUND = "FOUND", "Found"
        RETURNED = "RETURNED", "Returned"

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="lost_found_posts",
    )

    title = models.CharField(max_length=200)

    description = models.TextField()

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
        default=Category.OTHER,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.LOST,
    )

    location = models.CharField(max_length=255)

    image = CloudinaryField(
        "image",
        folder="lost_found",
        blank=True,
        null=True,
    )

    contact_number = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Lost & Found Post"
        verbose_name_plural = "Lost & Found Posts"

    def __str__(self):
        return self.title


class Comment(models.Model):

    post = models.ForeignKey(
        LostFoundPost,
        on_delete=models.CASCADE,
        related_name="comments",
    )

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="lost_found_comments",
    )

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Comment"
        verbose_name_plural = "Comments"

    def __str__(self):
        return f"{self.student.user.email} - {self.post.title}"