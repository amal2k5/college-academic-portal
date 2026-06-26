from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import College
from .serializers import CollegeSerializer


class CollegeListCreateView(APIView):
    """
    List all colleges and create a new college.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        colleges = College.objects.all()

        serializer = CollegeSerializer(
            colleges,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):
        serializer = CollegeSerializer(
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class CollegeDetailView(APIView):
    """
    Retrieve, update or delete a college.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        college = get_object_or_404(
            College,
            pk=pk
        )

        serializer = CollegeSerializer(college)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):
        college = get_object_or_404(
            College,
            pk=pk
        )

        serializer = CollegeSerializer(
            college,
            data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def patch(self, request, pk):
        college = get_object_or_404(
            College,
            pk=pk
        )

        serializer = CollegeSerializer(
            college,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    def delete(self, request, pk):
        college = get_object_or_404(
            College,
            pk=pk
        )

        college.delete()

        return Response(
            {
                "message": "College deleted successfully."
            },
            status=status.HTTP_204_NO_CONTENT
        )