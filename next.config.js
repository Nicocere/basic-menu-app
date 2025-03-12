module.exports = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      // Mantén cualquier otro dominio que ya tengas configurado aquí
    ],
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api', // URL de la API
  },
  eslint: {
    ignoreDuringBuilds: true, // Desactiva ESLint durante el build
  },
};
