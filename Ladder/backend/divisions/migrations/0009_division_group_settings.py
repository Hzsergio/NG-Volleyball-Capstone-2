# Generated by Django 5.0.3 on 2024-04-23 05:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('divisions', '0008_division_defaultlocation'),
    ]

    operations = [
        migrations.AddField(
            model_name='division',
            name='group_settings',
            field=models.JSONField(default=dict),
        ),
    ]
