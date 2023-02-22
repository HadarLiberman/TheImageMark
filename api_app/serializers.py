from rest_framework import serializers
from .models import Image

class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Image
        fields = ('pk', 'image_name', 'top_left_coordinate', 'top_right_coordinate','bottom_left_coordinate'
        ,'bottom_right_coordinate', 'created_at')