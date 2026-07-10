import os

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary.uploader

from accounts.models import User
from students.models import Student

from .models import Assignment
from .serializers import AssignmentSerializer
from .filters import AssignmentFilter

# Image extensions that Cloudinary handles natively under resource_type="image".
_IMAGE_EXTS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.tiff', '.ico'}
# Video extensions for completeness.
_VIDEO_EXTS = {'.mp4', '.mov', '.avi', '.mkv', '.webm', '.ogg', '.flv'}


def _cloudinary_resource_type(file):
    """
    Return the correct Cloudinary resource_type for an uploaded file.

    Cloudinary classifies PDFs as 'image' when resource_type='auto' because it
    can generate image previews, which causes browsers to fail when opening the
    resulting URL as a document.  By explicitly using 'raw' for non-image files
    we ensure documents are stored and served with the correct Content-Type.
    """
    ext = os.path.splitext(file.name.lower())[1]
    if ext in _IMAGE_EXTS:
        return 'image'
    if ext in _VIDEO_EXTS:
        return 'video'
    return 'raw'

class AssignmentListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request):
        user = request.user

        if user.role == User.Role.HOD:
            department = user.hodprofile.department
            assignments = (
                Assignment.objects.filter(department=department)
                .select_related("department", "created_by")
                .order_by("deadline")
            )

        elif user.role == User.Role.STUDENT:
            student = get_object_or_404(Student, user=user)
            assignments = (
                Assignment.objects.filter(
                    department=student.department,
                    target_year=student.year
                )
                .select_related("department", "created_by")
                .order_by("deadline")
            )

        else:
            return Response(
                {"detail": "Permission denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        assignment_filter = AssignmentFilter(request.GET, queryset=assignments)
        serializer = AssignmentSerializer(assignment_filter.qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        user = request.user

        if user.role != User.Role.HOD:
            return Response(
                {"detail": "Only HOD can create assignments."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AssignmentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        department = user.hodprofile.department
        upload_result = None

        if "attachment" in request.FILES:
            attachment = request.FILES["attachment"]
            upload_result = cloudinary.uploader.upload(
                attachment,
                folder="assignments",
                resource_type=_cloudinary_resource_type(attachment),
            )
        print(upload_result)
        serializer.save(
            department=department,
            created_by=user,
            attachment_url=upload_result["secure_url"] if upload_result else None,
            attachment_public_id=upload_result["public_id"] if upload_result else None,
            attachment_resource_type=upload_result["resource_type"] if upload_result else None,
            attachment_original_name=request.FILES["attachment"].name if upload_result else None,
            attachment_format=upload_result.get("format") if upload_result else None,
        )

        return Response(
            AssignmentSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED
        )

        
        
class AssignmentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_object(self, request, pk):
        user = request.user

        if user.role == User.Role.HOD:
            department = user.hodprofile.department
            return get_object_or_404(
                Assignment.objects.select_related("department", "created_by"),
                pk=pk,
                department=department
            )

        elif user.role == User.Role.STUDENT:
            student = get_object_or_404(Student, user=user)
            return get_object_or_404(
                Assignment.objects.select_related("department", "created_by"),
                pk=pk,
                department=student.department,
                target_year=student.year
            )

        return None

    def get(self, request, pk):
        assignment = self.get_object(request, pk)
        if assignment is None:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        assignment = self.get_object(request, pk)
        if assignment is None:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        user = request.user
        if user.role != User.Role.HOD:
            return Response({"detail": "Only HOD can update assignments."}, status=status.HTTP_403_FORBIDDEN)

        if assignment.created_by != user:
            return Response({"detail": "You can update only your own assignments."}, status=status.HTTP_403_FORBIDDEN)

        serializer = AssignmentSerializer(assignment, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        upload_result = None
        if "attachment" in request.FILES:
            # Delete old Cloudinary asset if it exists
            if assignment.attachment_public_id:
                cloudinary.uploader.destroy(
                    assignment.attachment_public_id,
                    resource_type=assignment.attachment_resource_type or "auto",
                )

            attachment = request.FILES["attachment"]
            upload_result = cloudinary.uploader.upload(
                attachment,
                folder="assignments",
                resource_type=_cloudinary_resource_type(attachment),
            )

        serializer.save(
            department=assignment.department,
            created_by=assignment.created_by,
            attachment_url=upload_result["secure_url"] if upload_result else assignment.attachment_url,
            attachment_public_id=upload_result["public_id"] if upload_result else assignment.attachment_public_id,
            attachment_resource_type=upload_result["resource_type"] if upload_result else assignment.attachment_resource_type,
            attachment_original_name=request.FILES["attachment"].name if upload_result else assignment.attachment_original_name,
            attachment_format=upload_result.get("format") if upload_result else assignment.attachment_format,
        )

        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        assignment = self.get_object(request, pk)
        if assignment is None:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        user = request.user
        if user.role != User.Role.HOD:
            return Response({"detail": "Only HOD can delete assignments."}, status=status.HTTP_403_FORBIDDEN)

        if assignment.created_by != user:
            return Response({"detail": "You can delete only your own assignments."}, status=status.HTTP_403_FORBIDDEN)


        if assignment.attachment_public_id:
            cloudinary.uploader.destroy(
                assignment.attachment_public_id,
                resource_type=assignment.attachment_resource_type or "auto",
    )

        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
