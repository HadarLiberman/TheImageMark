# Generated by Django 5.0.dev20230221075223 on 2023-02-22 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api_app', '0002_api_app'),
    ]

    operations = [
        migrations.RenameField(
            model_name='image',
            old_name='date_created',
            new_name='created_at',
        ),
        migrations.AddField(
            model_name='image',
            name='bottom_left_coordinate',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='image',
            name='bottom_right_coordinate',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='image',
            name='top_left_coordinate',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='image',
            name='top_right_coordinate',
            field=models.IntegerField(null=True),
        ),
    ]
