from django.contrib import admin
from .models import TattooStyle

@admin.register(TattooStyle)
class TattooStyleAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'price_range', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['name']
    
    fieldsets = (
        ('Stil Bilgileri', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Görsel ve Fiyat', {
            'fields': ('image', 'price_range')
        }),
        ('Durum', {
            'fields': ('is_active',)
        }),
    )
    
    readonly_fields = ['created_at']
