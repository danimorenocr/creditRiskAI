const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todas las asignaciones usuario-cluster
const getAllUserClusters = async (req, res) => {
  try {
    const userClusters = await prisma.userCluster.findMany({
      orderBy: {
        assignedAt: 'desc'
      }
    });
    res.status(200).json({
      success: true,
      data: userClusters,
      count: userClusters.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las asignaciones',
      error: error.message
    });
  }
};

// Obtener una asignación por ID
const getUserClusterById = async (req, res) => {
  try {
    const { id } = req.params;
    const userCluster = await prisma.userCluster.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!userCluster) {
      return res.status(404).json({
        success: false,
        message: 'Asignación no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: userCluster
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la asignación',
      error: error.message
    });
  }
};

// Obtener todos los clusters asignados a un usuario
const getClustersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userClusters = await prisma.userCluster.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        assignedAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: userClusters,
      count: userClusters.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los clusters del usuario',
      error: error.message
    });
  }
};

// Obtener todos los usuarios asignados a un cluster
const getUsersByClusterId = async (req, res) => {
  try {
    const { clusterId } = req.params;
    const userClusters = await prisma.userCluster.findMany({
      where: {
        clusterId: parseInt(clusterId)
      },
      orderBy: {
        assignedAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: userClusters,
      count: userClusters.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los usuarios del cluster',
      error: error.message
    });
  }
};

// Asignar un usuario a un cluster
const assignUserToCluster = async (req, res) => {
  try {
    const { userId, clusterId } = req.body;

    // Validar campos requeridos
    if (!userId || !clusterId) {
      return res.status(400).json({
        success: false,
        message: 'userId y clusterId son requeridos'
      });
    }

    // Verificar si la asignación ya existe
    const existingAssignment = await prisma.userCluster.findFirst({
      where: {
        userId: parseInt(userId),
        clusterId: parseInt(clusterId)
      }
    });

    if (existingAssignment) {
      return res.status(409).json({
        success: false,
        message: 'El usuario ya está asignado a este cluster',
        data: existingAssignment
      });
    }

    // Crear la nueva asignación
    const newAssignment = await prisma.userCluster.create({
      data: {
        userId: parseInt(userId),
        clusterId: parseInt(clusterId)
      }
    });

    res.status(201).json({
      success: true,
      message: 'Usuario asignado al cluster exitosamente',
      data: newAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al asignar usuario al cluster',
      error: error.message
    });
  }
};

// Asignar múltiples usuarios a un cluster
const assignMultipleUsersToCluster = async (req, res) => {
  try {
    const { userIds, clusterId } = req.body;

    // Validar campos requeridos
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !clusterId) {
      return res.status(400).json({
        success: false,
        message: 'userIds (array) y clusterId son requeridos'
      });
    }

    // Crear múltiples asignaciones
    const assignments = await Promise.all(
      userIds.map(userId => 
        prisma.userCluster.create({
          data: {
            userId: parseInt(userId),
            clusterId: parseInt(clusterId)
          }
        }).catch(error => ({
          error: true,
          userId,
          message: error.message
        }))
      )
    );

    const successful = assignments.filter(a => !a.error);
    const failed = assignments.filter(a => a.error);

    res.status(201).json({
      success: true,
      message: `${successful.length} usuario(s) asignado(s) exitosamente`,
      data: {
        successful,
        failed,
        totalProcessed: assignments.length,
        successCount: successful.length,
        failCount: failed.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al asignar usuarios al cluster',
      error: error.message
    });
  }
};

// Actualizar una asignación (cambiar cluster de un usuario)
const updateUserCluster = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, clusterId } = req.body;

    // Verificar si la asignación existe
    const existingAssignment = await prisma.userCluster.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        message: 'Asignación no encontrada'
      });
    }

    // Actualizar la asignación
    const updatedAssignment = await prisma.userCluster.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...(userId && { userId: parseInt(userId) }),
        ...(clusterId && { clusterId: parseInt(clusterId) })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Asignación actualizada exitosamente',
      data: updatedAssignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la asignación',
      error: error.message
    });
  }
};

// Eliminar una asignación específica
const deleteUserCluster = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si la asignación existe
    const existingAssignment = await prisma.userCluster.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingAssignment) {
      return res.status(404).json({
        success: false,
        message: 'Asignación no encontrada'
      });
    }

    await prisma.userCluster.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Asignación eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la asignación',
      error: error.message
    });
  }
};

// Eliminar un usuario de un cluster específico
const removeUserFromCluster = async (req, res) => {
  try {
    const { userId, clusterId } = req.params;

    // Buscar la asignación
    const assignment = await prisma.userCluster.findFirst({
      where: {
        userId: parseInt(userId),
        clusterId: parseInt(clusterId)
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró la asignación del usuario al cluster'
      });
    }

    await prisma.userCluster.delete({
      where: {
        id: assignment.id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Usuario removido del cluster exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al remover usuario del cluster',
      error: error.message
    });
  }
};

// Eliminar todas las asignaciones de un usuario
const deleteAllUserAssignments = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await prisma.userCluster.deleteMany({
      where: {
        userId: parseInt(userId)
      }
    });

    res.status(200).json({
      success: true,
      message: `${result.count} asignación(es) eliminada(s) exitosamente`,
      count: result.count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar las asignaciones del usuario',
      error: error.message
    });
  }
};

// Obtener estadísticas de asignaciones
const getUserClusterStats = async (req, res) => {
  try {
    const totalAssignments = await prisma.userCluster.count();
    
    const uniqueUsers = await prisma.userCluster.findMany({
      distinct: ['userId'],
      select: { userId: true }
    });

    const uniqueClusters = await prisma.userCluster.findMany({
      distinct: ['clusterId'],
      select: { clusterId: true }
    });

    // Usuarios por cluster
    const usersByCluster = await prisma.userCluster.groupBy({
      by: ['clusterId'],
      _count: {
        userId: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalAssignments,
        uniqueUsers: uniqueUsers.length,
        uniqueClusters: uniqueClusters.length,
        usersByCluster
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

module.exports = {
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
};
