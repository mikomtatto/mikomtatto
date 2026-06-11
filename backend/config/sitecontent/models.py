from django.db import models
from cloudinary.models import CloudinaryField

class About(models.Model):
    title = models.CharField(max_length=200, verbose_name='Başlık')
    content = models.TextField(verbose_name='İçerik')
    image = CloudinaryField('image', blank=True)
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncelleme Tarihi')

    class Meta:
        verbose_name = 'Hakkımızda'
        verbose_name_plural = 'Hakkımızda'

    def __str__(self):
        return self.title

class ContactInfo(models.Model):
    address = models.TextField(verbose_name='Adres')
    phone = models.CharField(max_length=20, verbose_name='Telefon')
    email = models.EmailField(verbose_name='E-posta')
    working_hours = models.TextField(verbose_name='Çalışma Saatleri')
    facebook = models.URLField(blank=True, verbose_name='Facebook')
    instagram = models.URLField(blank=True, verbose_name='Instagram')
    twitter = models.URLField(blank=True, verbose_name='Twitter')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncelleme Tarihi')

    class Meta:
        verbose_name = 'İletişim Bilgisi'
        verbose_name_plural = 'İletişim Bilgileri'

    def __str__(self):
        return self.email

class HeroBackground(models.Model):
    name = models.CharField(max_length=100, verbose_name='Arka Plan Adı')
    image = CloudinaryField('image', blank=True, null=True, verbose_name='Arka Plan Görseli')
    is_active = models.BooleanField(default=False, verbose_name='Aktif')
    is_preset = models.BooleanField(default=False, verbose_name='Hazır Arka Plan')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturma Tarihi')

    class Meta:
        verbose_name = 'Hero Arka Planı'
        verbose_name_plural = 'Hero Arka Planları'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.is_active:
            HeroBackground.objects.filter(is_active=True).update(is_active=False)
        super().save(*args, **kwargs)
