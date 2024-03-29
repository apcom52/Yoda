# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-01 15:49
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_auto_20160701_1829'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='building',
            name='bonus',
        ),
        migrations.AddField(
            model_name='buildingbonus',
            name='building',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='game.Building'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='buildingbonusmodificator',
            name='building',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='game.Building'),
            preserve_default=False,
        ),
    ]
