# Generated by Django 4.1.1 on 2022-09-19 02:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='member',
            old_name='liked_thumnail',
            new_name='liked_thumbnail',
        ),
    ]
