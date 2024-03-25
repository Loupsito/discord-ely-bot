# Utilisez l'image officielle Node.js comme image parent
FROM node:14-slim

# Définissez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez les fichiers de dépendances du projet
COPY package*.json ./

# Installez les dépendances du projet
RUN npm install

# Copiez les fichiers source du projet dans le conteneur
COPY . .

# Construisez votre application NestJS
RUN npm run build

# Exposez le port sur lequel votre application s'exécute
EXPOSE 3000

# Commande pour démarrer votre application
CMD ["node", "dist/main"]
