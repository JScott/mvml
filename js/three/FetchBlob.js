var get_blob = function(url) {
  var string, blob;
  var get = new XMLHttpRequest();
  get.open("GET", url, false);
  get.onreadystatechange = function() {
    if(get.readyState == 4 && get.status == 200) {
      string = get.responseText;
    }
  }
  get.send();
  try {
    blob = new Blob([string], {type: 'application/javascript'});
  } catch (e) { // Backwards-compatibility
    window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
    blob = new BlobBuilder();
    blob.append(string);
    blob = blob.getBlob();
  }
  return blob;
}
