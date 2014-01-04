window.TimestampThread = (function(){

	function TimestampThread(timestamps, $el){
		this.timestamps = [];
		this.$el = $el;

		var MAX_ENTER_ANIMATE = 5;

		// create Timestamp objects
		timestamps.forEach(this.add.bind(this));

		// if no timestamps, create a default one
		if(timestamps.length === 0){
			this.add({
				model: {
					name: "First launch of ToDone",
					tags: ["awesome"]
				},
				display: 2
			});
		}

		// attach to DOM and attach event listeners
		this.timestamps.forEach(function(timestamp, i){
			var max = i >= MAX_ENTER_ANIMATE ? true : false,
				time = 150 * (max ? MAX_ENTER_ANIMATE : i);

			setTimeout(function(){
				this.$el.append(timestamp.$el);
				if(!max) timestamp.animate(null, "enter");
			}.bind(this), time);
		}.bind(this));

		// periodically re-render all timestamps' datetimes
		setInterval(function(){
			_.map(this.timestamps, function(timestamp){
				timestamp.rerenderDatetime();
			});
		}.bind(this), 10000);
	}

	TimestampThread.prototype = {
		constructor: TimestampThread,
		add: function(timestamp){

			if(timestamp.archived) return;

			timestamp.model = timestamp.model || {tags: []};

			var ts = new Timestamp({
				id: timestamp.id,
				display: timestamp.display,
				name: timestamp.model.name,
				tags: timestamp.model.tags,
				timestamp: timestamp.model.timestamp
			});

			ts.on("dirty", function(){
				this.store();
			}.bind(this));

			ts.on("archive", function(timestamp){
				// this actually removes the timestamp from localstorage
				/*var timestampIndex = this.timestamps.indexOf(timestamp);
				if(~timestampIndex){
					this.timestamps.splice(timestampIndex, 1);
					this.store();
				}*/

				// TODO - toast with undo option
				toast("Archived <a href='#'><i class='fa fa-undo'></i>Undo</a>", function(){
					timestamp.unarchive();
					// TODO - reinsert timestamp.$el into DOM
					toast("Undid! Yay!");
				});
				
			}.bind(this));

			this.timestamps.unshift(ts);
			this.store();
			return ts;
		},
		// TODO - debounce!
		store: function(){
			var presets = this.fetch().presets,
				timestamps = [];

			this.timestamps.forEach(function(timestamp){
				timestamps.push(timestamp.getParsable());
			});

			localStorage.ToDone = JSON.stringify({presets: presets, timestamps: timestamps});
		},
		fetch: function(){
			if(!localStorage.ToDone){
				store('{"presets": [], "timestamps": []}');
			}
			return JSON.parse(localStorage.ToDone);
		}
	};

	return TimestampThread;

})();