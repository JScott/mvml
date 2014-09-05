var scripts = [
  'js/mvml-dependencies.js',
  'js/mvml-api.js',
  'js/mvml-replace.js'
];
var head = document.getElementsByTagName('head')[0];
for(var i = 0; i < scripts.length; i++) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scripts[i];
  script.async = false;
  head.appendChild(script);
}
