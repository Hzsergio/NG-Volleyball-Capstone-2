from django.db import models
from django.core.exceptions import ValidationError
from users.models import User
from team.models import Team
from django.utils import timezone


class Division(models.Model):
    name = models.CharField(max_length=55, primary_key=True)
    admin = models.ForeignKey(User, on_delete=models.CASCADE)
    publicProfile = models.ImageField(
        upload_to='profile_images', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    category = models.TextField(blank=True, null=True)
    defaultLocation = models.TextField(blank=True, null=True)
    group_settings = models.JSONField(default=dict)

    TOURNAMENT_TYPE_CHOICES = [
        ('single', 'Single'),
        ('group', 'Group'),
    ]
    tournament_type = models.CharField(
        max_length=10, choices=TOURNAMENT_TYPE_CHOICES, blank=False)
    start_date = models.DateField()
    end_date = models.DateField()

    class Status(models.TextChoices):
        NOT_STARTED = 'n', 'Not Started'
        IN_PROGRESS = 'i', 'In Progress'
        FINISHED = 'f', 'Finished'
        VOID = 'v', 'Void'

    status = models.CharField(max_length=1, choices=Status.choices, null=True)

    def clean(self):
        # Ensure end_date is not before start_date
        if self.end_date < self.start_date:
            raise ValidationError("End date cannot be before start date.")

        # Ensure start_date and end_date are not in the past
        if self.start_date < timezone.now().date():
            raise ValidationError("Start date cannot be in the past.")
        if self.end_date < timezone.now().date():
            raise ValidationError("End date cannot be in the past.")

    def __str__(self):
        return self.name


class TeamInDivision(models.Model):
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    position = models.PositiveIntegerField(null=True)

    class Meta:
        unique_together = ('division', 'team')

    def __str__(self):
        return f"{self.team} in {self.division}"

    # def clean(self):
    #     # Check if there's any other team in the same division with the same position
    #     if TeamInDivision.objects.filter(division=self.division, position=self.position).exclude(pk=self.pk).exists():
    #         raise ValidationError("A team in this division already occupies this position.")

    # def save(self, *args, **kwargs):
    #     if not self.position:
    #         # Calculate the next possible position for the team in the division
    #         max_position = TeamInDivision.objects.filter(division=self.division).aggregate(Max('position'))['position__max']
    #         if max_position is None:
    #             max_position = 0
    #         self.position = max_position + 1

    #     super().save(*args, **kwargs)
