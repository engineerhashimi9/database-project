from django.shortcuts import render

# Create your views here.

from .models import Department, Jobs


def login(request):
    return render(request, "acounts/login.html")


# create a new departement
# newd = Department.objects.create(dp_name="SE")
# newd.save()
new = Jobs.objects.create(job="AI Engineer")
new.save()
# itis working
