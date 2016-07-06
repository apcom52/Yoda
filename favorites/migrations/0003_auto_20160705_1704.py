# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-05 14:04
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0006_auto_20150815_1722'),
        ('library', '__first__'),
        ('favorites', '0002_auto_20150806_0027'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='favorite',
            name='fav_id',
        ),
        migrations.RemoveField(
            model_name='favorite',
            name='fav_type',
        ),
        migrations.AddField(
            model_name='favorite',
            name='file',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='library.LibraryFile'),
        ),
        migrations.AddField(
            model_name='favorite',
            name='note',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='notes.Note'),
        ),
        migrations.AddField(
            model_name='favorite',
            name='type',
            field=models.IntegerField(choices=[(1, 'Заметка'), (2, 'Файл')], default=1, verbose_name='Тип закладки'),
        ),
        migrations.AlterField(
            model_name='favorite',
            name='login',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]