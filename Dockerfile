FROM php:5.6-apache@sha256:26e8b730fd04ce87474afa8e0c0cb185b21d1e39733e9b80b75856e24380738c

LABEL author="Florian Guitton" email="f.guitton@imperial.ac.uk" version="0.3.4"

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
