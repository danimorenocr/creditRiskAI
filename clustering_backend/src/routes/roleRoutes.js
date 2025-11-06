const express = require('express');
const router = express.Router();
const {
  getAllRoles,
  getRoleById,
  getRoleByName,
  createRole,
  createMultipleRoles,
  updateRole,
  deleteRole,
  searchRoles
} = require('../controllers/roleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del rol (auto-generado)
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del rol
 *           example: "Administrador"
 *     RoleInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del rol
 *           example: "Administrador"
 *     MultipleRolesInput:
 *       type: object
 *       required:
 *         - roles
 *       properties:
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de nombres de roles a crear
 *           example: ["Administrador", "Usuario", "Supervisor"]
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API para gestión de roles de usuario
 */

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     description: Retorna una lista de todos los roles del sistema
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
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
 *                     $ref: '#/components/schemas/Role'
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Error del servidor
 */
router.get('/', getAllRoles);

/**
 * @swagger
 * /api/roles/search:
 *   get:
 *     summary: Buscar roles por texto
 *     tags: [Roles]
 *     description: Busca roles que contengan el texto especificado en su nombre
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto a buscar en los nombres de roles
 *         example: "admin"
 *     responses:
 *       200:
 *         description: Búsqueda realizada exitosamente
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
 *                     $ref: '#/components/schemas/Role'
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 query:
 *                   type: string
 *                   example: "admin"
 *       400:
 *         description: Parámetro de búsqueda faltante
 *       500:
 *         description: Error del servidor
 */
router.get('/search', searchRoles);

/**
 * @swagger
 * /api/roles/name/{name}:
 *   get:
 *     summary: Obtener un rol por nombre
 *     tags: [Roles]
 *     description: Busca y retorna un rol específico por su nombre (case-insensitive)
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del rol a buscar
 *         example: "Administrador"
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/name/:name', getRoleByName);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     description: Retorna los detalles de un rol específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *         example: 1
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', getRoleById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     description: Crea un nuevo rol en el sistema (verifica duplicados)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *           example:
 *             name: "Administrador"
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
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
 *                   example: "Rol creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Nombre del rol no proporcionado o inválido
 *       409:
 *         description: Ya existe un rol con ese nombre
 *       500:
 *         description: Error del servidor
 */
router.post('/', createRole);

/**
 * @swagger
 * /api/roles/create-multiple:
 *   post:
 *     summary: Crear múltiples roles
 *     tags: [Roles]
 *     description: Crea varios roles en una sola operación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MultipleRolesInput'
 *           example:
 *             roles: ["Administrador", "Usuario", "Supervisor", "Analista"]
 *     responses:
 *       201:
 *         description: Roles creados exitosamente
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
 *                   example: "4 rol(es) creado(s) exitosamente"
 *                 data:
 *                   type: object
 *                   properties:
 *                     successful:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Role'
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
 *         description: Array de roles no proporcionado o inválido
 *       500:
 *         description: Error del servidor
 */
router.post('/create-multiple', createMultipleRoles);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     tags: [Roles]
 *     description: Actualiza el nombre de un rol existente (verifica duplicados)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleInput'
 *           example:
 *             name: "Super Administrador"
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
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
 *                   example: "Rol actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       400:
 *         description: Nombre del rol no proporcionado o inválido
 *       404:
 *         description: Rol no encontrado
 *       409:
 *         description: Ya existe otro rol con ese nombre
 *       500:
 *         description: Error del servidor
 */
router.put('/:id', updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     description: Elimina permanentemente un rol del sistema
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
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
 *                   example: "Rol eliminado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rol no encontrado
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', deleteRole);

module.exports = router;
