A web app aimed at making it easy to create a timestamp and attach a name and tags to the timestamp. Think of all the times your wife has asked "What time did you *do x*?" or "When's the last time you *did y*?". Shut up, it's something *I* struggle with anyway.

# TODO
* use touch events
* holo theme? https://github.com/zmyaro/holo-web
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
* search/filter box
	* filter by tag(s)
	* filter by name
	* tapping tag populates filter box with that tag
* make new timestamp box into a type
	* create/load configs
	* persist configs to localstorage
* make localstorage interface safe and more flexible
* local copy of roboto font with more faces
* android-like notifications (when item added, deleted, etc) with undo option
* light and dark theme

BUGS
* frequently timestamps dont animate in in the proper order

# V2 stuff
* optimize render() (request animation frame? synchronize all renders?)
* filter by duration
* filter by timeframe
* select multiple timestamps to sum them up
* duration *between* timestamps
* accurate to seconds instead of min
* configurable colors?
* hashtag routing
* make localstorage methods not sucky
* make Timestamp type store() trigger automatically with Timestamp property updates
* export lists to text doc
* sync across devices somehow? maybe export db?