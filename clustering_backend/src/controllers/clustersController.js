const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los clusters
const getAllClusters = async (req, res) => {
  try {
    const clusters = await prisma.cluster.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json({
      success: true,
      data: clusters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los clusters',
      error: error.message
    });
  }
};

// Obtener un cluster por ID
const getClusterById = async (req, res) => {
  try {
    const { id } = req.params;
    const cluster = await prisma.cluster.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!cluster) {
      return res.status(404).json({
        success: false,
        message: 'Cluster no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: cluster
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el cluster',
      error: error.message
    });
  }
};

// Crear un nuevo cluster
const createCluster = async (req, res) => {
  try {
    const { perfilPromedio, riesgo, estrategiaMkt } = req.body;

    // Validar campos requeridos
    if (!perfilPromedio || !riesgo || !estrategiaMkt) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: perfilPromedio, riesgo, estrategiaMkt'
      });
    }

    const newCluster = await prisma.cluster.create({
      data: {
        perfilPromedio,
        riesgo,
        estrategiaMkt
      }
    });

    res.status(201).json({
      success: true,
      message: 'Cluster creado exitosamente',
      data: newCluster
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el cluster',
      error: error.message
    });
  }
};

// Actualizar un cluster
const updateCluster = async (req, res) => {
  try {
    const { id } = req.params;
    const { perfilPromedio, riesgo, estrategiaMkt } = req.body;

    // Verificar si el cluster existe
    const existingCluster = await prisma.cluster.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingCluster) {
      return res.status(404).json({
        success: false,
        message: 'Cluster no encontrado'
      });
    }

    // Actualizar solo los campos proporcionados
    const updatedCluster = await prisma.cluster.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...(perfilPromedio && { perfilPromedio }),
        ...(riesgo && { riesgo }),
        ...(estrategiaMkt && { estrategiaMkt })
      }
    });

    res.status(200).json({
      success: true,
      message: 'Cluster actualizado exitosamente',
      data: updatedCluster
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el cluster',
      error: error.message
    });
  }
};

// Eliminar un cluster
const deleteCluster = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el cluster existe
    const existingCluster = await prisma.cluster.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingCluster) {
      return res.status(404).json({
        success: false,
        message: 'Cluster no encontrado'
      });
    }

    await prisma.cluster.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Cluster eliminado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el cluster',
      error: error.message
    });
  }
};

// Obtener clusters por nivel de riesgo
const getClustersByRiesgo = async (req, res) => {
  try {
    const { riesgo } = req.params;
    const clusters = await prisma.cluster.findMany({
      where: {
        riesgo: riesgo
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json({
      success: true,
      data: clusters,
      count: clusters.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener clusters por riesgo',
      error: error.message
    });
  }
};

// Obtener estadísticas de clusters
const getClusterStats = async (req, res) => {
  try {
    const totalClusters = await prisma.cluster.count();
    
    const clustersByRiesgo = await prisma.cluster.groupBy({
      by: ['riesgo'],
      _count: {
        riesgo: true
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalClusters,
        byRiesgo: clustersByRiesgo
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
  getAllClusters,
  getClusterById,
  createCluster,
  updateCluster,
  deleteCluster,
  getClustersByRiesgo,
  getClusterStats
};
