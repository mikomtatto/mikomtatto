from rest_framework import viewsets
from .models import TattooStyle
from .serializers import TattooStyleSerializer

class TattooStyleViewSet(viewsets.ModelViewSet):
    queryset = TattooStyle.objects.all()
    serializer_class = TattooStyleSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options']
    
    def get_queryset(self):
        queryset = TattooStyle.objects.all()
        active = self.request.query_params.get('active')
        
        if active == 'true':
            queryset = queryset.filter(is_active=True)
            
        return queryset
