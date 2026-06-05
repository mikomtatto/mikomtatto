from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AboutViewSet, ContactInfoViewSet, HeroBackgroundViewSet

router = DefaultRouter()
router.register(r'about', AboutViewSet, basename='about')
router.register(r'contact', ContactInfoViewSet, basename='contact')
router.register(r'hero-backgrounds', HeroBackgroundViewSet, basename='hero-background')

urlpatterns = [
    path('', include(router.urls)),
]
