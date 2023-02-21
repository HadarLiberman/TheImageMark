from django.shortcuts import render
from django.http import HttpResponse

def index(response):
    return HttpResponse("Hello!")

def image(response):
    return HttpResponse("<h1>Image page</h1>")

def v1(response):
    return HttpResponse("<h1>Hello from another page</h1>")