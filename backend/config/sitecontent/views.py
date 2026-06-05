from rest_framework import viewsets
from .models import About, ContactInfo
from .serializers import AboutSerializer, ContactInfoSerializer

class AboutViewSet(viewsets.ModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer

class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer
