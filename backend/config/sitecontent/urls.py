from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, ContactInfoViewSet

router = DefaultRouter()
router.register(r'about', AboutViewSet, basename='about')
router.register(r'contact', ContactInfoViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
