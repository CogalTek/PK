FROM node:20-alpine

# Installer Docker CLI pour communiquer avec le socket Docker
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Générer Prisma Client
RUN npx prisma generate

# Build Nuxt
RUN npm run build

# Nitro server écoute sur 3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

