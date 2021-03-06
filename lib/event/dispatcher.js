/*
 * This file is part of the conga-framework module.
 *
 * (c) Marc Roulias <marc@lampjunkie.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The EventDispatcher allows you to add named events and dispatch
 * all the events associated with a name
 * 
 * @author Marc Roulias <marc@lampjunkie.com>
 */
function EventDispatcher() {
	this.events = {};
}

/**
 * Hash of event names to arrays of attached listeners
 * 
 * {'my.event': [Function,Function,Function]}
 * 
 * 
 * @var {Object}
 */
EventDispatcher.prototype.events = null;

/**
 * Add a new event listener
 * 
 * @param {String} event
 * @param {Object} obj
 * @param {Function} method
 * @param {Number} priority
 */
EventDispatcher.prototype.addListener = function(event, obj, method, priority){
	
	if (typeof this.events[event] === 'undefined'){
		this.events[event] = [];
	}
	
	this.events[event].push({ obj : obj, method : method });
};

/**
 * Dispatch an event
 * 
 * @param {String} name
 * @param {Object} event
 * @param {Function} cb
 */
EventDispatcher.prototype.dispatch = function(name, event, cb){

	var that = this;
	var evt;

	if (typeof this.events[name] === 'undefined' || this.events[name].length === 0){
		cb();
		return;
	}

	var walk = function(index, cb){

		if (typeof that.events[name][index] !== 'undefined'){
			
			evt = that.events[name][index];

			try {
				evt.obj[evt.method].call(evt.obj, event, function(){
					walk(index + 1, cb);
				});
			} catch (err){
				console.log(err.stack || err);
				process.exit();
			}

		} else {
			cb();
		}
	};
	
	walk(0, cb);
};

EventDispatcher.prototype.constructor = EventDispatcher;

module.exports = EventDispatcher;