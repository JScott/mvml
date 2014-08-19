var MVML = {
  api_url: "http://direct.dev.mvml.net:6865/",

  load_string: function(string) {
    var post = new XMLHttpRequest();
    post.open("POST", this.api_url, true);
    post.setRequestHeader("Content-Type", "text/mvml");
    post.onreadystatechange = function() {
      if(post.readyState == 4 && post.status == 200) {
        document.write(post.responseText);
        document.close();
      }
    }
    post.send(string);
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
  }
};
