FROM node:alpine
WORKDIR /app
COPY package.json package.json
COPY src src
RUN npm install
EXPOSE 80
CMD ["npm", "start"]
