A web app aimed at making it easy to create a timestamp and attach a name and tags to the timestamp. Think of all the times your wife has asked "What time did you *do x*?" or "When's the last time you *did y*?". Shut up, it's something *I* struggle with anyway.

# TODO
* use touch events
* timestamp menu
	* edit name
	* edit timestamp
	* add/remove tags
	* delete
	* change display type
	* auto-cycle display types
* general options menu
	* edit tags
	* clear local storage
	* default tags
	* default name
	* default display
	* auto-cycle display types
	* light or dark theme
* search/filter box
	* filter by tag(s)
	* filter by name
	* tapping tag populates filter box with that tag
* make new timestamp box into a type
	* create/load configs
	* easy access to various configs from new timestamp card
	* persist configs to localstorage
	* make new timestamp card appear on swipe down, or at top of lsit
* android-like notifications (toasts) (when item added, deleted, etc) with undo option
* swipe to delete
* undelete
* icon and color settings per config
* make tag delete `x` bigger
* break out color stuff from other style for easy swapping of light/dark theme
* dark theme - edit name input needs to be styled
* edit name should be less input-y in general

#BUGS

# V2 stuff
* optimize render() (request animation frame? synchronize all renders?)
* filter by duration
* filter by timeframe
* select multiple timestamps to sum them up
* duration *between* timestamps
* accurate to seconds instead of min
* configurable colors?
* hashtag routing
* export lists to text doc
* sync across devices somehow? maybe export db?
* icons for timestamps
* compact view