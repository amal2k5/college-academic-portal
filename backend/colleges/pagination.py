from rest_framework.pagination import PageNumberPagination


class CollegePagination(PageNumberPagination):
    page_size = 10