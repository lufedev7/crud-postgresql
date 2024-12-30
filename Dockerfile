# Usar una imagen base de Node.js
FROM node:22.11.0-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto que usa la app
EXPOSE 3003

# Comando para ejecutar la app
CMD ["node", "dist/main.js"]
