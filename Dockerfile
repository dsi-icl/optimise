FROM php:5.6-apache

LABEL author="Florian Guitton" email="f.guitton@imperial.ac.uk" version="0.2.0"

RUN apt-get update; \
    apt-get dist-upgrade -y; \
	apt-get install -y --no-install-recommends \
		libcurl4-openssl-dev \
		libssl-dev; \
	rm -rf /var/lib/apt/lists/*;

RUN pecl config-set php_ini /usr/local/etc/php/php.ini && \
    printf "\n" | pecl install mongo && \
    docker-php-ext-enable mongo

COPY src/ /var/www/html/
