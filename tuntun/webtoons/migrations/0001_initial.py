# Generated by Django 4.1 on 2022-09-04 16:09

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=10)),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('genre_type', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('validation', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Webtoon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('summary', models.TextField(blank=True)),
                ('day', models.CharField(max_length=10)),
                ('thumbnail', models.CharField(max_length=100)),
                ('page', models.CharField(max_length=100)),
                ('adult', models.BooleanField()),
                ('image_type', models.IntegerField()),
                ('service', models.CharField(max_length=10)),
                ('view_count', models.IntegerField()),
                ('authors', models.ManyToManyField(related_name='MyWebtoons', to='webtoons.author')),
                ('genres', models.ManyToManyField(related_name='Webtoons', to='webtoons.genre')),
                ('tags', models.ManyToManyField(related_name='Webtoons', to='webtoons.tag')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('updated_time', models.DateTimeField(auto_now=True)),
                ('rating', models.IntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)])),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews_user', to=settings.AUTH_USER_MODEL)),
                ('webtoon', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews_webtoon', to='webtoons.webtoon')),
            ],
        ),
    ]