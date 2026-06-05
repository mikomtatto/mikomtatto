from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TattooStyleViewSet

router = DefaultRouter()
router.register(r'', TattooStyleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
