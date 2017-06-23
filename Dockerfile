FROM node:alpine
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./src /app/src
RUN npm install
EXPOSE 80
CMD ["npm", "start"]
