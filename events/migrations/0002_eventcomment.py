# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventComment',
            fields=[
                ('id', models.AutoField(serialize=False, verbose_name='ID', auto_created=True, primary_key=True)),
                ('comment', models.CharField(max_length=4096, verbose_name='Комментарий')),
                ('attaches', models.CharField(blank=True, max_length=6144, default='', verbose_name='Прикрепления', null=True)),
                ('pub_date', models.DateTimeField(verbose_name='Дата публикации', editable=False)),
                ('event', models.ForeignKey(to='events.Event')),
                ('login', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
