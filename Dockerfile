# Gunakan image Node.js sebagai base image
FROM node:latest

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke dalam direktori kerja
COPY package*.json ./
COPY .env ./

# Install dependensi
RUN npm install

# Salin seluruh konten proyek ke dalam direktori kerja
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 8080
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["node", "index.js"]
