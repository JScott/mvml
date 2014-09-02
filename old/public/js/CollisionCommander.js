THREE.CollisionCommander = function () {

  this.mesh_list = [];
  this.theta = 0.1;

  this.distance = function(mesh, movement) {
    // TODO: better vertices. slow and some vertices seem to take priority or something? swapping these *shouldn't* make a difference
    //for (var vertex_index = 0; vertex_index < mesh.geometry.vertices.length; vertex_index++)
    for (var vertex_index = mesh.geometry.vertices.length-1; vertex_index >= 0; vertex_index--)
    {
      var local_vertex = mesh.geometry.vertices[vertex_index].clone();
      var global_vertex = local_vertex.applyMatrix4( mesh.matrix );

      var ray = new THREE.Raycaster(global_vertex, movement.clone());
      var results = ray.intersectObjects(this.mesh_list);
      if (results.length > 0 && results[0].distance < movement.length()) {
        var shortest_distance = results.reduce(function(previous, result) {
          return Math.min(previous, result.distance);
        }, Number.POSITIVE_INFINITY);
        return shortest_distance;
      }
    }
    return -1;
  };
};
