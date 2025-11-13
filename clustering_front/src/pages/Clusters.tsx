import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Target, TrendingUp, BarChart3, Home, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { api, type Cluster, type UserCluster } from "@/lib/api";
import { toast } from "sonner";

const Clusters = () => {
  const navigate = useNavigate();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [userClusters, setUserClusters] = useState<UserCluster[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para el diálogo de crear/editar
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCluster, setCurrentCluster] = useState<Cluster | null>(null);
  const [formData, setFormData] = useState({
    perfilPromedio: "",
    riesgo: "medio",
    estrategiaMkt: "",
  });
  
  // Estados para el diálogo de eliminar
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clusterToDelete, setClusterToDelete] = useState<number | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clustersData, userClustersData] = await Promise.all([
        api.getClusters(),
        api.getUserClusters(),
      ]);
      setClusters(clustersData);
      setUserClusters(userClustersData);
    } catch (error) {
      toast.error("No se pudieron cargar los datos de clusters");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setCurrentCluster(null);
    setFormData({
      perfilPromedio: "",
      riesgo: "medio",
      estrategiaMkt: "",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (cluster: Cluster) => {
    setIsEditing(true);
    setCurrentCluster(cluster);
    setFormData({
      perfilPromedio: cluster.perfilPromedio,
      riesgo: cluster.riesgo,
      estrategiaMkt: cluster.estrategiaMkt,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentCluster(null);
    setFormData({
      perfilPromedio: "",
      riesgo: "medio",
      estrategiaMkt: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.perfilPromedio || !formData.riesgo || !formData.estrategiaMkt) {
      toast.error("Todos los campos son requeridos");
      return;
    }

    try {
      if (isEditing && currentCluster) {
        await api.updateCluster(currentCluster.id, formData);
        toast.success("Cluster actualizado exitosamente");
      } else {
        await api.createCluster(formData);
        toast.success("Cluster creado exitosamente");
      }
      
      handleCloseDialog();
      fetchData();
    } catch (error) {
      toast.error(isEditing ? "Error al actualizar cluster" : "Error al crear cluster");
      console.error("Error:", error);
    }
  };

  const handleOpenDeleteDialog = (clusterId: number) => {
    setClusterToDelete(clusterId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCluster = async () => {
    if (!clusterToDelete) return;

    try {
      await api.deleteCluster(clusterToDelete);
      toast.success("Cluster eliminado exitosamente");
      setIsDeleteDialogOpen(false);
      setClusterToDelete(null);
      fetchData();
    } catch (error) {
      toast.error("Error al eliminar cluster");
      console.error("Error:", error);
    }
  };

  const getTotalUsers = () => {
    return new Set(userClusters.map(uc => uc.userId)).size;
  };

  const getMostCommonCluster = () => {
    if (clusters.length === 0) return null;
    const clusterCounts = clusters.map(cluster => ({
      cluster,
      count: userClusters.filter(uc => uc.clusterId === cluster.id).length
    }));
    return clusterCounts.sort((a, b) => b.count - a.count)[0]?.cluster;
  };

  const getUserCountForCluster = (clusterId: number) => {
    return userClusters.filter(uc => uc.clusterId === clusterId).length;
  };

  const getRiskBadgeVariant = (riesgo: string) => {
    const riesgoLower = riesgo.toLowerCase();
    if (riesgoLower.includes('alto') || riesgoLower.includes('high')) return "destructive";
    if (riesgoLower.includes('medio') || riesgoLower.includes('medium')) return "default";
    return "secondary";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando datos de clusters...</p>
        </div>
      </div>
    );
  }

  const mostCommonCluster = getMostCommonCluster();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Análisis de Clusters</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => navigate('/')}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Clusters
              </CardTitle>
              <Target className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{clusters.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Usuarios Asignados
              </CardTitle>
              <Users className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{getTotalUsers()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cluster Más Común
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {mostCommonCluster ? `#${mostCommonCluster.id}` : 'N/A'}
              </div>
              {mostCommonCluster && (
                <p className="text-sm text-gray-600 mt-1">
                  {mostCommonCluster.perfilPromedio}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabla de Clusters */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Clusters Disponibles</CardTitle>
            </div>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Cluster
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Perfil Promedio</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Riesgo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Usuarios</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Estrategia Marketing</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Última Actualización</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {clusters.map((cluster) => (
                    <tr key={cluster.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{cluster.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{cluster.perfilPromedio}</td>
                      <td className="px-4 py-3">
                        <Badge variant={getRiskBadgeVariant(cluster.riesgo)}>
                          {cluster.riesgo}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {getUserCountForCluster(cluster.id)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{cluster.estrategiaMkt}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(cluster.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(cluster)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(cluster.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Asignaciones Usuario-Cluster */}
        <Card>
          <CardHeader>
            <CardTitle>Asignaciones Usuario-Cluster</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID Asignación</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">ID Cluster</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Perfil</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Riesgo</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Fecha Asignación</th>
                  </tr>
                </thead>
                <tbody>
                  {userClusters.map((uc) => {
                    const cluster = clusters.find(c => c.id === uc.clusterId);
                    return (
                      <tr key={uc.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">#{uc.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Usuario #{uc.userId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Cluster #{uc.clusterId}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {cluster?.perfilPromedio || 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {cluster && (
                            <Badge variant={getRiskBadgeVariant(cluster.riesgo)}>
                              {cluster.riesgo}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(uc.assignedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Diálogo para Crear/Editar Cluster */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Cluster" : "Crear Nuevo Cluster"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Actualiza la información del cluster"
                : "Completa los datos para crear un nuevo cluster"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="perfilPromedio">Perfil Promedio</Label>
                <Input
                  id="perfilPromedio"
                  placeholder="Ej: Cliente con ingreso alto y bajo riesgo"
                  value={formData.perfilPromedio}
                  onChange={(e) =>
                    setFormData({ ...formData, perfilPromedio: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="riesgo">Nivel de Riesgo</Label>
                <Select
                  value={formData.riesgo}
                  onValueChange={(value) =>
                    setFormData({ ...formData, riesgo: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el nivel de riesgo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajo">Bajo</SelectItem>
                    <SelectItem value="medio">Medio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estrategiaMkt">Estrategia de Marketing</Label>
                <Textarea
                  id="estrategiaMkt"
                  placeholder="Ej: Ofrecer productos premium con tasas preferenciales"
                  value={formData.estrategiaMkt}
                  onChange={(e) =>
                    setFormData({ ...formData, estrategiaMkt: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Confirmación para Eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el
              cluster y todas sus asignaciones de usuarios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClusterToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCluster}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clusters;