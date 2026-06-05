from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from .models import GalleryImage, Comment
from .serializers import GalleryImageSerializer, CommentSerializer

class GalleryImageViewSet(viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    
    def get_queryset(self):
        queryset = GalleryImage.objects.all()
        style = self.request.query_params.get('style')
        featured = self.request.query_params.get('featured')
        
        if style:
            queryset = queryset.filter(style=style)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
            
        return queryset


@api_view(['GET', 'POST'])
def comment_list(request):
    if request.method == 'GET':
        content_type = request.query_params.get('content_type')
        object_id = request.query_params.get('object_id')
        
        queryset = Comment.objects.all()
        
        if content_type and object_id:
            try:
                if content_type == 'galleryimage':
                    ct = ContentType.objects.get(app_label='gallery', model='galleryimage')
                elif content_type == 'tattoostyle':
                    ct = ContentType.objects.get(app_label='styles', model='tattoostyle')
                else:
                    ct = ContentType.objects.get(model=content_type)
                queryset = queryset.filter(content_type=ct, object_id=object_id)
            except ContentType.DoesNotExist:
                queryset = Comment.objects.none()
                
        serializer = CommentSerializer(queryset, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = CommentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
