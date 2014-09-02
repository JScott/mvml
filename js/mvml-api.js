var MVML = {
  load_string: function(string) {
    var html = this.to_html(string)
    document.open();
    document.write(html);
    document.close();
    log.trace('nothing');
  },

  load_file: function(url) {
    var mvml = this;
    var get = new XMLHttpRequest();
    get.open("GET", url, true);
    get.onreadystatechange = function() {
      if(get.readyState == 4 && get.status == 200) {
        mvml.load_string(get.responseText);
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
    
    move_speed: 15,
    turn_speed: 1.5,
    min_jump_speed: 10,
    max_jump_speed: 30,
    start: "(0,0,0)",
    gravity: 50,
    
    color: "0xffffff",
    scale: "(1,1,1)",
    position: "(0,0,0)",
    rotation: "(0,0,0)",
    texture: null,
    physics: true,
    mass: 0
  },
  generate_view: function(mvml) {
    var mvml_object = jsyaml.load(mvml);
    
    // var template = this.base_view;
    // _.extend(template, this.player_view);
    // _.extend(template, this.scene_view);
    log.trace(mvml_object);
    return mvml_object;
  }
};
