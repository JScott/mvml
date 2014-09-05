describe('MVML', function() {
  var mvml_strings = {
    blank: '',
    bad: "---\nbad_list:\n    -ain'tgood\n-atall"
  };
  describe('.convert_rotation', function() {
    it('converts degrees in "(x,y,z)" vectors to radians"', function() {
      var radian_vector = MVML.convert_rotation('(0, 180, -90)');
      expect(radian_vector).toMatch(/^\(0,3.141592.*,-1.570796.*\)$/);
    });
  });
  
  describe('.to_html', function() {
    it('generates WebGL/three.js HTML from MVML', function() {
      var string = '';
      runs(MVML.to_html("---\ntitle: hi", function(data) {
        string = data;
      }));
      
      waitsFor(function() {
        return string != '';
      });
      
      runs(function() {
        console.log(string);
        expect(string).toMatch(/<html.*>/);
        expect(string).toMatch(/three.*js/);
        expect(string).toMatch(/<title>hi<\/title>/);
      });
    });
  });
});
