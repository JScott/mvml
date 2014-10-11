var MVML = MVML || {};
_.extend(MVML, {
  event: (function(){
    var topic = {};
    return {
      subscribe: function(name, listener) {
        if ( _.isUndefined(topic[name]) ) {
          topic[name] = { queue: [] };
        }
        var index = topic[name].queue.push(listener) - 1;

	    return {
		  remove: function() {
			delete topic[name].queue[index];
		  }
	    };
      },
      
      publish: function(name, data) {
        if(_.isUndefined(topic[name]) || topic[name].queue.length == 0) {
          return;
        }

        topic[name].queue.forEach(function(callback) {
      	  callback(data || null);
        });
      }
    };
  })()
});
