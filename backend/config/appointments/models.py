from django.db import models
from django.core.validators import RegexValidator
from django.core.mail import send_mail
from django.conf import settings

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Beklemede'),
        ('confirmed', 'Onaylandı'),
        ('completed', 'Tamamlandı'),
        ('cancelled', 'İptal Edildi'),
    ]

    name = models.CharField(max_length=100, verbose_name='Ad Soyad')
    phone = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Geçerli bir telefon numarası girin')],
        verbose_name='Telefon'
    )
    email = models.EmailField(verbose_name='E-posta')
    date = models.DateField(verbose_name='Tarih')
    time = models.TimeField(verbose_name='Saat')
    style = models.ForeignKey('styles.TattooStyle', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Dövme Stili')
    description = models.TextField(verbose_name='Açıklama')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Durum')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Güncelleme Tarihi')

    class Meta:
        verbose_name = 'Randevu'
        verbose_name_plural = 'Randevular'
        ordering = ['-date', '-time']

    def __str__(self):
        return f"{self.name} - {self.date} {self.time}"

    def send_status_email(self, old_status):
        """Send email notification when appointment status changes"""
        status_labels = {
            'pending': 'Beklemede',
            'confirmed': 'Onaylandı',
            'completed': 'Tamamlandı',
            'cancelled': 'İptal Edildi',
        }
        
        new_status_label = status_labels.get(self.status, self.status)
        
        # Email to customer
        customer_subject = f"Randevu Durum Güncellemesi - {new_status_label}"
        customer_message = f"""
Merhaba {self.name},

Randevunuzun durumu güncellendi:

Randevu Detayları:
- Tarih: {self.date}
- Saat: {self.time}
- Yeni Durum: {new_status_label}
{f"- Dövme Stili: {self.style.name}" if self.style else ""}
- Açıklama: {self.description}

{"Randevunuz onaylandı. Görüşmek üzere!" if self.status == 'confirmed' else 
 "Randevunuz tamamlandı. Teşekkür ederiz!" if self.status == 'completed' else 
 "Randevunuz iptal edildi. Herhangi bir sorunuz varsa lütfen bizimle iletişime geçin." if self.status == 'cancelled' else 
 "Randevunuz beklemede. En kısa sürede size dönüş yapacağız."}

İyi günler dileriz,
MikomTattoo
        """
        
        try:
            send_mail(
                customer_subject,
                customer_message.strip(),
                settings.DEFAULT_FROM_EMAIL,
                [self.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Customer email error: {e}")
        
        # Email to admin
        admin_subject = f"Randevu Durum Değişikliği - {self.name}"
        admin_message = f"""
Randevu durumu değişti:

Müşteri: {self.name}
Telefon: {self.phone}
E-posta: {self.email}
Tarih: {self.date}
Saat: {self.time}
Eski Durum: {status_labels.get(old_status, old_status)}
Yeni Durum: {new_status_label}
{f"Dövme Stili: {self.style.name}" if self.style else ""}
Açıklama: {self.description}
        """
        
        try:
            send_mail(
                admin_subject,
                admin_message.strip(),
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Admin email error: {e}")

    def save(self, *args, **kwargs):
        # Check if this is an update (not a new instance)
        if self.pk:
            try:
                old_instance = Appointment.objects.get(pk=self.pk)
                old_status = old_instance.status
                if old_status != self.status:
                    super().save(*args, **kwargs)
                    self.send_status_email(old_status)
                    return
            except Appointment.DoesNotExist:
                pass
        
        # For new appointments
        super().save(*args, **kwargs)
        
        # Send initial email for new appointments
        if self.status == 'pending':
            customer_subject = "Randevu Talebiniz Alındı - MikomTattoo"
            customer_message = f"""
Merhaba {self.name},

Randevu talebiniz aldık. En kısa sürede size dönüş yapacağız.

Randevu Detayları:
- Tarih: {self.date}
- Saat: {self.time}
{f"- Dövme Stili: {self.style.name}" if self.style else ""}
- Açıklama: {self.description}

İletişim Bilgileri:
Telefon: +90 555 XXX XX XX
E-posta: info@mikomtattoo.com

İyi günler dileriz,
MikomTattoo
            """
            
            try:
                send_mail(
                    customer_subject,
                    customer_message.strip(),
                    settings.DEFAULT_FROM_EMAIL,
                    [self.email],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Initial email error: {e}")
            
            # Notify admin about new appointment
            admin_subject = f"Yeni Randevu Talebi - {self.name}"
            admin_message = f"""
Yeni randevu talebi:

Müşteri: {self.name}
Telefon: {self.phone}
E-posta: {self.email}
Tarih: {self.date}
Saat: {self.time}
{f"Dövme Stili: {self.style.name}" if self.style else ""}
Açıklama: {self.description}
            """
            
            try:
                send_mail(
                    admin_subject,
                    admin_message.strip(),
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.ADMIN_EMAIL],
                    fail_silently=True,
                )
            except Exception as e:
                print(f"Admin notification error: {e}")
