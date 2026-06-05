from django.contrib import admin
from .models import GalleryImage, Comment

@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'style', 'is_featured', 'created_at']
    list_filter = ['is_featured', 'style', 'created_at']
    search_fields = ['title', 'description']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Fotoğraf Bilgileri', {
            'fields': ('title', 'image', 'style')
        }),
        ('Detaylar', {
            'fields': ('description', 'is_featured')
        }),
    )
    
    readonly_fields = ['created_at']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['__str__', 'content_type', 'object_id', 'created_at']
    list_filter = ['created_at', 'is_anonymous']
    search_fields = ['name', 'text']
    ordering = ['-created_at']
    
    readonly_fields = ['created_at']
