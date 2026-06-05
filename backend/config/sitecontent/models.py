from django.db import models

class About(models.Model):
    title = models.CharField(max_length=200, verbose_name='Başlık')
    content = models.TextField(verbose_name='İçerik')
    image = models.ImageField(upload_to='about/', blank=True, verbose_name='Görsel')
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
