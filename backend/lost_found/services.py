from django.core.cache import cache
from django.shortcuts import get_object_or_404

from .models import LostFoundPost


class LostFoundService:
    CACHE_KEY = "lost_found_posts"

    @staticmethod
    def create_post(student, validated_data):
        """
        Create a new Lost & Found post.
        """
        post = LostFoundPost.objects.create(
            student=student,
            **validated_data
        )

        cache.delete(LostFoundService.CACHE_KEY)

        return post

    @staticmethod
    def filter_posts(query_params):
        """
        Filter Lost & Found posts.
        """
        queryset = LostFoundPost.objects.select_related(
            "student",
            "student__user",
        )

        status = query_params.get("status")
        category = query_params.get("category")
        location = query_params.get("location")
        title = query_params.get("title")
        include_returned = query_params.get("include_returned", "false").lower() == "true"

        if status:
            queryset = queryset.filter(status=status)
        elif not include_returned:
            queryset = queryset.exclude(status=LostFoundPost.Status.RETURNED)

        if category:
            queryset = queryset.filter(category=category)

        if location:
            queryset = queryset.filter(location__icontains=location)

        if title:
            queryset = queryset.filter(title__icontains=title)

        return queryset

    @staticmethod
    def update_post(post, validated_data):
        """
        Update an existing post.
        """
        for field, value in validated_data.items():
            setattr(post, field, value)

        post.save()

        cache.delete(LostFoundService.CACHE_KEY)

        return post

    @staticmethod
    def delete_post(post):
        """
        Delete a post.
        """
        post.delete()

        cache.delete(LostFoundService.CACHE_KEY)

    @staticmethod
    def moderate_post(post):
        """
        Remove a Lost & Found post by moderator.
        """
        post.delete()

        cache.delete(LostFoundService.CACHE_KEY)

    @staticmethod
    def change_status(post, status):
        """
        Update the status of a post.
        """
        if status not in LostFoundPost.Status.values:
            raise ValueError("Invalid status.")

        if post.status == LostFoundPost.Status.RETURNED:
            raise ValueError("Cannot change status of a returned item.")

        if post.status == LostFoundPost.Status.FOUND and status == LostFoundPost.Status.LOST:
            raise ValueError("Cannot revert a found item back to lost.")

        post.status = status
        post.save(update_fields=["status"])

        cache.delete(LostFoundService.CACHE_KEY)

        return post

    @staticmethod
    def reveal_contact(post):
        """
        Return contact details of the post owner.
        """
        return {
            "owner_name": post.student.user.get_full_name(),
            "email": post.student.user.email,
            "contact_number": post.contact_number,
        }

    @staticmethod
    def get_post(post_id):
        """
        Retrieve a Lost & Found post by ID.
        """
        return get_object_or_404(
            LostFoundPost.objects.select_related(
                "student",
                "student__user",
            ),
            pk=post_id,
        )
