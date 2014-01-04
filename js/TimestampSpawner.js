// creates new timestamps in currently selected thread
// manages presets for new timestamps
window.TimestampSpawner = (function(){

	function TimestampSpawner(timestampThread){
		// TODO - use template and this.render()
		this.template = _.template($("#newTimestampTemplate").html());
		this.$el = $('<div id="newTimestamp" class="newTimestamp">');
		this.render();
		this.center();

		// TODO - list of threads? currently focused thread?
		this.timestampThread = timestampThread;

		this.eventMap = {
			"click .plusIcon": "addTimestamp",
			"click .presetName": "showPresets",
			"change .preset": function(){this.updateCurrPreset(); this.addTimestamp();},
			"click .edit": "presetOptions"
		};

		$(window).on("scroll", this.trackScroll.bind(this));
		$(window).on("resize", this.center.bind(this));

		// used by trackScroll
		this.originalScrollPos = window.scrollY;
		this.previousScrollPos = window.scrollY;
		this.diff = 0;
		this.backAccumlation = 0;
		this.DEADZONE = 100;

		// TODO - load presets from localstorage
		/*this.presets = [
			{
				presetName: "default",
				model: {
					name: "New Timestamp",
					tags: []
				},
				display: 2
			},{
				presetName: "feeding",
				model: {
					name: "Feeding",
					tags: ["milk", "feeding"]
				},
				display: 1
			},{
				presetName: "Took a dump",
				model: {
					name: "made a dookie",
					tags: ["poop", "number 2"]
				},
				display: 2
			}
		];*/

		this.presets = ls.get().presets;
		if(!this.presets.length){
			this.presets.push({
				presetName: "default",
				model: {
					name: "New Timestamp",
					tags: []
				},
				display: 2
			},{
				presetName: "potty",
				model: {
					name: "I went potty",
					tags: ["potty", "number 1"]
				},
				display: 2
			});
			// TODO - store to ls
		}

		this.$el.find(".preset").html(this.generatePresetOptions());
		// TODO - store default preset?
		this.currPreset = this.presets[0];
		// show currently selected preset
		this.updateCurrPreset();

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
			var	timestamp = this.timestampThread.add(this.currPreset);

			// TODO - have timestampThread do the prepend/animate?
			$(".wrapper").prepend(timestamp.$el);
			timestamp.animate(null, "enter");
		},

		generatePresetOptions: function(){
			var opts = [];
			this.presets.forEach(function(preset){
				opts.push("<option value='"+ preset.presetName +"'>"+ preset.presetName +"</option>");
			});
			return opts.join("");
		},

		// TODO - separate html modification from model modification
		updateCurrPreset: function(){
			var val = this.$el.find(".preset").val();
			this.currPreset = _.find(this.presets, function(obj){
				return obj.presetName === val;
			});
			this.$el.find(".presetName").html(this.currPreset.presetName +' <i class="fa fa-angle-down"></i>');

			// TODO - this seems like a hack...
			// this.addTimestamp();
		},

		showPresets: function(){
			this.$el.find(".preset").trigger("click");
		},

		presetOptions: function(){
			popPane($("#presetsPane").html());
		}
	};

	return TimestampSpawner;

})();