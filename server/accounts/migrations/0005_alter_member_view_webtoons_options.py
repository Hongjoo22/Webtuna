# Generated by Django 4.1.1 on 2022-09-26 07:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_alter_member_view_webtoons_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='member_view_webtoons',
            options={'ordering': ['-id']},
        ),
    ]
