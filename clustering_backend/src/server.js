require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Importar rutas
const clustersRoutes = require('./routes/clustersRoutes');
const userClusterRoutes = require('./routes/userClusterRoutes');
const roleRoutes = require('./routes/roleRoutes');

// Inicializar la aplicación
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parser de JSON
app.use(express.urlencoded({ extended: true })); // Parser de URL-encoded

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Clustering - Credit Risk AI',
      version: '1.0.0',
      description: 'API para gestión de clusters de análisis HDBSCAN para Credit Risk AI',
      contact: {
        name: 'Credit Risk AI Team'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo'
      }
    ],
    tags: [
      {
        name: 'Clusters',
        description: 'Endpoints para gestión de clusters'
      },
      {
        name: 'UserClusters',
        description: 'Endpoints para gestión de asignaciones usuario-cluster'
      },
      {
        name: 'Roles',
        description: 'Endpoints para gestión de roles de usuario'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Archivos donde están las rutas documentadas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ruta para documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Clustering - Credit Risk AI',
    version: '1.0.0',
    documentation: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      clusters: `http://localhost:${PORT}/api/clusters`,
      userClusters: `http://localhost:${PORT}/api/user-clusters`,
      roles: `http://localhost:${PORT}/api/roles`,
      stats: `http://localhost:${PORT}/api/clusters/stats`,
      userClusterStats: `http://localhost:${PORT}/api/user-clusters/stats`
    }
  });
});

// Rutas de la API
app.use('/api/clusters', clustersRoutes);
app.use('/api/user-clusters', userClusterRoutes);
app.use('/api/roles', roleRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación disponible en http://localhost:${PORT}/api-docs`);
  console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  process.exit(0);
});

module.exports = app;
