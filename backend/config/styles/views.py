from rest_framework import viewsets
from .models import TattooStyle
from .serializers import TattooStyleSerializer

class TattooStyleViewSet(viewsets.ModelViewSet):
    queryset = TattooStyle.objects.all()
    serializer_class = TattooStyleSerializer
    
    def get_queryset(self):
        queryset = TattooStyle.objects.all()
        active = self.request.query_params.get('active')
        
        if active == 'true':
            queryset = queryset.filter(is_active=True)
            
        return queryset
