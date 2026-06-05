from rest_framework import serializers
from .models import Appointment

class AppointmentSerializer(serializers.ModelSerializer):
    style_name = serializers.CharField(source='style.name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = ['id', 'name', 'phone', 'email', 'date', 'time', 'style', 'style_name', 
                  'description', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
