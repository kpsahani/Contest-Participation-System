FROM node:18-alpine

# Install netcat for container health checks
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

copy .env.example .env

EXPOSE 5000 5174

# Make the entrypoint script executable
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
