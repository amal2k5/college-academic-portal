from django.contrib import admin

from .models import (
    User,
    CollegeAdminProfile,
    HODProfile,
    AccountSetupToken,
)

admin.site.register(User)
admin.site.register(CollegeAdminProfile)
admin.site.register(HODProfile)
admin.site.register(AccountSetupToken)