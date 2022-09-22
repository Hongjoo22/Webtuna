"""
Django settings for tuntun project.

Generated by 'django-admin startproject' using Django 3.2.9.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from datetime import timedelta
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-op1f@*2c!8bjib9a776izo3chj_3nh-1v^45tmw&)n+42&-9#3'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    # 추가한 앱들
    'accounts',
    'webtoons',
    'games',

    # 추가한 라이브러리들
    'corsheaders',
    'sslserver',
    
    'rest_framework',
    'rest_framework.authtoken',
    'rest_framework_simplejwt',

    'dj_rest_auth',
    'dj_rest_auth.registration',

    'allauth',
    'allauth.account',


    'django.contrib.admin',
    'django.contrib.sites',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

SITE_ID = 1

ROOT_URLCONF = 'tuntun.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tuntun.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'tuntun',
    'USER': 'root',
    'PASSWORD': 'root',
    'HOST': 'localhost',
    'PORT': 3306,
    }
=======
=======
>>>>>>> f476a7b (fix : database 코드 수정)
        'ENGINE': 'django.db.backends.mysql',
        'OPTIONS' : {
            'read_default_file' : os.path.join(BASE_DIR, 'mysql.cnf')
        }   
<<<<<<< HEAD
=======
=======
>>>>>>> 4ad957b (fix:로그인 수정)
    'ENGINE': 'django.db.backends.mysql',
    'NAME': 'tuntun',
    'USER': 'admin',
    'PASSWORD': 'hongtun1!',
    'HOST': 'tuntun.csnx9owbfgoh.ap-northeast-2.rds.amazonaws.com',                      # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
    'PORT': '3306',   
<<<<<<< HEAD
>>>>>>> 8a5a04a (Change Question in games/models.py)
=======
>>>>>>> 4ad957b (fix:로그인 수정)
=======
>>>>>>> f476a7b (fix : database 코드 수정)
    },
>>>>>>> 0d8b258 (fix: settings.py에서 mysql.cnf 인식못하는 오류 수정 및 쓸모없는 파일 지우기)
}




# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

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


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'ko-kr'

TIME_ZONE = 'Asia/Seoul'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'accounts.Member'

REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'accounts.serializers.CustomRegisterSerializer',
}

# 방화벽 열어주기
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

<<<<<<< HEAD
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
}
=======
SITE_ID = 1
REST_USE_JWT = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None # username 필드 사용 x
ACCOUNT_EMAIL_REQUIRED = True            # email 필드 사용 o
ACCOUNT_USERNAME_REQUIRED = False        # username 필드 사용 x
ACCOUNT_AUTHENTICATION_METHOD = 'email'

ACCOUNT_EMAIL_VERIFICATION = 'none' # 회원가입 과정에서 이메일 인증 사용 X

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
<<<<<<< HEAD
>>>>>>> 4ad957b (fix:로그인 수정)
=======

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=3),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> f81c1cd (fix: 회원 로그인/로그아웃 등 수정)
=======
>>>>>>> f476a7b (fix : database 코드 수정)
=======

# SECURITY     -   http     
<<<<<<< HEAD
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = True #     SSL        SSL
SESSION_COOKIE_SECURE = True #    https  cookie
CSRF_COOKIE_SECURE = True #    https  cookie
SECURE_HSTS_INCLUDE_SUBDOMAINS = True #       https    
SECURE_HSTS_PRELOAD = True # HSTS 
SECURE_HSTS_SECONDS = 60
SECURE_CONTENT_TYPE_NOSNIFF = True
>>>>>>> cc8563b (chore: ssl 관련 settings 추가)
=======
# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
# SECURE_SSL_REDIRECT = True #     SSL        SSL
# SESSION_COOKIE_SECURE = True #    https  cookie
# CSRF_COOKIE_SECURE = True #    https  cookie
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True #       https    
# SECURE_HSTS_PRELOAD = True # HSTS 
# SECURE_HSTS_SECONDS = 60
# SECURE_CONTENT_TYPE_NOSNIFF = True
>>>>>>> 23dfc89 (chore: 잠시 주석처리)
=======

SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS' :{
        'Bearer':{
            'type':'apiKey',
            'name':'Authorization',
            'in':'header'
        }
    }
}
>>>>>>> 259428a (chore: swagger authorization 설정 추가)
