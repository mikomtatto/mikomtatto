from rest_framework import viewsets
from .models import About, ContactInfo, HeroBackground
from .serializers import AboutSerializer, ContactInfoSerializer, HeroBackgroundSerializer

class AboutViewSet(viewsets.ModelViewSet):
    queryset = About.objects.all()
    serializer_class = AboutSerializer

class ContactInfoViewSet(viewsets.ModelViewSet):
    queryset = ContactInfo.objects.all()
    serializer_class = ContactInfoSerializer

class HeroBackgroundViewSet(viewsets.ModelViewSet):
    queryset = HeroBackground.objects.all()
    serializer_class = HeroBackgroundSerializer
