from rest_framework import serializers
from .models import TattooStyle

class TattooStyleSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TattooStyle
        fields = ['id', 'name', 'slug', 'description', 'image', 'image_url', 
                  'price_range', 'is_active', 'created_at']
        read_only_fields = ['created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
