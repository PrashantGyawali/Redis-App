FROM node:20-alpine as build

WORKDIR /app
COPY package*.json ./
RUN ["npm", "install"]
COPY . .
RUN ["npm", "run", "build"]


FROM node:20-alpine 

WORKDIR /app

COPY package*.json ./
RUN ["npm", "install", "--only=production"]
COPY --from=build /app/dist/ ./
COPY /src/views ./src/views
COPY /public ./public

EXPOSE 3000

CMD ["node","./src/index.js"]

