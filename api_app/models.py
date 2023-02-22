from django.db import models

class Image(models.Model):
    image_name = models.CharField("Name", max_length=240)
    top_left_coordinate = models.CharField(max_length=60)
    top_right_coordinate = models.CharField(max_length=60)
    bottom_left_coordinate = models.CharField(max_length=60)
    bottom_right_coordinate = models.CharField(max_length=60)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
