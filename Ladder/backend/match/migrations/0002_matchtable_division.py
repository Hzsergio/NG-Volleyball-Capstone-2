# Generated by Django 5.0.3 on 2024-04-02 17:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('divisions', '0003_division_status'),
        ('match', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='matchtable',
            name='division',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='divisions.division'),
        ),
    ]
