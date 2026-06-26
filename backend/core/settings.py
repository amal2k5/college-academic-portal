"""
Django settings for core project.
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = 'django-insecure-*yk1b_t$sy93me6mh$16yspu9l6b!9_!d(ts!+1&tuskw3_g(q'

DEBUG = True

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]


# APPLICATIONS

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third Party Apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',

    # Local Apps
    'accounts',
    'colleges',
    'departments',
    'students',
    'college_requests'
]


# MIDDLEWARE

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


ROOT_URLCONF = 'core.urls'


# TEMPLATES

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


WSGI_APPLICATION = 'core.wsgi.application'


# DATABASE

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "college_portal",
        "USER": "postgres",
        "PASSWORD": "postgres123",
        "HOST": "localhost",
        "PORT": "5432",
    }
}

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587

EMAIL_USE_TLS = True

EMAIL_HOST_USER = "dominicproject96@gmail.com"
EMAIL_HOST_PASSWORD = "qnet dqxr akus exjw"

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# PASSWORD VALIDATION

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# INTERNATIONALIZATION

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# STATIC FILES

STATIC_URL = 'static/'


# CUSTOM USER MODEL

AUTH_USER_MODEL = "accounts.User"


# CUSTOM AUTH BACKEND

AUTHENTICATION_BACKENDS = [
    "accounts.backends.EmailBackend",
]


# DRF

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
}


# CORS

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]


CORS_ALLOW_CREDENTIALS = True

# DEFAULT PRIMARY KEY

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

from datetime import timedelta

from datetime import timedelta

SIMPLE_JWT = {
    # ── Lifetimes ────────────────────────────────────────────────────────────
    "ACCESS_TOKEN_LIFETIME":  timedelta(minutes=15),  # was 1hr — too long for access token
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),

    # ── These two are what you're missing ────────────────────────────────────
    "ROTATE_REFRESH_TOKENS":   True,   # every refresh call issues a NEW refresh token
    "BLACKLIST_AFTER_ROTATION": True,  # old refresh token is immediately invalidated

    # ── Recommended hardening ────────────────────────────────────────────────
    "UPDATE_LAST_LOGIN": True,         # updates User.last_login on each token refresh

    # ── Leave these as defaults unless you changed them ───────────────────────
    "ALGORITHM": "HS256",
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
}

# Optional for development only
CORS_ALLOW_CREDENTIALS = True


# DEFAULT PRIMARY KEY

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
