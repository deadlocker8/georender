FROM node:25-alpine

RUN apk update && apk upgrade --no-cache
RUN apk add --no-cache \
    bash \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev

RUN mkdir -p /opt/georender
WORKDIR /opt/georender
COPY package.json /opt/georender/
COPY package-lock.json /opt/georender/
RUN npm install
COPY . /opt/georender/

EXPOSE 3000

ENTRYPOINT [ "/opt/georender/georender" ]
