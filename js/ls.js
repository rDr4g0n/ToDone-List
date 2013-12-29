window.ls = (function(){

	var fetch = function(id){
		// TODO - make this generic instead of hardcoding
		// ToDone config
		// TODO - accept object key (config or timestamp)
		if(!localStorage.ToDone){
			store('{"configs": [], "timestamps": []}');
		}

		var lsToDone = JSON.parse(localStorage.ToDone);

		if(id){
			return _.findWhere(ls.timestamps, {id: id});
		} else {
			return lsToDone;
		}		
	};

	var store = function(obj){
		if(typeof obj === "string"){
			obj = JSON.parse(obj);
		}
		
		localStorage.ToDone = JSON.stringify(obj);
		
	};

	var ls = {

		// TODO - store various types and individual objects
		// TODO - lock storage when in use
		set: (function(){

			var locked = false;

			return function(obj){
				var ls = fetch();
				var idIndex = _.indexOf(ls.timestamps, _.findWhere(ls.timestamps, {id: obj.id}));

				if(~idIndex){
					ls.timestamps.splice(idIndex, 1, obj);
				} else {
					ls.timestamps.unshift(obj);
				}

				store(ls);
			};

		})(),

		// TODO - specify type and id, or get all
		get: function(id){
			return fetch(id);
		},

		remove: function(id){
			var ls = fetch();
			var idIndex = _.indexOf(ls.timestamps, _.findWhere(ls.timestamps, {id: id}));
			if(~idIndex){
				ls.timestamps.splice(idIndex, 1);
				store(ls);
			}
		},

		asplode: function(){
			store('{"configs": [], "timestamps": []}');
		}

	};

	return ls;

})();