from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryImageViewSet, comment_list

router = DefaultRouter()
router.register(r'images', GalleryImageViewSet, basename='galleryimage')

urlpatterns = [
    path('', include(router.urls)),
    path('comments/', comment_list),
    path('comments/<int:pk>/', comment_list),
]
