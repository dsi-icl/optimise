FROM php:5.6-apache@sha256:d7cb4309ec08f4e675383ca0ef8e31aad4db7826dd5b0cc0a3e07e6ecc4f07ff

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
