var MVML = {
  init: function() {
    var scripts = document.getElementsByTagName('script');
    var scripts_path = scripts[scripts.length-1].src.split('/');
    scripts_path.pop();
    this.scripts_path = scripts_path.join('/');
  },
  
  ajax_get: function(url, callback) {
    var get = new XMLHttpRequest();
    get.open("GET", url, true);
    get.onreadystatechange = function() {
      if(get.readyState == 4 && get.status == 200) {
        callback(get.responseText);
      }
    }
    get.send();
  },

  load_tag: function() {
    var mvml = document.getElementsByTagName('mvml')[0];
    var src = mvml.getAttribute('src');
    if (src) {
      MVML.load_file(src);
    }
    else {
      MVML.load_string(mvml.innerHTML);
    }
  },

  load_string: function(string) {
    var html = this.to_html(string, function(html) {
      document.open();
      document.write(html+'</scri'+'pt></body></html>');
      document.close();
    });
  },
  
  load_file: function(url) {
    var that = this;
    this.ajax_get(url, function(contents) {
      that.load_string(contents);
    });
  },
  


  to_html: function(mvml, callback) {
    var view = this.generate_view(mvml);
    this.ajax_get(this.scripts_path+'/templates/main.html', function(template) {
      var html = Mustache.render(template, view);
      log.debug(view);
      log.debug(html);
      callback(html);
    });
  },
  
  defaults: {
    title: "MVML Space",
    motd: "",
    
    player: {
      move_speed: 15.0,
      turn_speed: 1.5,
      min_jump_speed: 10,
      max_jump_speed: 30,
      start: "(0,0,0)",
      gravity: 50
    },
    
    model: {
      color: 0xffffff,
      scale: "(1,1,1)",
      position: "(0,0,0)",
      rotation: "(0,0,0)",
      texture: null,
      physics: true,
      mass: 0
    },
    
    light: {
      color: 0x404040,
      intensity: 1.0,
      distance: 10.0,
      position: "(0,0,0)"
    }
  },

  convert_rotation: function(rotation) {
    rotation = rotation.substring(1, rotation.length-1);
    rotation = rotation.replace(/\s/g, '');
    rotation = rotation.split(',');
    rotation = _.map(rotation, function(degrees) {
      return degrees * Math.PI / 180.0;      
    });
    return "("+rotation.join(',')+")";
  },
    
  generate_view: function(mvml) {
    var mvml_object = jsyaml.load(mvml);
    var template = _.extend(
      this.base_view(mvml_object), 
      this.player_view(mvml_object),
      this.scene_view(mvml_object)
    );
    //log.trace(template);
    return template;
  },
  
  base_view: function(mvml) {
    return {
      scripts_path: this.scripts_path,
      title: (mvml && mvml.title) || this.defaults.title,
      motd: (mvml && mvml.motd) || this.defaults.motd
    };
  },
  
  player_view: function(mvml) {
    var player_options = _.extend({}, this.defaults.player, (mvml && mvml.player));
    return { player: player_options };
  },
  
  scene_view: function(mvml) {
    var scene = mvml && mvml.scene;
    var template = {
      models: _.union(this.new_scene_objects('primitive', scene),
                      this.new_scene_objects('mesh', scene)),
      lights: this.new_scene_objects('light', scene),
      audio: this.new_scene_objects('audio', scene)
    }
    template.scene_count = template.models.length +
                           template.lights.length +
                           template.audio.length + 1;
    //log.trace(template);
    return template;
  },
  
  new_scene_objects: function(type, scene) {
    var that = this;
    var objects = _.select(scene, function(object) {
      return object[type] !== undefined;
    });
    objects = _.collect(objects, function(object) {
      return that['new_'+type](object);
    });
    //log.trace(objects);
    return objects;
  },
  
  js_methods: {
    sphere: {
      geometry: 'SphereGeometry(1)',
      bounding: 'SphereMesh'
    },
    box: {
      geometry: 'BoxGeometry(1,1,1)',
      bounding: 'BoxMesh'
    },
    plane: {
      geometry: 'PlaneGeometry(1,1)',
      bounding: 'BoxMesh' // PlaneMesh is infinite
    },
    mesh: {
      bounding: 'BoxMesh' // TODO: option of ConcaveMesh or ConvexMesh
    },
    point: {
      light: 'PointLight'
    },
    directional: {
      light: 'DirectionalLight'
    },
    ambient: {
      light: 'AmbientLight'
    }
  },
  
  new_primitive: function(object) {
    return _.extend({
      geometry: this.js_methods[object.primitive].geometry,
      bounding: this.js_methods[object.primitive].bounding,
      mesh: false
    }, this.new_model(object));
  },
  
  new_mesh: function(object) {
    return _.extend({
      geometry: object.mesh,
      bounding: this.js_methods.mesh.bounding,
      mesh: true
    }, this.new_model(object));
  },

  stringify_color: function(color) {
    return "\'"+color+"\'"
  },
  
  new_model: function(object) {
    if (object.rotation !== undefined) {
      object.rotation = this.convert_rotation(object.rotation)
    }
    if (typeof object.color === 'string') {
      object.color = this.stringify_color(object.color);
    }
    if (object.physics === "off") {
      object.physics = false;
    }
    return _.extend({}, this.defaults.model, object);
  },
  
  new_light: function(object) {
    if (typeof object.color === 'string') {
      object.color = this.stringify_color(object.color);
    }
    return _.extend({
      light_type: this.js_methods[object.light].light
    }, this.defaults.light, object);
  },
  
  new_audio: function(object) {
    return {};
  }
};
