# Generated by Django 4.1.1 on 2022-09-20 04:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_alter_member_profile_image_id"),
    ]

    operations = [
        migrations.RenameField(
            model_name="member",
            old_name="member_id",
            new_name="id",
        ),
    ]
