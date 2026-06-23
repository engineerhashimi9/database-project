from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import *
# Register your models here.


class CustomUserAdmin(UserAdmin):
    model = Users
    list_display = ["name", "last_name", "email", "is_staff"]
    list_filter = ["name", "email", "is_staff"]
    search_fields = ["name", "email"]
    ordering = ["name"]
    fieldsets = (
        ("Authentications", {
            "fields": (
                "name", "last_name", "email", "phone", "salary",  "birth_date", "department", "job"
            ),
        }),
        ("Permissions", {
            "fields": (
                "is_staff", "is_superuser", "is_verified", "is_active"
            ),
        }),
        ("important date", {
            "fields": (
                "last_login",
            ),
        }),
    )
    add_fieldsets = (
        ("Authentications", {
            "fields": (
                "name", "last_name", "birth_date", "email", "phone", "salary", "department", "job", "password1", "password2"
            ),
        }),
        ("Permissions", {
            "classes": ("wide",),
            "fields": (
                "is_staff", "is_superuser", "is_verified", "is_active"
            ),
        }),

    )


admin.site.register(Users, CustomUserAdmin)
admin.site.register(Status)
admin.site.register(Projects)
admin.site.register(Project_assignments)
admin.site.register(Tasks)
admin.site.register(Department)
admin.site.register(Daily_work_report)
