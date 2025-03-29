FROM php:8.2-fpm

# Install dependencies for Composer
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev zip git && \
    docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install gd

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set environment for development
ENV NODE_ENV=development

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY ["composer.json", "composer-lock.json*", "./"]

# Install PHP dependencies
RUN composer install

# Copy the entire project
COPY . .

EXPOSE 8000

# Run Laravel development server
CMD ["php", "artisan", "serve"]
