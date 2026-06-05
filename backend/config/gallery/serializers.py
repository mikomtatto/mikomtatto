from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import GalleryImage, Comment

class GalleryImageSerializer(serializers.ModelSerializer):
    style_name = serializers.CharField(source='style.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = GalleryImage
        fields = ['id', 'title', 'image', 'image_url', 'style', 'style_name', 
                  'description', 'is_featured', 'created_at']
        read_only_fields = ['created_at']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'name', 'is_anonymous', 'rating', 'text', 'created_at']
        read_only_fields = ['created_at']
    
    def create(self, validated_data):
        # Get content_type and object_id from the request context
        request = self.context.get('request')
        if not request:
            raise serializers.ValidationError("Request context is required")
        
        content_type_str = request.data.get('content_type')
        object_id = request.data.get('object_id')
        
        if content_type_str and object_id:
            try:
                if content_type_str == 'galleryimage':
                    ct = ContentType.objects.get(app_label='gallery', model='galleryimage')
                elif content_type_str == 'tattoostyle':
                    ct = ContentType.objects.get(app_label='styles', model='tattoostyle')
                else:
                    ct = ContentType.objects.get(model=content_type_str)
                
                validated_data['content_type'] = ct
                validated_data['object_id'] = int(object_id)
            except (ContentType.DoesNotExist, ValueError):
                raise serializers.ValidationError("Invalid content_type or object_id")
        else:
            raise serializers.ValidationError("content_type and object_id are required")
        
        return super().create(validated_data)
