from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class Status(models.Model):
    st_id = models.AutoField(unique=True, primary_key=True)
    status = models.CharField(max_length=50)

    def __str__(self):
        return self.status


class Projects(models.Model):
    pr_id = models.AutoField(unique=True, primary_key=True)
    project_name = models.CharField(max_length=50)
    description = models.TextField()
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField(auto_now=False, auto_now_add=False)
    end_date = models.DateField(auto_now=False, auto_now_add=False)
    status = models.ForeignKey(
        Status, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.project_name


class Project_assignment(models.Model):
    assignment_id = models.AutoField(unique=True, primary_key=True)
    staff_id = models.ForeignKey("Users", on_delete=models.CASCADE)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    assignment_date = models.DateField(auto_now=False, auto_now_add=False)
    role = models.CharField(max_length=50)


class Task(models.Model):
    task_id = models.AutoField(unique=True, primary_key=True)
    project_id = models.ForeignKey(Projects, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=50)

    assigned_to = models.ForeignKey(
        "Users", on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField()
    created_date = models.DateField(auto_now=False, auto_now_add=False)
    status = models.CharField(max_length=50)
    due_date = models.DateField(auto_now=False, auto_now_add=False)
    completed_date = models.DateField(
        auto_now=False, auto_now_add=False, null=True, blank=True)

    def __str__(self):
        return self.task_name


class Department(models.Model):
    dp_id = models.AutoField(unique=True, primary_key=True)
    dp_name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.dp_id}-{self.dp_name}"


class Jobs(models.Model):
    jb_id = models.AutoField(unique=True, primary_key=True)
    job = models.CharField(max_length=50)

    def __str__(self):
        return self.job


class UsersManager(BaseUserManager):
    def create_customer(self, email, password, **kwargs):
        if not email:
            raise ValueError("email must be set!")
        if kwargs["department"]:
            kwargs["department"] = Department.objects.get(
                dp_id=kwargs["department"])

        if kwargs["job"]:
            kwargs["job"] = Jobs.objects.get(jb_id=kwargs["job"])
        email = self.normalize_email(email)
        user = self.model(email=email, **kwargs)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password, **kwargs):
        kwargs.setdefault("is_staff", True)
        kwargs.setdefault("is_superuser", True)
        kwargs.setdefault("is_active", True)
        if kwargs.get("is_staff") is not True:
            raise ValueError("invalid operation")
        if kwargs.get("is_superuser") is not True:
            raise ValueError("invalid operation")
        return self.create_customer(email, password, **kwargs)


class Users(AbstractBaseUser, PermissionsMixin):
    """
    custom customer user model
    """
    id = models.AutoField(unique=True, primary_key=True)
    name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    birth_date = models.DateField(auto_now=False, auto_now_add=False)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=13, unique=True, default="")
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    department = models.ForeignKey(
        Department, on_delete=models.SET_NULL, null=True, blank=True)
    job = models.ForeignKey(
        Jobs, on_delete=models.SET_NULL, null=True, blank=True)
    hire_date = models.DateField(
        auto_now_add=True, auto_now=False, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_date = models.DateField(auto_now_add=True)
    ####
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "last_name",
                       "birth_date", "phone", "salary", "department", "job"]
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)

    objects = UsersManager()

    def __str__(self):
        return self.email


class Daily_work_report(models.Model):
    report_id = models.AutoField(unique=True, primary_key=True)
    user_id = models.ForeignKey(Users, on_delete=models.CASCADE)
    assignment_id = models.ForeignKey(
        Project_assignment, on_delete=models.CASCADE)
    reports_date = models.DateField(auto_now=False, auto_now_add=False)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2)
    work_description = models.TextField()

    def __str__(self):
        return "None"
