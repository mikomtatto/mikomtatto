#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

print(f"DEBUG: Username={username}, Email={email}, Password={'*' * len(password) if password else 'None'}")

if username and email and password:
    try:
        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            print(f"Superuser '{username}' created successfully")
        else:
            print(f"Superuser '{username}' already exists")
    except Exception as e:
        print(f"Error creating superuser: {e}")
        sys.exit(1)
else:
    print("Superuser credentials not provided in environment variables")
    print(f"Missing: {', '.join([name for name, val in [('DJANGO_SUPERUSER_USERNAME', username), ('DJANGO_SUPERUSER_EMAIL', email), ('DJANGO_SUPERUSER_PASSWORD', password)] if not val])}")
    sys.exit(1)
