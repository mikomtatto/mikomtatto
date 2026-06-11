import os
import django
import sys

# Add the config directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'config'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

def test_email():
    """Test email sending with Brevo"""
    
    print("Email Configuration:")
    print(f"EMAIL_BACKEND: {settings.EMAIL_BACKEND}")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"DEFAULT_FROM_EMAIL: {settings.DEFAULT_FROM_EMAIL}")
    print(f"ADMIN_EMAIL: {settings.ADMIN_EMAIL}")
    print()
    
    # Test context
    context = {
        'name': 'Test User',
        'date': '2024-06-15',
        'time': '14:00',
        'style': 'Realism',
        'description': 'Test tattoo description',
        'status': 'Onaylandı',
        'status_color': '#10b981',
        'status_message': 'Randevunuz onaylandı. Görüşmek üzere!'
    }
    
    # Render HTML template
    try:
        html_content = render_to_string('appointments/email_new_appointment.html', context)
        print("✓ HTML template rendered successfully")
    except Exception as e:
        print(f"✗ HTML template rendering failed: {e}")
        return False
    
    # Test email sending
    subject = "Test Email - MikomTattoo"
    text_content = "This is a test email from MikomTattoo."
    
    try:
        msg = EmailMultiAlternatives(
            subject,
            text_content,
            settings.DEFAULT_FROM_EMAIL,
            [settings.ADMIN_EMAIL]  # Send to admin for testing
        )
        msg.attach_alternative(html_content, 'text/html')
        msg.send()
        print("✓ Email sent successfully!")
        return True
    except Exception as e:
        print(f"✗ Email sending failed: {e}")
        return False

if __name__ == '__main__':
    success = test_email()
    sys.exit(0 if success else 1)
