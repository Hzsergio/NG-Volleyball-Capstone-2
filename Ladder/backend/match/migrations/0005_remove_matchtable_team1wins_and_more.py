# Generated by Django 5.0.3 on 2024-04-23 16:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('match', '0004_alter_matchtable_status'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='matchtable',
            name='team1Wins',
        ),
        migrations.RemoveField(
            model_name='matchtable',
            name='team2Wins',
        ),
        migrations.AddField(
            model_name='matchtable',
            name='scores',
            field=models.JSONField(default=dict, null=True),
        ),
        migrations.AddField(
            model_name='matchtable',
            name='winner',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='matchtable',
            name='status',
            field=models.CharField(choices=[('i', 'inProgress'), ('s', 'scheduled'), ('v', 'void'), ('f', 'finished')], max_length=1, null=True),
        ),
    ]