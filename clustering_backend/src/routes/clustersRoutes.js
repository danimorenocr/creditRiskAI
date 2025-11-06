const express = require('express');
const router = express.Router();
const {
  getAllClusters,
  getClusterById,
  createCluster,
  updateCluster,
  deleteCluster,
  getClustersByRiesgo,
  getClusterStats
} = require('../controllers/clustersController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Cluster:
 *       type: object
 *       required:
 *         - perfilPromedio
 *         - riesgo
 *         - estrategiaMkt
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del cluster (auto-generado)
 *           example: 1
 *         perfilPromedio:
 *           type: string
 *           description: Descripción del perfil promedio del cluster
 *           example: "Cliente con ingreso medio-alto, historial crediticio estable"
 *         riesgo:
 *           type: string
 *           description: Nivel de riesgo del cluster
 *           enum: [bajo, medio, alto]
 *           example: "bajo"
 *         estrategiaMkt:
 *           type: string
 *           description: Estrategia de marketing recomendada para este cluster
 *           example: "Ofrecer productos premium con tasas preferenciales"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización
 *     ClusterInput:
 *       type: object
 *       required:
 *         - perfilPromedio
 *         - riesgo
 *         - estrategiaMkt
 *       properties:
 *         perfilPromedio:
 *           type: string
 *           description: Descripción del perfil promedio del cluster
 *           example: "Cliente con ingreso medio-alto, historial crediticio estable"
 *         riesgo:
 *           type: string
 *           description: Nivel de riesgo del cluster
 *           enum: [bajo, medio, alto]
 *           example: "bajo"
 *         estrategiaMkt:
 *           type: string
 *           description: Estrategia de marketing recomendada
 *           example: "Ofrecer productos premium con tasas preferenciales"
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Clusters
 *   description: API para gestión de clusters de análisis HDBSCAN
 */

/**
 * @swagger
 * /api/clusters:
 *   get:
 *     summary: Obtener todos los clusters
 *     tags: [Clusters]
 *     description: Retorna una lista de todos los clusters ordenados por fecha de creación (más recientes primero)
 *     responses:
 *       200:
 *         description: Lista de clusters obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cluster'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', getAllClusters);

/**
 * @swagger
 * /api/clusters/stats:
 *   get:
 *     summary: Obtener estadísticas de clusters
 *     tags: [Clusters]
 *     description: Retorna estadísticas generales incluyendo total de clusters y distribución por nivel de riesgo
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     byRiesgo:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           riesgo:
 *                             type: string
 *                             example: "bajo"
 *                           _count:
 *                             type: object
 *                             properties:
 *                               riesgo:
 *                                 type: integer
 *                                 example: 5
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', getClusterStats);

/**
 * @swagger
 * /api/clusters/riesgo/{riesgo}:
 *   get:
 *     summary: Obtener clusters por nivel de riesgo
 *     tags: [Clusters]
 *     description: Filtra y retorna clusters según el nivel de riesgo especificado
 *     parameters:
 *       - in: path
 *         name: riesgo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [bajo, medio, alto]
 *         description: Nivel de riesgo a filtrar
 *         example: bajo
 *     responses:
 *       200:
 *         description: Clusters filtrados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Cluster'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/riesgo/:riesgo', getClustersByRiesgo);

/**
 * @swagger
 * /api/clusters/{id}:
 *   get:
 *     summary: Obtener un cluster por ID
 *     tags: [Clusters]
 *     description: Retorna los detalles de un cluster específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cluster
 *         example: 1
 *     responses:
 *       200:
 *         description: Cluster encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cluster'
 *       404:
 *         description: Cluster no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getClusterById);

/**
 * @swagger
 * /api/clusters:
 *   post:
 *     summary: Crear un nuevo cluster
 *     tags: [Clusters]
 *     description: Crea un nuevo cluster con la información proporcionada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClusterInput'
 *           example:
 *             perfilPromedio: "Cliente con ingreso medio-alto, historial crediticio estable"
 *             riesgo: "bajo"
 *             estrategiaMkt: "Ofrecer productos premium con tasas preferenciales"
 *     responses:
 *       201:
 *         description: Cluster creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cluster creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Cluster'
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', createCluster);

/**
 * @swagger
 * /api/clusters/{id}:
 *   put:
 *     summary: Actualizar un cluster
 *     tags: [Clusters]
 *     description: Actualiza parcial o totalmente la información de un cluster existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cluster a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               perfilPromedio:
 *                 type: string
 *                 example: "Cliente con ingreso alto y excelente historial"
 *               riesgo:
 *                 type: string
 *                 enum: [bajo, medio, alto]
 *                 example: "bajo"
 *               estrategiaMkt:
 *                 type: string
 *                 example: "Campaña de fidelización con beneficios exclusivos"
 *     responses:
 *       200:
 *         description: Cluster actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cluster actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Cluster'
 *       404:
 *         description: Cluster no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', updateCluster);

/**
 * @swagger
 * /api/clusters/{id}:
 *   delete:
 *     summary: Eliminar un cluster
 *     tags: [Clusters]
 *     description: Elimina permanentemente un cluster de la base de datos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cluster a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Cluster eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cluster eliminado exitosamente"
 *       404:
 *         description: Cluster no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', deleteCluster);

module.exports = router;
