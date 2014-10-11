var MVML = MVML || {};
_.extend(MVML, {
  hook: {
    list: {},

    on: function(hook_name, callback) {
      if ( _.isUndefined(this.list[hook_name]) ) {
        this.list[hook_name] = { queue: [] };
      }
      var index = this.list[hook_name].queue.push(callback) - 1;

      return {
        remove: function() {
          MVML.hook.list[hook_name].queue.splice(index,1);
		}
	  };
    },

    trigger: function(hook_name, data) {
      if(_.isUndefined(this.list[hook_name]) || this.list[hook_name].queue.length == 0) {
        return;
      }

      this.list[hook_name].queue.forEach(function(callback) {
        callback(data || null);
      });
    }
  }
});
