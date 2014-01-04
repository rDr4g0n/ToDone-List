A web app aimed at making it easy to create a timestamp and attach a name and tags to the timestamp. Think of all the times your wife has asked "What time did you *do x*?" or "When's the last time you *did y*?". Shut up, it's something *I* struggle with anyway.

# TODO
* timestamp menu
	* edit name
	* edit timestamp
	* add/remove tags
	* delete
* search/filter box
	* filter by tag(s)
	* filter by name
	* tapping tag populates filter box with that tag
* new timestamp
	* create presets
	* store/retrieve presets from localstorage
* break out color stuff from other style for easy swapping of light/dark theme
* archive panel
* make OS back button work?

#BUGS
* new timestamp card position can be off by scrollbar width in some cases
* remove tag x doesnt fill vertical space of tag

# V2 stuff
* filter by duration
* filter by timeframe
* select multiple timestamps to sum them up
* duration *between* timestamps
* accurate to seconds instead of min
* hashtag routing (for web ver i guess)
* sync across devices somehow? maybe export db? manual export as text file?
* icons and colors for timestamps
* compact view (similar to gmail mobile app list view)
* cancel icon when editing name?