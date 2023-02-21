from django.urls import path
from . import views

urlpatterns = [
path("", views.index, name="index"),
path("image/", views.image, name="image"),
path("v1/", views.v1, name="view 1"),
]