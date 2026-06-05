from rest_framework import serializers
from .models import About, ContactInfo, HeroBackground

class AboutSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = About
        fields = ['id', 'title', 'content', 'image', 'image_url', 'updated_at']
        read_only_fields = ['updated_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ContactInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactInfo
        fields = ['id', 'address', 'phone', 'email', 'working_hours', 
                  'facebook', 'instagram', 'twitter', 'updated_at']
        read_only_fields = ['updated_at']

class HeroBackgroundSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroBackground
        fields = ['id', 'name', 'image', 'image_url', 'is_active', 'is_preset', 'created_at']
        read_only_fields = ['created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
