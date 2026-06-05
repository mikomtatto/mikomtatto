from django.contrib import admin
from .models import Appointment

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'email', 'date', 'time', 'style', 'status', 'created_at']
    list_filter = ['status', 'date', 'style']
    search_fields = ['name', 'phone', 'email']
    date_hierarchy = 'date'
    ordering = ['-date', '-time']
    
    fieldsets = (
        ('Müşteri Bilgileri', {
            'fields': ('name', 'phone', 'email')
        }),
        ('Randevu Detayları', {
            'fields': ('date', 'time', 'style', 'description')
        }),
        ('Durum', {
            'fields': ('status',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
