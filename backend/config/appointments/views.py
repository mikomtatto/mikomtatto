from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    
    def get_queryset(self):
        queryset = Appointment.objects.all()
        date = self.request.query_params.get('date')
        status_param = self.request.query_params.get('status')
        
        if date:
            queryset = queryset.filter(date=date)
        if status_param:
            queryset = queryset.filter(status=status_param)
            
        return queryset
