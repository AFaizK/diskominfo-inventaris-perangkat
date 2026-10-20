FROM php:8.4-fpm

# Install dependensi sistem & ekstensi PHP
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    && docker-php-ext-install pdo_mysql mbstring exif bcmath gd

# Copy Composer dari image resmi
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Set memory limit composer & hapus --optimize-autoloader
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-interaction --prefer-dist

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000