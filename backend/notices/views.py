from django.db.models import Q
from django.shortcuts import get_object_or_404
from notifications.services import notify_students
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser

from accounts.models import User
from students.models import Student

from .models import Notice
from .serializers import NoticeSerializer
from .filters import NoticeFilter


class NoticeListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user

        if user.role == User.Role.COLLEGE_ADMIN:
            college = user.collegeadminprofile.college
            notices = (
                Notice.objects.filter(college=college)
                .select_related("college", "department", "posted_by")
                .order_by("-is_pinned", "-created_at")
            )

        elif user.role == User.Role.HOD:
            department = user.hodprofile.department
            notices = (
                Notice.objects.filter(
                    Q(scope=Notice.Scope.COLLEGE, college=department.college)
                    | Q(scope=Notice.Scope.DEPARTMENT, department=department)
                )
                .select_related("college", "department", "posted_by")
                .order_by("-is_pinned", "-created_at")
            )

        elif user.role == User.Role.STUDENT:
            student = get_object_or_404(Student, user=user)
            notices = (
                Notice.objects.filter(
                    Q(scope=Notice.Scope.COLLEGE, college=student.department.college)
                    | Q(scope=Notice.Scope.DEPARTMENT, department=student.department)
                )
                .select_related("college", "department", "posted_by")
                .order_by("-is_pinned", "-created_at")
            )

        else:
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notice_filter = NoticeFilter(request.GET, queryset=notices)
        serializer = NoticeSerializer(notice_filter.qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user
        serializer = NoticeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        scope = serializer.validated_data.get("scope")

        if user.role == User.Role.COLLEGE_ADMIN:
            if scope != Notice.Scope.COLLEGE:
                return Response(
                    {"detail": "College Admin can create only college-wide notices."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            notice = serializer.save(
                posted_by=user,
                college=user.collegeadminprofile.college,
                department=None,
            )

        elif user.role == User.Role.HOD:
            if scope != Notice.Scope.DEPARTMENT:
                return Response(
                    {"detail": "HOD can create only department notices."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            department = user.hodprofile.department
            notice = serializer.save(
                posted_by=user,
                college=department.college,
                department=department,
            )

        else:
            return Response(
                {"detail": "You are not allowed to create notices."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Notify students based on scope
        if notice.scope == Notice.Scope.COLLEGE:
            students = Student.objects.filter(department__college=notice.college)
        elif notice.scope == Notice.Scope.DEPARTMENT:
            students = Student.objects.filter(department=notice.department)
        else:
            students = Student.objects.none()


        notify_students(
    students=list(students),
    title="New Notice",
    message=f"New notice: {notice.title}",
    notice=notice,
    data={
        "type": "notice",
        "notice_id": str(notice.id),
    },
)    

        return Response(
            NoticeSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED,
        )


class NoticeDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, request, pk):
        user = request.user

        if user.role == User.Role.COLLEGE_ADMIN:
            return get_object_or_404(
                Notice.objects.select_related("college", "department", "posted_by"),
                pk=pk,
                college=user.collegeadminprofile.college,
            )

        elif user.role == User.Role.HOD:
            department = user.hodprofile.department
            return get_object_or_404(
                Notice.objects.select_related("college", "department", "posted_by").filter(
                    Q(scope=Notice.Scope.COLLEGE, college=department.college)
                    | Q(scope=Notice.Scope.DEPARTMENT, department=department)
                ),
                pk=pk,
            )

        elif user.role == User.Role.STUDENT:
            student = get_object_or_404(Student, user=user)
            return get_object_or_404(
                Notice.objects.select_related("college", "department", "posted_by").filter(
                    Q(scope=Notice.Scope.COLLEGE, college=student.department.college)
                    | Q(scope=Notice.Scope.DEPARTMENT, department=student.department)
                ),
                pk=pk,
            )

        return None

    def get(self, request, pk):
        notice = self.get_object(request, pk)
        serializer = NoticeSerializer(notice)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        notice = self.get_object(request, pk)
        user = request.user

        if notice.posted_by != user:
            return Response({"detail": "You can edit only your own notices."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == User.Role.COLLEGE_ADMIN and notice.scope != Notice.Scope.COLLEGE:
            return Response({"detail": "College Admin can edit only college notices."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == User.Role.HOD and notice.scope != Notice.Scope.DEPARTMENT:
            return Response({"detail": "HOD can edit only department notices."}, status=status.HTTP_403_FORBIDDEN)

        serializer = NoticeSerializer(notice, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            posted_by=notice.posted_by,
            college=notice.college,
            department=notice.department,
            scope=notice.scope,
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        notice = self.get_object(request, pk)
        user = request.user

        if notice.posted_by != user:
            return Response({"detail": "You can delete only your own notices."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == User.Role.COLLEGE_ADMIN and notice.scope != Notice.Scope.COLLEGE:
            return Response({"detail": "College Admin can delete only college notices."}, status=status.HTTP_403_FORBIDDEN)

        if user.role == User.Role.HOD and notice.scope != Notice.Scope.DEPARTMENT:
            return Response({"detail": "HOD can delete only department notices."}, status=status.HTTP_403_FORBIDDEN)

        notice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NoticePinToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        user = request.user

        if user.role == User.Role.COLLEGE_ADMIN:
            college = user.collegeadminprofile.college
            notice = get_object_or_404(
                Notice.objects.select_related("college", "department", "posted_by"),
                pk=pk,
                college=college,
                scope=Notice.Scope.COLLEGE,
            )

        elif user.role == User.Role.HOD:
            department = user.hodprofile.department
            notice = get_object_or_404(
                Notice.objects.select_related("college", "department", "posted_by"),
                pk=pk,
                department=department,
                scope=Notice.Scope.DEPARTMENT,
            )

        else:
            return Response(
                {"detail": "Only College Admin and HOD can pin or unpin notices."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if notice.posted_by != user:
            return Response(
                {"detail": "You can pin or unpin only your own notices."},
                status=status.HTTP_403_FORBIDDEN,
            )

        notice.is_pinned = not notice.is_pinned
        notice.save(update_fields=["is_pinned"])

        return Response(
            {
                "message": "Notice pinned successfully." if notice.is_pinned else "Notice unpinned successfully.",
                "is_pinned": notice.is_pinned,
                "notice": NoticeSerializer(notice).data,
            },
            status=status.HTTP_200_OK,
        )
