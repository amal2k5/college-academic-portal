from django.urls import path

from .views import (
    NoticeListCreateView,
    NoticeDetailView,
    NoticePinToggleView,
)

urlpatterns = [
    path(
        "",
        NoticeListCreateView.as_view(),
        name="notice-list-create",
    ),

    path(
        "<int:pk>/",
        NoticeDetailView.as_view(),
        name="notice-detail",
    ),

    path(
        "<int:pk>/pin/",
        NoticePinToggleView.as_view(),
        name="notice-pin-toggle",
    ),
]