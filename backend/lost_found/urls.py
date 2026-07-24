from django.urls import path

from .views import (
    LostFoundListCreateAPIView,
    LostFoundDetailAPIView,
    ChangeStatusAPIView,
    CommentListCreateAPIView,
    ContactRevealAPIView,
    ModeratePostAPIView,
)

urlpatterns = [
    # Lost & Found Posts
    path(
        "",
        LostFoundListCreateAPIView.as_view(),
        name="lost-found-list-create",
    ),
    path(
        "<int:pk>/",
        LostFoundDetailAPIView.as_view(),
        name="lost-found-detail",
    ),
    path(
        "<int:pk>/status/",
        ChangeStatusAPIView.as_view(),
        name="lost-found-change-status",
    ),

    # Comments
    path(
        "<int:post_id>/comments/",
        CommentListCreateAPIView.as_view(),
        name="lost-found-comments",
    ),
    path(
    "<int:pk>/claim/",
    ContactRevealAPIView.as_view(),
    name="contact-reveal",
),
    path(
    "<int:pk>/moderate/",
    ModeratePostAPIView.as_view(),
    name="moderate-post",
),
]