// mixin that adds on, off, and emit methods to object. usage:
// eventEmitter.call(myObj);
// this will extend eventEmitter's stuff onto `myObj`.
window.eventEmitter = function(){

	var events = {};

	// add listener for `event` that executes `callback`
	var on = function(event, callback){
		// give the callback a uuid that can later be used for removing events
		callback.uuid = callback.uuid || uuid();

		// if this event hasn't been registered yet, make a new array for it
		if(!(event in events)){
			events[event] = [];
		}

		// add this callback to the list for this event
		events[event].push(callback);
	};

	// lookup the `callback` by id and remove from `event`'s queue
	var off = function(event, callback){
		var callbackId = callback.uuid;

		if(callbackId){
			for(var i in events[event]){
				if(events[event][i].uuid === callbackId){
					events[event].splice(i, 1);
					break;
				}
			}
		}
	};

	// trigger all callbacks for `event`, and pass any supplied args in
	var emit = function(event){
		var args = Array.prototype.slice.call(arguments, 1),
			callbackList = events[event] || [];

		// call each callback with the passed in args
		for(var i in callbackList){
			callbackList[i].apply(this, args);
		}

	};
	
	var EventEmitter = function(){
		this.on = on;
		this.off = off;
		this.emit = emit;
	};

	EventEmitter.call(this);

	return this;
};