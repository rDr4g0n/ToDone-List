// creates new timestamps in currently selected thread
// manages configs for new timestamps
window.TimestampSpawner = (function(){

	function TimestampSpawner(timestampThread){
		// TODO - use template and this.render()
		this.$el = $("#newTimestamp");
		this.center();

		// TODO - list of threads? currently focused thread?
		this.timestampThread = timestampThread;

		this.eventMap = {
			"click .newTimestampIcon": "addTimestamp",
			"change .config": "updateCurrConfig"
		};

		$(window).on("scroll", this.trackScroll.bind(this));
		$(window).on("resize", this.center.bind(this));

		// used by trackScroll
		this.originalScrollPos = window.scrollY;
		this.previousScrollPos = window.scrollY;
		this.diff = 0;
		this.backAccumlation = 0;
		this.DEADZONE = 100;

		// TODO - load configs from localstorage
		this.configs = [
			{
				configName: "default",
				model: {
					name: "New Timestamp",
					tags: []
				},
				display: 2
			},{
				configName: "feeding",
				model: {
					name: "Feeding",
					tags: ["milk", "feeding"]
				},
				display: 1
			},{
				configName: "Took a dump",
				model: {
					name: "made a dookie",
					tags: ["poop", "number 2"]
				},
				display: 2
			}
		];

		this.$el.find(".config").html(this.generateConfigOptions());
		// TODO - store default config?
		this.currConfig = this.configs[0];

		this.bindEvents();
	}

	TimestampSpawner.prototype = {
		constructor: TimestampSpawner,
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

		// TODO - get rid of magic numbers
		center: function(){
			var MAX_WIDTH = 400,
				BODY_PADDING = 20,
				bodyWidth = $("body").outerWidth(),
				newTimestampWidth = bodyWidth - BODY_PADDING;

			newTimestampWidth = newTimestampWidth > MAX_WIDTH ? MAX_WIDTH : newTimestampWidth;

			this.$el.width(newTimestampWidth).css("margin-left", (bodyWidth * 0.5) - (newTimestampWidth * 0.5));
		},

		trackScroll: function(e){

			this.diff = this.previousScrollPos - window.scrollY;
			this.previousScrollPos = window.scrollY;

			// if diff is positive, bring $el into view
			if(this.diff > 0){

				// if were at the top, show regardless
				if(window.scrollY === this.originalScrollPos){
					this.$el.removeClass("out").removeClass("stickied");

				// show only if we've moved backwards enough
				} else if(this.backAccumulation > this.DEADZONE){
					this.$el.removeClass("out").addClass("stickied");
				}

				this.backAccumulation += this.diff;

			// else, hide $el
			} else {
				this.backAccumulation = 0;
				this.$el.addClass("out").removeClass("stickied");
			}
		},

		show: function(){
			// if were at the top, show without sticky
			if(window.scrollY === this.originalScrollPos){
				this.$el.removeClass("out").removeClass("stickied");

			// otherwise, show with sticky
			} else {
				this.$el.removeClass("out").addClass("stickied");
			}
		},

		addTimestamp: function(){
			var	timestamp = this.timestampThread.add(this.currConfig);

			// TODO - have timestampThread do the prepend/animate?
			$(".wrapper").prepend(timestamp.$el);
			timestamp.animate(null, "enter");
		},

		generateConfigOptions: function(){
			var opts = [];
			this.configs.forEach(function(config){
				opts.push("<option value='"+ config.configName +"'>"+ config.configName +"</option>");
			});
			return opts.join("");
		},

		updateCurrConfig: function(e){
			var val = $(e.currentTarget).val();
			this.currConfig = _.find(this.configs, function(obj){
				return obj.configName === val;
			});

			// TODO - this seems like a hack...
			this.addTimestamp();
		}

		// this version doesnt perform well on mobile
		// but is more accurate
		/*
		var scrollMug = (function($el){
			var originalVal = window.scrollY,
				prevVal = originalVal,
				newTimestampHeight = $el.outerHeight(),
				originalTop = parseInt($el.css("top")),
				top = originalTop,
				diff = 0;

			return function(e){

				diff = prevVal - window.scrollY;
				top = top + diff;
				prevVal = window.scrollY;

				// console.log(top, prevVal, originalVal);

				// if completely hidden
				if(top < -newTimestampHeight){
					top = -newTimestampHeight;

				// if back at original position
				}else if(top > originalTop){
					top = originalTop;
				}

				// if stickied and not in original position,
				// add stickied class
				if(prevVal !== originalVal && diff > 0){
					$el.addClass("stickied");
				} else {
					$el.removeClass("stickied");
				}

				window.requestAnimationFrame(function(){
					$el.css("top", top + "px");
				});
			}
		})($("#newTimestamp"));*/
	};

	return TimestampSpawner;

})();