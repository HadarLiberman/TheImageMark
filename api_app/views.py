from django.http import HttpResponse
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from PIL import Image as image1
import io
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Image
from .serializers import *
import json

@api_view(['GET', 'POST'])
def images_list(request):
    if request.method == 'GET':
        data = Image.objects.all()
        serializer = ImageSerializer(data, context={'request': request}, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get_image(request):
    source_image_file_name = 'washing_machine'
    image_path = os.path.join(settings.BASE_DIR, f"assets/{source_image_file_name}.png")

    with open(image_path, 'rb') as f:
        image_data = f.read()

    response = HttpResponse(image_data, content_type='image/png')
    response['file-name'] = source_image_file_name

    return response

@api_view(['POST'])
@csrf_exempt
@require_http_methods(["POST"])
def process_rectangle(request):
    image_file = request.FILES['image']
    image_settings_string = request.POST.get('image_settings')
    image_settings = json.loads(image_settings_string)
    image_name=image_settings["image_name"]

    assets_folder = os.path.join(settings.BASE_DIR, 'assets')
    image_path = os.path.join(assets_folder, image_name)

    with open(image_path, 'wb+') as destination:
        for chunk in image_file.chunks():
            destination.write(chunk)

    serializer = ImageSerializer(data=image_settings)
    if serializer.is_valid():
        print("valid")
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)