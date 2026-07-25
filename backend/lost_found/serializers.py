from rest_framework import serializers
from .models import LostFoundPost, Comment


class LostFoundPostSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.user.get_full_name",
        read_only=True,
    )

    image_url = serializers.SerializerMethodField()

    class Meta:
        model = LostFoundPost
        fields = [
            "id",
            "student",
            "student_name",
            "title",
            "description",
            "category",
            "status",
            "location",
            "image",
            "image_url",
            "contact_number",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "student_name",
            "created_at",
            "updated_at",
        ]

    def create(self, validated_data):
        return LostFoundPost.objects.create(**validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    def get_image_url(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except Exception:
                return None
        return None


class CommentSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source="student.user.get_full_name",
        read_only=True,
    )

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "student",
            "student_name",
            "comment",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "student",
            "student_name",
            "created_at",
        ]

    def create(self, validated_data):
        return Comment.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.comment = validated_data.get(
            "comment",
            instance.comment,
        )
        instance.save()
        return instance