window.Timestamp = (function(){

	var timestampTemplate = _.template($("#timestampTemplate").html()),
		datetimeTemplates = [
			_.template($("#datetimeView0").html()),
			_.template($("#datetimeView1").html()),
			_.template($("#datetimeView2").html())
		],
		NUM_DISPLAYS = datetimeTemplates.length,
		DISPLAY_CYCLE_FREQ = 1000;

	function DatetimeView(timestamp, template){
		this.template = template;

		this.model = {};
		this.model.timestamp = timestamp;

		this.animate = function(stop, start, cb){
			cssAnimate(this.$el, {
				stop: stop,
				start: start,
				callback: cb,
				cssAnims: {
					"top": 200,
					"bottom": 200
				}
			});
		}.bind(this);

		this.$el = $("<div class='datetime'></div>");
		this.render();

		// this.autorefreshInterval = setInterval(this.render.bind(this), 1000);
	}

	DatetimeView.prototype = {
		constructor: DatetimeView,
		render: function(){
			this.$el.html(this.template(this));
			return this.$el;
		},

		// render timestamp with supplied format
		renderTimestamp: function(f){
			if(f === "fromNow") return this.model.timestamp.fromNow();
			else return this.model.timestamp.format(f);
		},

		show: function(){
			if(this.$el.not(":visible")){
				this.$el.show();
				this.animate(null, "top");
			}
		},

		hide: function(){
			if(this.$el.is(":visible")){
				this.animate("bottom", null, function(){this.$el.hide();}.bind(this));
			}
		}
	};

	function Timestamp(config, animateIn){
		var $datetimes;

		config = config || {};

		this.id = config.id || uuid();

		// TODO - use set function on model
		// 	and debounce updates to store
		this.model = {};
		this.model.timestamp = config.timestamp ? new moment(config.timestamp) : new moment();
		this.model.name = config.name || "New Timestamp";
		this.model.tags = config.tags.slice() || [];

		this.display = (typeof config.display === "number" ? config.display : 1);

		this.editingTags = false;

		this.template = timestampTemplate;
		this.datetimeTemplates = datetimeTemplates;
		this.datetimes = [];

		// swipe to delete
		// TODO - calculate threshold based on screen size?
		this.SWIPE_TO_DELETE_THRESHOLD = 250;
		this.previousSwipeX = 0;
		this.swipeAccumulation = 0;
		this.translateX = 0;

		this.eventMap = {
			"click header": "updateName",
			"click .tagIcon": "editTags",
			"click .removeTag": "removeTag",
			"click .addTag": "addTag",
			"click .datetimes": "showNextDisplay",
			"click .edit": "del",
			"touchstart": "touchstart",
			"touchmove": "touchmove",
			"touchend": "touchend",
			"touchcancel": "touchcancel"
		};
	
		eventEmitter.call(this);

		this.animate = function(stop, start, cb){
			cssAnimate(this.$el, {
				stop: stop,
				start: start,
				callback: cb,
				cssAnims: {
					"enter": 350,
					"remove": 350
				}
			});
		}.bind(this);

		this.$el = $("<div class='timestamp'></div>");
		this.render();
		if(animateIn) this.animate(null, "enter");

		$datetimes = this.$el.find(".datetimes");
		this.datetimeTemplates.forEach(function(template){
			this.datetimes.push(new DatetimeView(this.model.timestamp, template));
			$datetimes.append(_.last(this.datetimes).$el);
		}.bind(this));

		this.$el.find(".datetime").eq(this.display).show();

		this.bindEvents();

		// if config.id isnt set, this is a new timestamp
		// and needs to be stored
		// if(!config.id) this.store();
		this.store();
	}

	Timestamp.prototype = {
		constructor: Timestamp,
		render: function(){
			this.$el.html(this.template(this));
			return this.$el;
		},
		bindEvents: function(){
			var func, selector, eventAction;

			for(var i in this.eventMap){
				selector = i.split(" ");
				eventAction = selector.shift();
				selector = selector.join(" ");
				func = this[this.eventMap[i]] || this.eventMap[i];

				if (typeof (func) == "function") {
					this.$el.on(eventAction, selector, func.bind(this));
				}
			}
		},

		// iterates tags and generates html for them
		renderTags: function(){
			var tagArr = [];
			this.model.tags.forEach(function(tag){
				tagArr.push('<li class="tag" data-name="'+ tag +'"><i class="fa fa-times removeTag"></i>');
				tagArr.push('<a href="#/'+ tag +'">'+ tag +'</a></li>');
			});
			return tagArr.join("");
		},

		// re-renders currently displayed datetime
		rerenderDatetime: function(){
			this.datetimes[this.display].render();
		},

		hideAllDatetimes: function(){
			this.datetimes.forEach(function(datetime){
				datetime.hide();
			});
		},

		showNextDisplay: function(){
			this.display++;
			this.display = this.display % NUM_DISPLAYS;
			this.hideAllDatetimes();
			this.datetimes[this.display].show();
			this.rerenderDatetime();

			this.store();
		},

		// convert name field to an input and focus it
		// so the user can update name
		updateName: function(){

			// if already updating, dont try to update again
			if(this.$el.find("header input").length) return;

			var $input = $("<input type='text' value='"+ this.model.name +"'>");
			this.$el.find("header").empty().append($input);
			$input.focus();
			$input.on("blur change", function(e){
				this.model.name = $input.val() || this.model.name;
				this.$el.find("header").html(this.model.name);
				this.store();
			}.bind(this));

			// TODO - hide menu icon and add checkmark/save icon 
		},

		// make tags editable
		editTags: function(){
			if(!this.editingTags){
				this.editingTags = true;
				this.$el.find(".tags").addClass("editable");
			} else {
				this.editingTags = false;
				this.$el.find(".tags").removeClass("editable");
			}
		},

		// remove tag
		removeTag: function(e){
			var $tag = $(e.currentTarget).closest(".tag"),
				tagName = $tag.attr("data-name"),
				tagIndex = this.model.tags.indexOf(tagName);

			// remove from model
			if(~tagIndex){
				this.model.tags.splice(tagIndex, 1);
			}

			// remove from DOM
			$tag.remove();

			this.store();
		},

		// bring up dialogue where a new tag can be created
		// or selected from a list of tags
		addTag: function(){
			alert("add a tag!");
			this.store();
		},

		getParsable: function(){
			return {
				id: this.id,
				display: this.display,
				model: this.model
			};
		},

		touchstart: function(e){
			this.$el.addClass("noAnim");
		},

		touchend: function(e){
			this.$el.removeClass("noAnim");

			if(this.swipeDel){
				this.del();
			} else {
				this.$el.css({"-webkit-transform": "translateX(0px)", "opacity": 1});
			}

			this.previousSwipeX = null;
			this.translateX = this.swipeAccumulation = 0;
		},
		touchcancel: function(e){
			e.preventDefault();
		},

		touchmove: function(e){
			e.preventDefault();

			if(!this.previousSwipeX) this.previousSwipeX = e.originalEvent.changedTouches[0].clientX;

			var touchX = e.originalEvent.changedTouches[0].clientX,
				diff = this.previousSwipeX - touchX;

			this.previousSwipeX = touchX;
			this.swipeAccumulation -= diff;
			this.translateX -= diff;

			this.$el.css({"-webkit-transform": "translateX("+ this.translateX +"px)", "opacity": this.swipeOpacityEase(this.translateX)});

			if(Math.abs(this.swipeAccumulation) > this.SWIPE_TO_DELETE_THRESHOLD){
				this.swipeDel = true;
			} else {
				this.swipeDel = false;
			}
		},

		// calculates opacity based on how far swiped the
		// element being swiped is
		// TODO - non-linear ease
		// TODO - clamp value
		swipeOpacityEase: function(val){
			return 1 - (Math.abs(val) / this.SWIPE_TO_DELETE_THRESHOLD);
		},

		// store in localstorage anytime model or config changes
		store: function(){
			this.emit("dirty");
		},

		del: function(){
			this.emit("delete", this);
			// TODO - cleaner/complete removal of dom element
			this.$el.off();
			this.animate("remove", null, function(){this.$el.remove();}.bind(this));
		}
	};

	return Timestamp;
})();