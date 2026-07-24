from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import LostFoundPost, Comment
from .serializers import (
    LostFoundPostSerializer,
    CommentSerializer,
)
from .permissions import (
    IsOwnerOrReadOnly,
    IsStudent,
    IsModerator,
)
from .services import LostFoundService


class LostFoundListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsStudent()]
        return [AllowAny()]

    def get(self, request):

        queryset = LostFoundService.filter_posts(
            request.query_params
        )

        serializer = LostFoundPostSerializer(
            queryset,
            many=True
        )

        return Response(serializer.data)

    def post(self, request):

        serializer = LostFoundPostSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        post = LostFoundService.create_post(
            student=request.user.student_profile,
            validated_data=serializer.validated_data,
        )

        return Response(
            LostFoundPostSerializer(post).data,
            status=status.HTTP_201_CREATED,
        )


class LostFoundDetailAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsOwnerOrReadOnly,
    ]

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]

    def get_object(self, pk):
        return LostFoundService.get_post(pk)

    def get(self, request, pk):

        post = self.get_object(pk)

        serializer = LostFoundPostSerializer(post)

        return Response(serializer.data)

    def put(self, request, pk):

        post = self.get_object(pk)

        self.check_object_permissions(request, post)

        serializer = LostFoundPostSerializer(
            post,
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        post = LostFoundService.update_post(
            post,
            serializer.validated_data,
        )

        return Response(
            LostFoundPostSerializer(post).data
        )

    def patch(self, request, pk):

        post = self.get_object(pk)

        self.check_object_permissions(request, post)

        serializer = LostFoundPostSerializer(
            post,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)

        post = LostFoundService.update_post(
            post,
            serializer.validated_data,
        )

        return Response(
            LostFoundPostSerializer(post).data
        )

    def delete(self, request, pk):

        post = self.get_object(pk)

        self.check_object_permissions(request, post)

        LostFoundService.delete_post(post)

        return Response(
            {
                "message": "Post deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT,
        )
        
class ChangeStatusAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsOwnerOrReadOnly,
    ]

    def patch(self, request, pk):

        post = LostFoundService.get_post(pk)

        self.check_object_permissions(request, post)

        status_value = request.data.get("status")

        if status_value not in LostFoundPost.Status.values:
            return Response(
                {
                    "error": "Invalid status."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        post = LostFoundService.change_status(
            post,
            status_value,
        )

        return Response(
            {
                "message": "Status updated successfully.",
                "status": post.status,
            }
        )


class CommentListCreateAPIView(APIView):

    def get_permissions(self):
        if self.request.method == "POST":
            return [
                IsAuthenticated(),
                IsStudent(),
            ]
        return [AllowAny()]

    def get(self, request, post_id):

        comments = Comment.objects.filter(
            post_id=post_id
        ).select_related(
            "student",
            "student__user",
        )

        serializer = CommentSerializer(
            comments,
            many=True
        )

        return Response(serializer.data)

    def post(self, request, post_id):

        serializer = CommentSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        post = LostFoundService.get_post(post_id)

        comment = LostFoundService.add_comment(
            post=post,
            student=request.user.student_profile,
            comment_text=serializer.validated_data["comment"],
        )

        return Response(
            CommentSerializer(comment).data,
            status=status.HTTP_201_CREATED,
        )


class ContactRevealAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, pk):

        post = LostFoundService.get_post(pk)

        data = LostFoundService.reveal_contact(post)

        return Response(
            {
                "message": "Contact details retrieved successfully.",
                "data": data,
            },
            status=status.HTTP_200_OK,
        )
class ModeratePostAPIView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsModerator,
    ]

    def delete(self, request, pk):

        post = LostFoundService.get_post(pk)

        LostFoundService.moderate_post(post)

        return Response(
            {
                "message": "Post removed successfully by moderator."
            },
            status=status.HTTP_200_OK,
        )