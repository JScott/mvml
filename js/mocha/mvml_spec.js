describe('MVML', function() {
  var specs;
  before(function() {
    specs = {
      empty: '',
      bad: "---\nalist:\n   -what?\n  not good.",
      good: "---\ntitle: test\nscene:\n- primitive: sphere"
    };
  });

  describe('.to_html', function() {
    describe('with valid MVML', function() {
      it("generates WebGL/three.js HTML", function(done) {
        MVML.to_html(specs.good, function(html) {
          expect(html).to.match(/<html.*>/);
          expect(html).to.match(/three.*js/);
          done();
        });
      });
      it("uses the given MVML variables", function(done) {
        MVML.to_html(specs.good, function(html) {
          expect(html).to.match(/<title>test<\/title>/);
          expect(html).to.match(/SphereGeometry/);
          done();
        });
      });
    });
    
    describe('with an empty string', function() {
      it("still generates WebGL/three.js HTML", function(done) {
        MVML.to_html(specs.empty, function(html) {
          expect(html).to.match(/<html.*>/);
          expect(html).to.match(/three.*js/);
          done();
        });
      });
    });
    
    describe('with badly-formatted MVML', function() {
      it("throws a YAML parsing exception", function() {
        expect(function() { MVML.to_html(specs.bad); }).to.throwException(function(e) { 
          var exception_type = e.name;
          expect(exception_type).to.equal('YAMLException');
        });
      });
    });

  });
  
  describe('.generate_view', function() {
    var for_mvml;
    before(function() {
      for_mvml = [
        'scripts_path',
        'title',
        'motd',
        'player',
        'models',
        'lights',
        'audio'
      ];
    });
    
    describe('with valid MVML', function() {
      it("generates an Object", function() {
        var view = MVML.generate_view(specs.good);
        expect(view).to.be.an('object');
      });
      it("generates the components for an MVML scene", function() {
        var view = MVML.generate_view(specs.good);
        expect(view).to.have.keys(for_mvml);
      });
    });

    describe('with an empty string', function() {
      it("generates an Object", function() {
        var view = MVML.generate_view(specs.empty);
        expect(view).to.be.an('object');
      });
      it("generates the components for an MVML scene", function() {
        var view = MVML.generate_view(specs.empty);
        expect(view).to.have.keys(for_mvml);
      });
    });
    
    describe('with badly-formatted MVML', function() {
      it("throws a YAML parsing exception", function() {
        expect(function() { MVML.generate_view(specs.bad); }).to.throwException(function(e) { 
          var exception_type = e.name;
          expect(exception_type).to.equal('YAMLException');
        });
      });
    });

  });
  
  describe('.convert_rotation', function() {
    it('converts degrees in a "(x,y,z)" rotation vector to radians', function() {
      var result = MVML.convert_rotation('(0, 180,-90)');
      expect(result).to.match(/^\(0,3.141592.*,-1.570796.*\)$/);
    });
  });
});
