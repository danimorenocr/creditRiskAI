const express = require('express');
const router = express.Router();
const {
  getAllUserClusters,
  getUserClusterById,
  getClustersByUserId,
  getUsersByClusterId,
  assignUserToCluster,
  assignMultipleUsersToCluster,
  updateUserCluster,
  deleteUserCluster,
  removeUserFromCluster,
  deleteAllUserAssignments,
  getUserClusterStats
} = require('../controllers/userClusterController');

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCluster:
 *       type: object
 *       required:
 *         - userId
 *         - clusterId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la asignación
 *           example: 1
 *         userId:
 *           type: integer
 *           description: ID del usuario
 *           example: 123
 *         clusterId:
 *           type: integer
 *           description: ID del cluster
 *           example: 5
 *         assignedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de asignación
 *           example: "2025-11-06T10:30:00.000Z"
 *     UserClusterInput:
 *       type: object
 *       required:
 *         - userId
 *         - clusterId
 *       properties:
 *         userId:
 *           type: integer
 *           description: ID del usuario a asignar
 *           example: 123
 *         clusterId:
 *           type: integer
 *           description: ID del cluster al que asignar
 *           example: 5
 *     MultipleUsersInput:
 *       type: object
 *       required:
 *         - userIds
 *         - clusterId
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: Array de IDs de usuarios a asignar
 *           example: [123, 124, 125]
 *         clusterId:
 *           type: integer
 *           description: ID del cluster al que asignar
 *           example: 5
 */

/**
 * @swagger
 * tags:
 *   name: UserClusters
 *   description: API para gestión de asignaciones usuario-cluster
 */

/**
 * @swagger
 * /api/user-clusters:
 *   get:
 *     summary: Obtener todas las asignaciones usuario-cluster
 *     tags: [UserClusters]
 *     description: Retorna una lista de todas las asignaciones entre usuarios y clusters
 *     responses:
 *       200:
 *         description: Lista de asignaciones obtenida exitosamente
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
 *                     $ref: '#/components/schemas/UserCluster'
 *                 count:
 *                   type: integer
 *                   example: 25
 *       500:
 *         description: Error del servidor
 */
router.get('/', getAllUserClusters);

/**
 * @swagger
 * /api/user-clusters/stats:
 *   get:
 *     summary: Obtener estadísticas de asignaciones
 *     tags: [UserClusters]
 *     description: Retorna estadísticas generales de asignaciones usuario-cluster
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
 *                     totalAssignments:
 *                       type: integer
 *                       example: 150
 *                     uniqueUsers:
 *                       type: integer
 *                       example: 75
 *                     uniqueClusters:
 *                       type: integer
 *                       example: 10
 *                     usersByCluster:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Error del servidor
 */
router.get('/stats', getUserClusterStats);

/**
 * @swagger
 * /api/user-clusters/user/{userId}:
 *   get:
 *     summary: Obtener todos los clusters de un usuario
 *     tags: [UserClusters]
 *     description: Retorna todos los clusters a los que está asignado un usuario específico
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 123
 *     responses:
 *       200:
 *         description: Clusters del usuario obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/UserCluster'
 *                 count:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Error del servidor
 */
router.get('/user/:userId', getClustersByUserId);

/**
 * @swagger
 * /api/user-clusters/cluster/{clusterId}:
 *   get:
 *     summary: Obtener todos los usuarios de un cluster
 *     tags: [UserClusters]
 *     description: Retorna todos los usuarios asignados a un cluster específico
 *     parameters:
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cluster
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuarios del cluster obtenidos exitosamente
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
 *                     $ref: '#/components/schemas/UserCluster'
 *                 count:
 *                   type: integer
 *                   example: 15
 *       500:
 *         description: Error del servidor
 */
router.get('/cluster/:clusterId', getUsersByClusterId);

/**
 * @swagger
 * /api/user-clusters/{id}:
 *   get:
 *     summary: Obtener una asignación por ID
 *     tags: [UserClusters]
 *     description: Retorna los detalles de una asignación específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación
 *         example: 1
 *     responses:
 *       200:
 *         description: Asignación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserCluster'
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getUserClusterById);

/**
 * @swagger
 * /api/user-clusters:
 *   post:
 *     summary: Asignar un usuario a un cluster
 *     tags: [UserClusters]
 *     description: Crea una nueva asignación entre un usuario y un cluster
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserClusterInput'
 *           example:
 *             userId: 123
 *             clusterId: 5
 *     responses:
 *       201:
 *         description: Usuario asignado al cluster exitosamente
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
 *                   example: "Usuario asignado al cluster exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/UserCluster'
 *       400:
 *         description: Datos inválidos o campos requeridos faltantes
 *       409:
 *         description: El usuario ya está asignado a este cluster
 *       500:
 *         description: Error del servidor
 */
router.post('/', assignUserToCluster);

/**
 * @swagger
 * /api/user-clusters/assign-multiple:
 *   post:
 *     summary: Asignar múltiples usuarios a un cluster
 *     tags: [UserClusters]
 *     description: Asigna varios usuarios a un cluster en una sola operación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MultipleUsersInput'
 *           example:
 *             userIds: [123, 124, 125, 126]
 *             clusterId: 5
 *     responses:
 *       201:
 *         description: Usuarios asignados exitosamente
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
 *                   example: "4 usuario(s) asignado(s) exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/UserCluster'
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 *                     totalProcessed:
 *                       type: integer
 *                       example: 4
 *                     successCount:
 *                       type: integer
 *                       example: 4
 *                     failCount:
 *                       type: integer
 *                       example: 0
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/assign-multiple', assignMultipleUsersToCluster);

/**
 * @swagger
 * /api/user-clusters/{id}:
 *   put:
 *     summary: Actualizar una asignación
 *     tags: [UserClusters]
 *     description: Actualiza el userId o clusterId de una asignación existente
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 124
 *               clusterId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       200:
 *         description: Asignación actualizada exitosamente
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
 *                   example: "Asignación actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/UserCluster'
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', updateUserCluster);

/**
 * @swagger
 * /api/user-clusters/{id}:
 *   delete:
 *     summary: Eliminar una asignación por ID
 *     tags: [UserClusters]
 *     description: Elimina una asignación específica de la base de datos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Asignación eliminada exitosamente
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
 *                   example: "Asignación eliminada exitosamente"
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteUserCluster);

/**
 * @swagger
 * /api/user-clusters/remove/{userId}/{clusterId}:
 *   delete:
 *     summary: Remover un usuario de un cluster específico
 *     tags: [UserClusters]
 *     description: Elimina la asignación entre un usuario y un cluster específico
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 123
 *       - in: path
 *         name: clusterId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cluster
 *         example: 5
 *     responses:
 *       200:
 *         description: Usuario removido del cluster exitosamente
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
 *                   example: "Usuario removido del cluster exitosamente"
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/remove/:userId/:clusterId', removeUserFromCluster);

/**
 * @swagger
 * /api/user-clusters/user/{userId}/all:
 *   delete:
 *     summary: Eliminar todas las asignaciones de un usuario
 *     tags: [UserClusters]
 *     description: Elimina todas las asignaciones de clusters de un usuario específico
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *         example: 123
 *     responses:
 *       200:
 *         description: Asignaciones eliminadas exitosamente
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
 *                   example: "3 asignación(es) eliminada(s) exitosamente"
 *                 count:
 *                   type: integer
 *                   example: 3
 *       500:
 *         description: Error del servidor
 */
router.delete('/user/:userId/all', deleteAllUserAssignments);

module.exports = router;
