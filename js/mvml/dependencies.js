var scripts = [
  '//cdnjs.cloudflare.com/ajax/libs/js-yaml/3.0.2/js-yaml.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min.js',
  '//cdnjs.cloudflare.com/ajax/libs/loglevel/1.1.0/loglevel.min.js',
  '//cdnjs.cloudflare.com/ajax/libs/require.js/2.1.14/require.min.js',
  '/js/mvml/helpers.js',
  '/js/mvml/events.js'
];
var head = document.getElementsByTagName('head')[0];
for(var i = 0; i < scripts.length; i++) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = scripts[i];
  script.async = false;
  head.appendChild(script);
}
