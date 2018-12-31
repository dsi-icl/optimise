FROM php:5.6-apache@sha256:33b064d6931fde23e100a6ca785f7d712eafc7db3679414b0112de17579e6595

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
