from django.http import HttpResponse
from django.conf import settings
from PIL import Image as image1
import io
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Image
from .serializers import *

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
    image_path = os.path.join(settings.BASE_DIR, 'assets/washing_machine.png')

    with open(image_path, 'rb') as f:
          image = image1.open(f)
          image_data = image.tobytes()

    response = HttpResponse(image_data, content_type='image/png')
    response['Content-Disposition'] = 'attachment; filename="image.png"'

    return response