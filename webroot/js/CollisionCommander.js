THREE.CollisionCommander = function () {

  this.mesh_list = [];
  this.theta = 0.1;

  this.distance = function(mesh, movement) {
    for (var vertex_index = 0; vertex_index < mesh.geometry.vertices.length; vertex_index++)
    {
      var local_vertex = mesh.geometry.vertices[vertex_index].clone();
      var global_vertex = local_vertex.applyMatrix4( mesh.matrix );
      
      var ray = new THREE.Raycaster(global_vertex, movement.clone());
      var results = ray.intersectObjects(this.mesh_list);
      if (results.length > 0 && results[0].distance < movement.length()) {
        return results[0].distance;
      }
    }
    return -1;
  };
};
