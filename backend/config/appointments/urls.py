from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet
from .auth_views import admin_login

router = DefaultRouter()
router.register(r'', AppointmentViewSet)

urlpatterns = [
    path('admin-login/', admin_login),
    path('', include(router.urls)),
]
