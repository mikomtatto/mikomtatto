from django.contrib import admin
from .models import About, ContactInfo

@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ['title', 'updated_at']
    fieldsets = (
        ('Hakkımızda Bilgileri', {
            'fields': ('title', 'content', 'image')
        }),
    )
    readonly_fields = ['updated_at']

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ['email', 'phone', 'updated_at']
    fieldsets = (
        ('İletişim Bilgileri', {
            'fields': ('address', 'phone', 'email', 'working_hours')
        }),
        ('Sosyal Medya', {
            'fields': ('facebook', 'instagram', 'twitter')
        }),
    )
    readonly_fields = ['updated_at']
