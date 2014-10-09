var MVML = MVML || {};
_.extend(MVML, {
  find: function(object) {
    switch (typeof object) {
      case 'number':
        object = this.scene.getObjectById(object);
        break;
      case 'string':
        object = this.scene.getObjectByName(object);
        break;
      case 'object':
        break;
      default:
        console.log('Unknown selector type: '+object);
        break;
    }
    return object;
  },

  rotate: function(object) {
    object = this.find(object);
    var rotation = object.rotation;
    return {
      by: function(x,y,z) {
        rotation.set(rotation.x+x, rotation.y+y, rotation.z+z);
        object.__dirtyRotation = true;
      },
      to: function(x,y,z) {
        rotation.set(x,y,z);
        object.__dirtyRotation = true;
      }
    };
  },
  
  move: function(object) {
    object = this.find(object);
    var position = object.position;
    return {
      by: function(x,y,z) {
        position.set(position.x+x, position.y+y, position.z+z);
        object.__dirtyPosition = true;
      },
      to: function(x,y,z) {
        position.set(x,y,z);
        object.__dirtyPosition = true;
      }
    };
  }
});
