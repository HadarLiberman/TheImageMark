from django.http import HttpResponse
from django.http import JsonResponse
from django.conf import settings
from PIL import Image as image1
import io
import os
import base64
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

@api_view(['PUT', 'DELETE'])
def images_detail(request, pk):
    try:
        image = Image.objects.get(pk=pk)
    except Image.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ImageSerializer(student, data=request.data,context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def get_image(request):
    source_image_file_name = 'washing_machine'
    image_path = os.path.join(settings.BASE_DIR, f"assets/{source_image_file_name}.png")

    with open(image_path, 'rb') as f:
        image_data = f.read()

    response = HttpResponse(image_data, content_type='image/png')
    response['filename'] = source_image_file_name

    return response

@api_view(['POST'])
def process_rectangle(request):
    request_data = json.loads(request.body)
    image_settings = request_data.get("image_settings")
    print(image_settings)
    serializer = ImageSerializer(data=image_settings)
    if serializer.is_valid():
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)

#     # Get the rectangle coordinates from the request
# #     x1 = request.POST.get('x1')
# #     y1 = request.POST.get('y1')
# #     x2 = request.POST.get('x2')
# #     y2 = request.POST.get('y2')
# #
# #     # Get the image name from the request
    #image_name = "lala.png"
# #
# #     # Get the image file from the request
#     received_image_file = data.image_file
#
# #
# #  # Save the image file to the "assets" folder in the file system
#     assets_folder = os.path.join(settings.BASE_DIR, 'assets')
#     image_path = os.path.join(assets_folder, image_name)
#     with open(image_path, 'wb+') as destination:
#         for chunk in image_file.chunks():
#             destination.write(chunk)
#

#     # Return a JSON response
#     return JsonResponse({'message': 'Rectangle processed successfully'})