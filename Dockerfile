FROM node
WORKDIR /app
COPY ./package.json /app/package.json
COPY ./src /app/src
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
