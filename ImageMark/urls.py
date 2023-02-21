"""
URL configuration for ImageMark project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/dev/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from api_app import views

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('', include("api_app.urls")),
    re_path(r'^api/images/$', views.images_list),
    re_path(r'^api/images/([0-9])$', views.images_detail),
    re_path(r'^api/get_image/$', views.get_image),
]
