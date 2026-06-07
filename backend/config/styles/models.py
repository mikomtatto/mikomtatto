from django.db import models
from cloudinary.models import CloudinaryField

class TattooStyle(models.Model):
    name = models.CharField(max_length=100, verbose_name='Stil Adı')
    slug = models.SlugField(unique=True, verbose_name='Slug')
    description = models.TextField(verbose_name='Açıklama')
    image = CloudinaryField('image', folder='styles/', blank=True, verbose_name='Stil Fotoğrafı')
    price_range = models.CharField(max_length=50, blank=True, verbose_name='Fiyat Aralığı')
    is_active = models.BooleanField(default=True, verbose_name='Aktif')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name = 'Dövme Stili'
        verbose_name_plural = 'Dövme Stilleri'
        ordering = ['name']

    def __str__(self):
        return self.name
