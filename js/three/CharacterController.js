// Based on FlyControls by James Baicoianu (http://www.baicoianu.com/)

THREE.CharacterController = function ( camera, mesh ) {
  this.camera = camera;
  this.mesh = mesh;

  // API
  this.height = 1.0;
  this.gravity = 9.8;
  this.movementSpeed = 1.0;
  this.rollSpeed = 0.005;
  this.maxJumpSpeed = 2.0;
  this.minJumpSpeed = 0.0;

  // disable default target object behavior

  // internals
  this.mesh.jumping = false;
  this.jumpKeyHeld = false;
  this.moveState = {
    up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0,
    pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0
  };
  this.moveVector = new THREE.Vector3( 0, 0, 0 );
  this.rotationVector = new THREE.Vector3( 0, 0, 0 );
  this.lookVector = new THREE.Vector3( 0, 0, -1 );

  this.mesh.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
    // TODO: Use cross product instead to check if the collision surface slope angle was < 45 degrees
    //if (this.getLinearVelocity().y < 1) {
      this.jumping = false;
    //}
  });

  this.handleEvent = function ( event ) {
    if ( typeof this[ event.type ] == 'function' ) {
      this[ event.type ]( event );
    }
  };

  this.setJumping = function(start) {
    return; // DISABLED until jumping works
    if (start) {
      this.mesh.setLinearVelocity(this.mesh.getLinearVelocity().setY(this.maxJumpSpeed));
      this.mesh.jumping = true;
      this.jumpKeyHeld = true;
    }
    else {
      var newJumpSpeed = Math.min(this.mesh.getLinearVelocity().y, this.minJumpSpeed);
      this.mesh.setLinearVelocity(this.mesh.getLinearVelocity().setY(newJumpSpeed));
      this.jumpKeyHeld = false;
    }
  }

  this.move = function( vector ) {
    vector.setY(this.mesh.getLinearVelocity().y);
    this.mesh.setLinearVelocity( vector );

    this.mesh.rotation.set(0,0,0);
    this.mesh.__dirtyRotation = true;
    
    this.camera.position = this.mesh.position.clone();
    this.camera.position.add(new THREE.Vector3(0,this.height,0));
  }

  this.update = function( delta ) {
    var moveMult = this.movementSpeed; // Physijs handles time delta
    var rotMult = delta * this.rollSpeed;
    var forward = this.lookVector.clone().setY(0);
    var up = new THREE.Vector3(0,1,0);
    var right = forward.clone().cross(up);

    //if (clock.elapsedTime % 1 < 0.01) console.log(movement);
    var movement_xz = right.clone().multiplyScalar(this.moveVector.x);
    movement_xz.add( forward.multiplyScalar(-this.moveVector.z) );
    movement_xz.normalize().multiplyScalar(moveMult);
    this.move(movement_xz);

    var matrix = new THREE.Matrix4().makeRotationAxis(right, this.rotationVector.y * rotMult);
    this.lookVector.applyMatrix4(matrix);
    matrix = new THREE.Matrix4().makeRotationY(this.rotationVector.x * rotMult);
    this.lookVector.applyMatrix4(matrix);
    this.camera.lookAt(this.lookVector.clone().add(this.camera.position));
  };

  this.updateMovementVector = function() {
    this.moveVector.x = ( this.moveState.right - this.moveState.left );
    this.moveVector.z = ( this.moveState.back - this.moveState.forward );
  };

  this.updateRotationVector = function() {
    this.rotationVector.y = ( -this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.x = ( -this.moveState.yawRight  + this.moveState.yawLeft );
    this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );
  };

  this.updateMovementVector();
  this.updateRotationVector();
};
