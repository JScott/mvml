var MVML = MVML || {};
_.extend(MVML, {
  events: (function(){
    var topics = {};
    return {
      subscribe: function(topic_name, listener) {
        var topic = topics[topic_name];
        
        if ( _.isUndefined(topic) ) {
          topic = { queue: [] };
        }
        var index = topic.queue.push(listener) - 1;

	    return {
		  remove: function() {
			delete topic.queue[index];
		  }
	    };
      },
      
      publish: function(topic_name, info) {
        var topic = topics[topic_name];
        
        if(_.isUndefined(topic) || topic.queue.length == 0) {
          console.log('Unknown event name: '+topic_name);
          return;
        }

        topic.queue.forEach(function(item) {
      	  item(info || {});
        });
      }
    };
  })()
});
