from django.db import models
from django.core.validators import RegexValidator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
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
        
        status_colors = {
            'pending': '#f59e0b',
            'confirmed': '#10b981',
            'completed': '#3b82f6',
            'cancelled': '#ef4444',
        }
        
        new_status_label = status_labels.get(self.status, self.status)
        status_color = status_colors.get(self.status, '#6b7280')
        
        # Email to customer
        customer_subject = f"Randevu Durum Güncellemesi - {new_status_label}"
        
        context = {
            'name': self.name,
            'date': self.date,
            'time': self.time,
            'status': new_status_label,
            'status_color': status_color,
            'style': self.style.name if self.style else None,
            'description': self.description,
            'status_message': {
                'confirmed': 'Randevunuz onaylandı. Görüşmek üzere!',
                'completed': 'Randevunuz tamamlandı. Teşekkür ederiz!',
                'cancelled': 'Randevunuz iptal edildi. Herhangi bir sorunuz varsa lütfen bizimle iletişime geçin.',
                'pending': 'Randevunuz beklemede. En kısa sürede size dönüş yapacağız.'
            }.get(self.status, 'Randevunuz beklemede.')
        }
        
        html_content = render_to_string('appointments/email_status_update.html', context)
        text_content = f"""
Merhaba {context['name']},

Randevunuzun durumu güncellendi.

Randevu Detayları:
- Tarih: {context['date']}
- Saat: {context['time']}
- Yeni Durum: {context['status']}
{f"- Dövme Stili: {context['style']}" if context['style'] else ""}
- Açıklama: {context['description']}

{context['status_message']}

İyi günler dileriz,
MikomTattoo
        """.strip()
        
        try:
            msg = EmailMultiAlternatives(
                customer_subject,
                text_content,
                settings.DEFAULT_FROM_EMAIL,
                [self.email]
            )
            msg.attach_alternative(html_content, 'text/html')
            result = msg.send()
            print(f"Customer email sent: {result}")
        except Exception as e:
            print(f"Customer email error: {str(e)}")
            import traceback
            traceback.print_exc()
        
        # Email to admin
        admin_subject = f"Randevu Durum Değişikliği - {self.name}"
        
        admin_context = {
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'date': self.date,
            'time': self.time,
            'old_status': status_labels.get(old_status, old_status),
            'new_status': new_status_label,
            'status_color': status_color,
            'style': self.style.name if self.style else None,
            'description': self.description
        }
        
        admin_html_content = render_to_string('appointments/email_admin_status_update.html', admin_context)
        admin_text_content = f"""
Randevu durumu değişti:

Müşteri: {admin_context['name']}
Telefon: {admin_context['phone']}
E-posta: {admin_context['email']}
Tarih: {admin_context['date']}
Saat: {admin_context['time']}
Eski Durum: {admin_context['old_status']}
Yeni Durum: {admin_context['new_status']}
{f"Dövme Stili: {admin_context['style']}" if admin_context['style'] else ""}
Açıklama: {admin_context['description']}
        """.strip()
        
        try:
            msg = EmailMultiAlternatives(
                admin_subject,
                admin_text_content,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL]
            )
            msg.attach_alternative(admin_html_content, 'text/html')
            result = msg.send()
            print(f"Admin email sent: {result}")
        except Exception as e:
            print(f"Admin email error: {str(e)}")
            import traceback
            traceback.print_exc()

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
            
            context = {
                'name': self.name,
                'date': self.date,
                'time': self.time,
                'style': self.style.name if self.style else None,
                'description': self.description
            }
            
            html_content = render_to_string('appointments/email_new_appointment.html', context)
            text_content = f"""
Merhaba {context['name']},

Randevu talebiniz aldık. En kısa sürede size dönüş yapacağız.

Randevu Detayları:
- Tarih: {context['date']}
- Saat: {context['time']}
{f"- Dövme Stili: {context['style']}" if context['style'] else ""}
- Açıklama: {context['description']}

İletişim Bilgileri:
E-posta: info@mikomtatto.com

İyi günler dileriz,
MikomTattoo
            """.strip()
            
            try:
                msg = EmailMultiAlternatives(
                    customer_subject,
                    text_content,
                    settings.DEFAULT_FROM_EMAIL,
                    [self.email]
                )
                msg.attach_alternative(html_content, 'text/html')
                result = msg.send()
                print(f"Initial customer email sent: {result}")
            except Exception as e:
                print(f"Initial email error: {str(e)}")
                import traceback
                traceback.print_exc()
            
            # Notify admin about new appointment
            admin_subject = f"Yeni Randevu Talebi - {self.name}"
            
            admin_context = {
                'name': self.name,
                'phone': self.phone,
                'email': self.email,
                'date': self.date,
                'time': self.time,
                'style': self.style.name if self.style else None,
                'description': self.description
            }
            
            admin_html_content = render_to_string('appointments/email_admin_new_appointment.html', admin_context)
            admin_text_content = f"""
Yeni randevu talebi:

Müşteri: {admin_context['name']}
Telefon: {admin_context['phone']}
E-posta: {admin_context['email']}
Tarih: {admin_context['date']}
Saat: {admin_context['time']}
{f"Dövme Stili: {admin_context['style']}" if admin_context['style'] else ""}
Açıklama: {admin_context['description']}
            """.strip()
            
            try:
                msg = EmailMultiAlternatives(
                    admin_subject,
                    admin_text_content,
                    settings.DEFAULT_FROM_EMAIL,
                    [settings.ADMIN_EMAIL]
                )
                msg.attach_alternative(admin_html_content, 'text/html')
                result = msg.send()
                print(f"Admin notification email sent: {result}")
            except Exception as e:
                print(f"Admin notification error: {str(e)}")
                import traceback
                traceback.print_exc()
