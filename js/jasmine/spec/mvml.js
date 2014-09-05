describe('MVML', function() {
  describe('.convert_rotation', function() {
    it('converts degrees in "(x,y,z)" vectors to radians"', function() {
      var radian_vector = MVML.convert_rotation('(0, 180, -90)');
      expect(radian_vector).toMatch(/^\(0,3.141592.*,-1.570796.*\)$/);
    });
  });
});
