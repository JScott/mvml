/**
 * @author James Baicoianu / http://www.baicoianu.com/
 */

THREE.FlyControls = function ( object, domElement ) {

  this.object = object;

  this.domElement = ( domElement !== undefined ) ? domElement : document;
  if ( domElement ) this.domElement.setAttribute( 'tabindex', -1 );

  // API

  this.movementSpeed = 1.0;
  this.rollSpeed = 0.005;

  this.dragToLook = false;
  this.autoForward = false;

  // disable default target object behavior

  // internals

  this.tmpQuaternion = new THREE.Quaternion();

  this.mouseStatus = 0;

  this.moveState = { up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0, pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0, rollLeft: 0, rollRight: 0 };
  this.moveVector = new THREE.Vector3( 0, 0, 0 );
  this.rotationVector = new THREE.Vector3( 0, 0, 0 );
  this.lookVector = new THREE.Vector3( 0, 0, -1 );

  this.handleEvent = function ( event ) {

    if ( typeof this[ event.type ] == 'function' ) {

      this[ event.type ]( event );

    }

  };

  this.mousedown = function( event ) {

    if ( this.domElement !== document ) {

      this.domElement.focus();

    }

    event.preventDefault();
    event.stopPropagation();

    if ( this.dragToLook ) {

      this.mouseStatus ++;

    } else {

      switch ( event.button ) {

        case 0: this.moveState.forward = 1; break;
        case 2: this.moveState.back = 1; break;

      }

      this.updateMovementVector();

    }

  };

  this.mousemove = function( event ) {

    if ( !this.dragToLook || this.mouseStatus > 0 ) {

      var container = this.getContainerDimensions();
      var halfWidth  = container.size[ 0 ] / 2;
      var halfHeight = container.size[ 1 ] / 2;

      this.moveState.yawLeft   = - ( ( event.pageX - container.offset[ 0 ] ) - halfWidth  ) / halfWidth;
      this.moveState.pitchDown =   ( ( event.pageY - container.offset[ 1 ] ) - halfHeight ) / halfHeight;

      this.updateRotationVector();

    }

  };

  this.mouseup = function( event ) {

    event.preventDefault();
    event.stopPropagation();

    if ( this.dragToLook ) {

      this.mouseStatus --;

      this.moveState.yawLeft = this.moveState.pitchDown = 0;

    } else {

      switch ( event.button ) {

        case 0: this.moveState.forward = 0; break;
        case 2: this.moveState.back = 0; break;

      }

      this.updateMovementVector();

    }

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

    //if (clock.elapsedTime % 1 < 0.01) console.log(movement);
    this.object.position.add(movement);

    //this.object.rotation.x += this.rotationVector.x * rotMult;
    //this.object.rotation.y += this.rotationVector.y * rotMult;
    //this.object.rotation.z += this.rotationVector.z * rotMult;

    //if (clock.elapsedTime % 1 < 0.01) console.log(this.lookVector);

    var matrix = new THREE.Matrix4().makeRotationAxis(right, this.rotationVector.y * rotMult);
    this.lookVector.applyMatrix4(matrix);
    matrix = new THREE.Matrix4().makeRotationY(this.rotationVector.x * rotMult);
    this.lookVector.applyMatrix4(matrix);

    var lookTarget = this.lookVector.clone();
    this.object.lookAt(lookTarget.add(this.object.position));
    //this.object.lookAt(this.lookVector.add(this.object.position));
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

  this.updateMovementVector();
  this.updateRotationVector();

};