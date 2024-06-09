FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libicu-dev \
    libonig-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install intl mbstring pdo_mysql zip mysqli

RUN useradd --shell /bin/bash -u 1000 -o -c "" -m runuser
RUN mkdir -p /shared/tmp && chown runuser. /shared/ -R
RUN chown runuser:runuser /var/www/html

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

USER runuser
COPY ./php/composer*.json ./
RUN composer install

COPY ./php /var/www/html

CMD ["php", "spark", "serve", "--host", "0.0.0.0"]
