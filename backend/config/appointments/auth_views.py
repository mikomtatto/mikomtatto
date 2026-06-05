from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user is not None and user.is_superuser:
        return Response({
            'success': True,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'message': 'Invalid credentials or not a superuser'
        }, status=status.HTTP_401_UNAUTHORIZED)
