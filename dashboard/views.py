from django.shortcuts import render
from django.shortcuts import redirect
from django.urls import reverse
# Create your views here.


def home_view(request,):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            return render(request, "admin_templates/dashboard.html")
        else:
            return render(request, "employee/dashboard.html")
    else:
        return redirect(reverse("acounts:login"))
    return render(request, "dashboard/home.html")
