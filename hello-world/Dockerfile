FROM node:8-alpine

RUN mkdir -p /app/

WORKDIR /app/

COPY package.json ./
RUN npm install --quiet --production

COPY . src/
#Run as non root user
USER 65534:65534 

ENTRYPOINT ["node", "./src/app.js"]
