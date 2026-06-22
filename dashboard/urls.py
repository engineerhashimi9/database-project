
from .views import *
from django.urls import path


app_name = "dashboard"
urlpatterns = [
    path("", home_view, name="dashboard"),
]
