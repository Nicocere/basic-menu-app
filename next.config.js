module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'], // Reemplaza con los dominios de tus imágenes
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api', // URL de la API
  },
};