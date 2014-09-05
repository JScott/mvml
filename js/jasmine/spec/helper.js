beforeEach(function () {
  jasmine.addMatchers({
    toBeHTMLGL: function () {
      return {
        compare: function (actual) {
          var isHTML = actual.match(/<html.*>/) !== null;
          var isWebGL = actual.match(/three.*js/) !== null;

          var result = { pass: isHTML && isWebGL };
          if (result.pass) {
            result.message = "Expected given string to NOT be HTML/WebGL";
          }
          else {
            result.message = "Expected given string to be HTML/WebGL";
          }
          return result;
        }
      };
    }
  });
});
