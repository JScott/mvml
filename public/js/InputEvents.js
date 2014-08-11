THREE.InputEvents = function ( controller ) {
  this.mouseDragging = false;
  this.panStart = new THREE.Vector2(0,0);
  this.domElement = document;

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
      case 32: /* space */
        if (!controller.mesh.jumping && !controller.jumpKeyHeld) {
          controller.setJumping(true);
        }
        break;
      case 87: /*W*/ controller.moveState.forward = 1; break;
      case 83: /*S*/ controller.moveState.back = 1; break;
      case 65: /*A*/ controller.moveState.left = 1; break;
      case 68: /*D*/ controller.moveState.right = 1; break;
    }
    controller.updateMovementVector();
    controller.updateRotationVector();
  };

  this.keyup = function( event ) {
    switch( event.keyCode ) {
      case 32: /* space */
        controller.setJumping(false);
        break;
      case 87: /*W*/ controller.moveState.forward = 0; break;
      case 83: /*S*/ controller.moveState.back = 0; break;
      case 65: /*A*/ controller.moveState.left = 0; break;
      case 68: /*D*/ controller.moveState.right = 0; break;
    }
    controller.updateMovementVector();
    controller.updateRotationVector();
  };

  this.touchstart = function( event ) {
    //document.getElementById('info').innerHTML = event.targetTouches.length;
    var touch = event.targetTouches[0];
    this.pan_start(event, touch);
  };

  this.mousedown = function( event ) {
    this.mouseDragging = true;
    this.pan_start(event);
  };

  this.pan_start = function( event, touch ) {
    event.preventDefault();
    event.stopPropagation();
    var touch_passed = arguments.length > 1
    var x = touch_passed ? touch.pageX : event.pageX;
    var y = touch_passed ? touch.pageY : event.pageY;

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

  this.move_back = function() {
    controller.moveState.back = 1;
    controller.moveState.forward = 0;
    controller.updateMovementVector();
  }
  this.move_stop = function() {
    controller.moveState.back = 0;
    controller.moveState.forward = 0;
    controller.updateMovementVector();
  }
  this.move_forward = function() {
    controller.moveState.back = 0;
    controller.moveState.forward = 1;
    controller.updateMovementVector();
  }
  this.rotate_start = function( yawLeft, pitchDown ) {
    controller.moveState.yawLeft = yawLeft;
    controller.moveState.pitchDown = pitchDown;
    controller.updateRotationVector();
  }
  this.rotate_stop = function() {
    controller.moveState.yawLeft = 0;
    controller.moveState.pitchDown = 0;
    controller.updateRotationVector();
  }

  this.pan_move = function(x, y, touches) {
    if ( this.mouseDragging ) {
      var container = this.getContainerDimensions();
      var halfWidth  = container.size[ 0 ] / 2;
      var halfHeight = container.size[ 1 ] / 2;

      this.rotate_start(
        -( ( x - container.offset[ 0 ] ) - halfWidth  ) / halfWidth,
         ( ( y - container.offset[ 1 ] ) - halfHeight ) / halfHeight
      );
    }
    else if ( touches == 1 ) {
      this.move_stop();

      var container = this.getContainerDimensions();
      var halfWidth  = container.size[ 0 ] / 2;
      var halfHeight = container.size[ 1 ] / 2;

      this.rotate_start(
        -(this.panStart.x - x) / halfWidth,
         (this.panStart.y - y) / halfHeight
      );
    }
    else if ( touches == 2 ) {
      this.rotate_stop();
      this.move_forward();
    }
    else if ( touches >= 2 ) {
      this.rotate_stop();
      this.move_back();
    }
  };

  this.touchend = function( event ) {
    //document.getElementById('info').innerHTML = event.targetTouches.length;
    var touch = event.targetTouches[0];
    this.pan_end(event);
  };

  this.mouseup = function( event ) {
    this.mouseDragging = false;
    this.pan_end(event);
  };

  this.pan_end = function( event ) {
    event.preventDefault();
    event.stopPropagation();
    this.rotate_stop();
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
    return function() {
      fn.apply( scope, arguments );
    };
  }

  this.domElement.addEventListener( 'contextmenu', function( event ) { event.preventDefault(); }, false );

  this.domElement.addEventListener( 'mousemove', bind( this, this.mousemove ), false );
  this.domElement.addEventListener( 'mousedown', bind( this, this.mousedown ), false );
  this.domElement.addEventListener( 'mouseup',   bind( this, this.mouseup ), false );

  this.domElement.addEventListener( 'touchmove', bind( this, this.touchmove ), false );
  this.domElement.addEventListener( 'touchstart', bind( this, this.touchstart ), false );
  this.domElement.addEventListener( 'touchend',   bind( this, this.touchend ), false );

  window.addEventListener( 'keydown', bind( this, this.keydown ), false );
  window.addEventListener( 'keyup',   bind( this, this.keyup ), false );
};