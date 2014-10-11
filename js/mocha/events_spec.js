describe('PubSub Events', function() {
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
});
