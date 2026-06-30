from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsPlatformAdmin
from .models import College
from .serializers import CollegeSerializer
from .pagination import CollegePagination
from django.db.models import Q




class CollegeListView(APIView):
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get(self, request):
        search = request.query_params.get("search")
        queryset = College.objects.filter(
    is_active=True
).order_by("-created_at")

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(email_domain__icontains=search) |
                Q(location__icontains=search)
            )
            
        status_filter = request.query_params.get("is_active")

        if status_filter is not None:
            queryset = queryset.filter(
        is_active=status_filter.lower() == "true"
    )    

        paginator = CollegePagination()

        result_page = paginator.paginate_queryset(
            queryset,
            request
        )

        serializer = CollegeSerializer(
            result_page,
            many=True
        )

        return paginator.get_paginated_response(
            serializer.data
        )



class CollegeDetailView(APIView):
    permission_classes = [IsAuthenticated, IsPlatformAdmin]

    def get_college(self, pk):
        return get_object_or_404(
        College,
        pk=pk,
        is_active=True
    )

    def get(self, request, pk):
        college = self.get_college(pk)
        serializer = CollegeSerializer(college)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        college = self.get_college(pk)
        serializer = CollegeSerializer(college, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
    {
        "message": "College updated successfully.",
        "college": serializer.data,
    },
    status=status.HTTP_200_OK,
)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        college = self.get_college(pk)
      
        serializer = CollegeSerializer(college, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
    {
        "message": "College updated successfully.",
        "college": serializer.data,
    },
    status=status.HTTP_200_OK,
)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        college = self.get_college(pk)
        
        college.is_active = False
        college.save(update_fields=["is_active"])
        
        return Response(
            {"message": "College deactivated successfully."},
            status=status.HTTP_200_OK
        )