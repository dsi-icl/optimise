FROM php:5.6-apache@sha256:43bdb409e1820309abb57f851875a78f8b79cf586d28deac7f5d54d3cfd25f97

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
