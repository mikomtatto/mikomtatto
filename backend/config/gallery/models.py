from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from cloudinary.models import CloudinaryField

class GalleryImage(models.Model):
    title = models.CharField(max_length=200, verbose_name='Başlık')
    image = CloudinaryField('image', folder='gallery/', verbose_name='Fotoğraf')
    style = models.ForeignKey('styles.TattooStyle', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Dövme Stili')
    description = models.TextField(blank=True, verbose_name='Açıklama')
    is_featured = models.BooleanField(default=False, verbose_name='Öne Çıkan')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name = 'Galeri Fotoğrafı'
        verbose_name_plural = 'Galeri Fotoğrafları'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    
    name = models.CharField(max_length=100, blank=True, verbose_name='Ad Soyad')
    is_anonymous = models.BooleanField(default=False, verbose_name='Anonim')
    rating = models.PositiveIntegerField(default=5, choices=[(i, str(i)) for i in range(1, 6)], verbose_name='Puan')
    text = models.TextField(verbose_name='Yorum')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name = 'Yorum'
        verbose_name_plural = 'Yorumlar'
        ordering = ['-created_at']

    def __str__(self):
        if self.is_anonymous:
            return f"Anonim - {self.created_at.strftime('%d.%m.%Y %H:%M')}"
        return f"{self.name} - {self.created_at.strftime('%d.%m.%Y %H:%M')}"

