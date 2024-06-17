# Użyj oficjalnego obrazu Node.js jako bazowego
FROM node:16

# Ustaw katalog roboczy w kontenerze
WORKDIR /app

# Skopiuj pliki package.json i package-lock.json do katalogu roboczego
COPY package*.json ./

# Zainstaluj zależności
RUN npm install

# Odbuduj bcrypt
RUN npm rebuild bcrypt --build-from-source

# Skopiuj resztę plików aplikacji
COPY . .

# Zbuduj aplikację NestJS
RUN npm run build

# Eksponuj port, na którym aplikacja będzie działać
EXPOSE 3000

# Uruchom aplikację
CMD ["npm", "run", "start:prod"]
