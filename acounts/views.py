from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.urls import reverse
# Create your views here.
from .forms import UserForm, LoginForm
from .models import Department, Jobs


def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]

            # authenticate user
            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request=request, user=user)
                return redirect(reverse("dashboard:dashboard"))
            else:
                form.add_error(None, "Invalid email or password")
    else:
        form = LoginForm()
    return render(request, "acounts/login.html", {"form": form})


# create a new departement
# newd = Department.objects.create(dp_name="SE")
# newd.save()

# itis working
