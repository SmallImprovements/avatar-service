FROM launcher.gcr.io/google/nodejs
WORKDIR /app
COPY package.json package.json
COPY src src
#Install packages as per https://github.com/Automattic/node-canvas#installation and https://github.com/Automattic/node-canvas/issues/524
RUN apt-get update -y && \
    apt-get install --no-install-recommends -y -q \ 
        libcairo2-dev \ 
        libjpeg62-turbo-dev \
        libpango1.0-dev \
        libgif-dev \
        g++ && \
    apt-get clean && \
    rm /var/lib/apt/lists/*_*

RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
