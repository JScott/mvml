var MVML = {
  load_string: function(string) {
    var html = this.to_html(string)
    document.open();
    document.write(html);
    document.close();
    log.trace('nothing');
  },

  load_file: function(url) {
    var that = this;
    var get = new XMLHttpRequest();
    get.open("GET", url, true);
    get.onreadystatechange = function() {
      if(get.readyState == 4 && get.status == 200) {
        that.load_string(get.responseText);
      }
    }
    get.send();
    log.trace('nothing');
  },
  
  to_html: function(mvml) {
    var view = this.generate_view(mvml);
    // template = load template file
    // return Mustache.render(template, view)
    log.trace(view);
    return view;
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
      color: "0xffffff",
      scale: "(1,1,1)",
      position: "(0,0,0)",
      rotation: "(0,0,0)",
      texture: null,
      physics: true,
      mass: 0
    }
  },
  
  generate_view: function(mvml) {
    var mvml_object = jsyaml.load(mvml);
    var template = _.extend(
      this.base_view(mvml_object), 
      this.player_view(mvml_object),
      this.scene_view(mvml_object)
    );
    log.trace(template);
    return template;
  },
  
  base_view: function(mvml) {
    return {
      title: mvml.title || this.defaults.title,
      motd: mvml.motd || this.defaults.motd
    };
  },
  
  player_view: function(mvml) {
    var player_options = _.extend(this.defaults.player, mvml.player);
    return { player: player_options };
  },
  
  scene_types: [
    { name: 'primitive', plural: 'primitives' },
    { name: 'mesh', plural: 'meshes' },
    { name: 'light', plural: 'lights' },
    { name: 'audio', plural: 'audio' }
  ],
  
  scene_view: function(mvml) {
    var that = this;
    var template = {}
    _.each(this.scene_types, function(type) {
      template[type.plural] = that.new_scene_objects(type.name, mvml.scene)
    });
    return template;
  },
  
  new_scene_objects: function(type, scene) {
    var that = this;
    var objects = _.select(scene, function(object) {
      return object[type] !== undefined;
    });
    return _.collect(objects, function(object) {
      return that['new_'+type](object);
    });
  },
  
  primitive_js_methods: {
    sphere: {
      render: 'SphereGeometry(1)',
      bounding: 'SphereMesh'
    },
    box: {
      render: 'BoxGeometry(1,1,1)',
      bounding: 'BoxMesh'
    },
    plane: {
      render: 'PlaneGeometry(1,1)',
      bounding: 'BoxMesh' // PlaneMesh is infinite
    }
  },
  
  new_primitive: function(object) {
    return _.extend({
      render_call: this.primitive_js_methods[object.primitive].render,
      bounding: this.primitive_js_methods[object.primitive].bounding
    }, this.new_model(object));
  },
  
  new_mesh: function(object) {
    return _.extend({
      path: object.mesh
    }, this.new_model(object));
  },
  
  new_model: function(object) {
    if (object.rotation !== undefined) {
      object.rotation = this.convert_rotation(object.rotation)
    }
    if (typeof object.color === "string") {
      object.color = "\'"+object.color+"\'"
    }
    return _.extend(this.defaults.model, object);
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
  
  new_light: function(object) {
    return {};
  },
  
  new_audio: function(object) {
    return {};
  }
};
