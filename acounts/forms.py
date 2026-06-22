# forms.py

from django import forms
from .models import Users


class UserForm(forms.ModelForm):
    password = forms.CharField(
        widget=forms.PasswordInput()
    )

    class Meta:
        model = Users
        fields = [
            "name",
            "last_name",
            "birth_date",
            "email",
            "phone",
            "salary",
            "department",
            "job",
            "password",
        ]

    def save(self, commit=True):
        user = super().save(commit=False)

        # hash password
        user.set_password(self.cleaned_data["password"])

        if commit:
            user.save()

        return user


class LoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput())
