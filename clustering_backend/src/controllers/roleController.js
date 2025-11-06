const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener todos los roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        id: 'asc'
      }
    });
    res.status(200).json({
      success: true,
      data: roles,
      count: roles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los roles',
      error: error.message
    });
  }
};

// Obtener un rol por ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el rol',
      error: error.message
    });
  }
};

// Obtener un rol por nombre
const getRoleByName = async (req, res) => {
  try {
    const { name } = req.params;
    const role = await prisma.role.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive' // Búsqueda case-insensitive
        }
      }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el rol',
      error: error.message
    });
  }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Validar campo requerido
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del rol es requerido'
      });
    }

    // Verificar si el rol ya existe
    const existingRole = await prisma.role.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un rol con ese nombre',
        data: existingRole
      });
    }

    const newRole = await prisma.role.create({
      data: {
        name: name.trim()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Rol creado exitosamente',
      data: newRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear el rol',
      error: error.message
    });
  }
};

// Crear múltiples roles
const createMultipleRoles = async (req, res) => {
  try {
    const { roles } = req.body;

    // Validar que se proporcione un array de roles
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de nombres de roles'
      });
    }

    // Crear los roles
    const createdRoles = await Promise.all(
      roles.map(name =>
        prisma.role.create({
          data: { name: name.trim() }
        }).catch(error => ({
          error: true,
          name,
          message: error.message
        }))
      )
    );

    const successful = createdRoles.filter(r => !r.error);
    const failed = createdRoles.filter(r => r.error);

    res.status(201).json({
      success: true,
      message: `${successful.length} rol(es) creado(s) exitosamente`,
      data: {
        successful,
        failed,
        totalProcessed: createdRoles.length,
        successCount: successful.length,
        failCount: failed.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear los roles',
      error: error.message
    });
  }
};

// Actualizar un rol
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Validar que se proporcione el nombre
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El nombre del rol es requerido'
      });
    }

    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar si ya existe otro rol con el mismo nombre
    const duplicateRole = await prisma.role.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: 'insensitive'
        },
        NOT: {
          id: parseInt(id)
        }
      }
    });

    if (duplicateRole) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe otro rol con ese nombre'
      });
    }

    const updatedRole = await prisma.role.update({
      where: {
        id: parseInt(id)
      },
      data: {
        name: name.trim()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: updatedRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el rol',
      error: error.message
    });
  }
};

// Eliminar un rol
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el rol existe
    const existingRole = await prisma.role.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    await prisma.role.delete({
      where: {
        id: parseInt(id)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rol eliminado exitosamente',
      data: existingRole
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el rol',
      error: error.message
    });
  }
};

// Buscar roles por texto
const searchRoles = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "query" es requerido'
      });
    }

    const roles = await prisma.role.findMany({
      where: {
        name: {
          contains: query,
          mode: 'insensitive'
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: roles,
      count: roles.length,
      query: query
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar roles',
      error: error.message
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  getRoleByName,
  createRole,
  createMultipleRoles,
  updateRole,
  deleteRole,
  searchRoles
};
