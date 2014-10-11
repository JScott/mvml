describe('Hooks (PubSub)', function() {
  var specs;
  before(function() {
    specs = {
      empty: '',
      bad: "---\nalist:\n   -what?\n  not good.",
      good: "---\ntitle: test\nscene:\n- primitive: sphere"
    };
  });

  describe('.hook.on', function() {
    var name, callback;
    before(function() {
      name = 'test';
      callback = null;
    });
    beforeEach(function() {
      MVML.hook.list = {};
    });

    it("creates a new hook and adds the given callback", function() {
      MVML.hook.on(name, callback);
      var hooks = MVML.hook.list
      expect(hooks).to.have.key(name);
      expect(hooks[name].queue).to.not.be.empty();
    });
    it("returns an object that facilitates callback removal", function() {
      var hook = MVML.hook.on(name, callback);
      console.log(MVML.hook.list[name]);
      hook.remove();
      var hooks = MVML.hook.list
      expect(hooks).to.have.key(name);
      console.log(hooks[name]);
      expect(hooks[name].queue).to.be.empty();
    });
    it("converts hook names into strings", function() {
      var given_names = [
        'hi',
        1,
        1.1,
        null
      ];
      var expected_names = [
        'hi',
        '1',
        '1.1',
        'null'
      ];
      _.each(given_names, function(name) {
        MVML.hook.on(name, callback);
      });
      expect(MVML.hook.list).to.only.have.keys(expected_names);
    });
  });
  
  describe('.hook.trigger', function() {
    var count, name, callback;
    before(function() {
      name = 'test';
      callback = function(x) {
        if (x === null) {
          count += 1;
        }
        else {
          count += x;
        }
      };
    });
    beforeEach(function() {
      count = 0;
      MVML.hook.list = {};
    });
  
    it("triggers all callbacks hooked to a given name", function() {
      MVML.hook.on(name, callback);
      MVML.hook.on(name, callback);
      MVML.hook.trigger(name);
      expect(count).to.be(2);
    });
    it("can pass data to the hooked callbacks", function() {
      MVML.hook.on(name, callback);
      MVML.hook.trigger(name, 10);
      expect(count).to.be(10);
    });
    it("can trigger unregistered hooks to no effect", function() {
      MVML.hook.on(name, callback);
      MVML.hook.trigger('foo', 'bar');
      expect(count).to.be(0);
    });
  });
  
});
