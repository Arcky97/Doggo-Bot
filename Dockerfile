FROM node:24-alpine

# Install dependencies for canvas build
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    python3 \
    make \
    g++

WORKDIR /usr/app
COPY ./ /usr/app
RUN npm install

EXPOSE 3011

CMD ["npm", "start"]