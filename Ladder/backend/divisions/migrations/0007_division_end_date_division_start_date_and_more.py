# Generated by Django 5.0.3 on 2024-04-19 03:00

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('divisions', '0006_division_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='division',
            name='end_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='division',
            name='start_date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='division',
            name='tournament_type',
            field=models.CharField(choices=[('single', 'Single'), ('group', 'Group')], default='group', max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='division',
            name='status',
            field=models.CharField(choices=[('n', 'Not Started'), ('i', 'In Progress'), ('f', 'Finished'), ('v', 'Void')], max_length=1, null=True),
        ),
    ]
