/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.FlyControls = function ( camera, mesh, collision_commander ) {

  this.camera = camera;
  this.mesh = mesh;
  this.collision = collision_commander;

  this.domElement = document;

  // API

  this.movementSpeed = 1.0;
  this.rollSpeed = 0.005;

  this.autoForward = false;

  // disable default target object behavior

  // internals

  this.tmpQuaternion = new THREE.Quaternion();

  this.panStart = new THREE.Vector2(0,0);
  this.mouseDragging = false;

  this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
  this.moveVector = new THREE.Vector3( 0, 0, 0 );
  this.rotationVector = new THREE.Vector3( 0, 0, 0 );
  this.lookVector = new THREE.Vector3( 0, 0, -1 );

  this.handleEvent = function ( event ) {

    if ( typeof this[ event.type ] == 'function' ) {

      this[ event.type ]( event );

    }

  };

  this.keydown = function( event ) {

    if ( event.altKey ) {

      return;

    }

    //event.preventDefault();

    switch ( event.keyCode ) {

      case 16: /* shift */ this.movementSpeedMultiplier = .1; break;

      case 87: /*W*/ this.moveState.forward = 1; break;
      case 83: /*S*/ this.moveState.back = 1; break;

      case 65: /*A*/ this.moveState.left = 1; break;
      case 68: /*D*/ this.moveState.right = 1; break;

      case 82: /*R*/ this.moveState.up = 1; break;
      case 70: /*F*/ this.moveState.down = 1; break;

      case 38: /*up*/ this.moveState.pitchUp = 1; break;
      case 40: /*down*/ this.moveState.pitchDown = 1; break;

      case 37: /*left*/ this.moveState.yawLeft = 1; break;
      case 39: /*right*/ this.moveState.yawRight = 1; break;

      case 81: /*Q*/ this.moveState.rollLeft = 1; break;
      case 69: /*E*/ this.moveState.rollRight = 1; break;

    }

    this.updateMovementVector();
    this.updateRotationVector();

  };

  this.keyup = function( event ) {

    switch( event.keyCode ) {

      case 16: /* shift */ this.movementSpeedMultiplier = 1; break;

      case 87: /*W*/ this.moveState.forward = 0; break;
      case 83: /*S*/ this.moveState.back = 0; break;

      case 65: /*A*/ this.moveState.left = 0; break;
      case 68: /*D*/ this.moveState.right = 0; break;

      case 82: /*R*/ this.moveState.up = 0; break;
      case 70: /*F*/ this.moveState.down = 0; break;

      case 38: /*up*/ this.moveState.pitchUp = 0; break;
      case 40: /*down*/ this.moveState.pitchDown = 0; break;

      case 37: /*left*/ this.moveState.yawLeft = 0; break;
      case 39: /*right*/ this.moveState.yawRight = 0; break;

      case 81: /*Q*/ this.moveState.rollLeft = 0; break;
      case 69: /*E*/ this.moveState.rollRight = 0; break;

    }

    this.updateMovementVector();
    this.updateRotationVector();

  };

  this.touchstart = function( event ) {
    //document.getElementById('info').innerHTML = event.targetTouches.length;
    var touch = event.targetTouches[0];
    this.pan_start(touch.pageX, touch.pageY);
  };

  this.mousedown = function( event ) {
    this.mouseDragging = true;
    this.pan_start(event.pageX, event.pageY);
  };

  this.pan_start = function(x, y) {
    event.preventDefault();
    event.stopPropagation();

    if ( this.domElement !== document ) {
      this.domElement.focus();
    }
    
    this.panStart.x = x;
    this.panStart.y = y;
  };

  this.touchmove = function( event ) {
    var touch = event.targetTouches[0];
    this.pan_move(touch.pageX, touch.pageY, event.targetTouches.length);
  };

  this.mousemove = function( event ) {
    this.mouseDown = true;
    this.pan_move(event.pageX, event.pageY, 0);
  };

  this.pan_move = function(x, y, touches) {
    if ( this.mouseDragging ) {
      var container = this.getContainerDimensions();
      var halfWidth  = container.size[ 0 ] / 2;
      var halfHeight = container.size[ 1 ] / 2;

      this.moveState.yawLeft   = -( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
      this.moveState.pitchDown =  ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

      this.updateRotationVector();
    }
    else if ( touches == 1 ) {
      this.moveState.back = 0;
      this.moveState.forward = 0;
      this.updateMovementVector();

      var container = this.getContainerDimensions();
      var halfWidth  = container.size[ 0 ] / 2;
      var halfHeight = container.size[ 1 ] / 2;

      this.moveState.yawLeft   = -(this.panStart.x - x) / halfWidth;
      this.moveState.pitchDown =  (this.panStart.y - y) / halfHeight;
      this.updateRotationVector();
    }
    else if ( touches == 2 ) {
      this.moveState.yawLeft = 0;
      this.moveState.pitchDown = 0;
      this.updateRotationVector();
     
      this.moveState.back = 0;
      this.moveState.forward = 1;
      this.updateMovementVector();
    }
    else if ( touches >= 2 ) {
      this.moveState.yawLeft = 0;
      this.moveState.pitchDown = 0;
      this.updateRotationVector();
     
      this.moveState.back = 1;
      this.moveState.forward = 0;
      this.updateMovementVector();
    }
  };

  this.touchend = function( event ) {
    //document.getElementById('info').innerHTML = event.targetTouches.length;
    var touch = event.targetTouches[0];
    this.pan_end();
  };

  this.mouseup = function( event ) {
    this.mouseDragging = false;
    this.pan_end();
  };

  this.pan_end = function() {
    event.preventDefault();
    event.stopPropagation();

    this.moveState.forward = this.moveState.back = 0;
    this.moveState.yawLeft = this.moveState.pitchDown = 0;
    this.updateMovementVector();
    this.updateRotationVector();
  };

  this.update = function( delta ) {
    var moveMult = delta * this.movementSpeed;
    var rotMult = delta * this.rollSpeed;
    var forward = this.lookVector.clone();
    forward.y = 0;
    var right = forward.clone().cross( new THREE.Vector3(0,1,0) );

    var movement = right.clone().multiplyScalar(this.moveVector.x);
    movement.add( forward.multiplyScalar(-this.moveVector.z) );
    movement.normalize().multiplyScalar(moveMult);

    var distance = this.collision.distance( this.mesh, movement );
    if (distance > 0) {
      movement.normalize().multiplyScalar(distance - collision.theta);
    }

    //if (clock.elapsedTime % 1 < 0.01) console.log(movement);
    this.camera.position.add(movement);
    this.mesh.position.add(movement);

    var matrix = new THREE.Matrix4().makeRotationAxis(right, this.rotationVector.y * rotMult);
    this.lookVector.applyMatrix4(matrix);
    matrix = new THREE.Matrix4().makeRotationY(this.rotationVector.x * rotMult);
    this.lookVector.applyMatrix4(matrix);

    this.camera.lookAt(this.lookVector.clone().add(this.camera.position));
  };

  this.updateMovementVector = function() {
    var forward = ( this.moveState.forward || ( this.autoForward && !this.moveState.back ) ) ? 1 : 0;

    this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
    this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
    this.moveVector.z = ( -forward + this.moveState.back );

    //console.log( 'move:', [ this.moveVector.x, this.moveVector.y, this.moveVector.z ] );
  };

  this.updateRotationVector = function() {
    this.rotationVector.y = ( -this.moveState.pitchDown + this.moveState.pitchUp );
    this.rotationVector.x = ( -this.moveState.yawRight  + this.moveState.yawLeft );
    this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

    //console.log( 'rotate:', [ this.rotationVector.x, this.rotationVector.y, this.rotationVector.z ] );
  };

  this.getContainerDimensions = function() {

    if ( this.domElement != document ) {

      return {
        size  : [ this.domElement.offsetWidth, this.domElement.offsetHeight ],
        offset  : [ this.domElement.offsetLeft,  this.domElement.offsetTop ]
      };

    } else {

      return {
        size  : [ window.innerWidth, window.innerHeight ],
        offset  : [ 0, 0 ]
      };

    }

  };

  function bind( scope, fn ) {

    return function () {

      fn.apply( scope, arguments );

    };

  };

  this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

  this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
  this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
  this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

  this.domElement.addEventListener( 'touchmove', bind( this, this.touchmove ), false );
  this.domElement.addEventListener( 'touchstart', bind( this, this.touchstart ), false );
  this.domElement.addEventListener( 'touchend',   bind( this, this.touchend ), false );

  window.addEventListener( 'keydown', bind( this, this.keydown ), false );
  window.addEventListener( 'keyup',   bind( this, this.keyup ), false );

  this.updateMovementVector();
  this.updateRotationVector();

};
