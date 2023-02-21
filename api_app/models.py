from django.db import models

class Image(models.Model):
    name = models.CharField("Name", max_length=240)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
