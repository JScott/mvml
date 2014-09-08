window.onload = function() {
  var mvml = document.getElementsByTagName('mvml')[0].innerHTML;
  log.setLevel('trace');
  MVML.load_string(mvml);
}
