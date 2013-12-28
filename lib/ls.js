window.ls = (function(){

	var fetch = function(id){
		// TODO - make this generic instead of hardcoding
		// ToDone config
		// TODO - accept object key (config or timestamp)
		if(!localStorage.ToDone){
			localStorage.ToDone = '{"configs": {}, "timestamps": {}}';
		}

		var lsToDone = JSON.parse(localStorage.ToDone);

		if(id){
			return lsToDone.timestamps[id];
		} else {
			return lsToDone;
		}

		
	};

	var ls = {

		// TODO - store various types and individual objects
		// TODO - lock storage when in use
		set: (function(){

			var locked = false;

			return function(obj){

				var ls = fetch();

				ls.timestamps[obj.id] = obj;

				localStorage.ToDone = JSON.stringify(ls);
			};

		})(),

		// TODO - specify type and id, or get all
		get: function(id){
			return fetch(id);
		},

		remove: function(id){
			var ls = fetch();
			delete ls.timestamps[id];
		},

		asplode: function(){
			localStorage.ToDone = '{"configs": {}, "timestamps": {}}';
		}

	};

	return ls;

})();