(function(){

	var _isFinite = Number.isFinite || function(val){
		if (typeof val !== 'number') {
			return false;
		}
		if (val !== val || val === Infinity || val === -Infinity) {
			return false;
		}
		return true;
	};

	function JustTimer(duration){
		Object.defineProperties(this, {
			_duration:    {value: 0, writable: true},
			_currentTime: {value: 0, writable: true},
			_loop:        {value: false, writable: true},
			_paused:      {value: true, writable: true},
			_timerID:     {value: null, writable: true},
			_listeners:   {value: {}, writable: true},
		});
		this.duration = duration;
	}

	Object.defineProperties(JustTimer.prototype, {
		duration: {
			enumerable: true,
			get: function(){
				return this._duration;
			},
			set: function(val){
				val = val - 0;
				if ( !_isFinite(val) ) {
					throw new Error("Failed to set the 'duration' property on 'JustTimer': The provided double value is non-finite.");
				}
				if ( val <= 0 ) {
					throw new Error("Failed to set the 'duration' property on 'JustTimer': The provided double value is over Zero.");
				}
				this._duration = val;

				if ( this.currentTime >= this.duration ) {
					this.currentTime = this.duration;
				}
			},
		},
		currentTime: {
			enumerable: true,
			get: function(){
				return this._currentTime;
			},
			set: function(val){
				val = val - 0;
				if ( !_isFinite(val) ) {
					throw new Error("Failed to set the 'currentTime' property on 'JustTimer': The provided double value is non-finite.");
				}
				if ( val < 0 ) {
					val = 0;
				}
				else if ( val > this.duration ) {
					val = this.duration;
				}
				this._currentTime = val;

				if ( !this.paused ) {
					clearTimeout(this._timerID);
					_moveTime.call(this);
				}
			},
		},
		loop: {
			enumerable: true,
			get: function(){
				return this._loop;
			},
			set: function(val){
				this._loop = !!val;
			}
		},
		paused: {
			enumerable: true,
			get: function(){
				return this._paused;
			}
		},
	});

	function _fireEvent(type){
		if ( this._listeners[type] ) {
			for ( var i = 0; i < this._listeners[type].length; i++ ) {
				this._listeners[type][i].call(this);
			}
		}
	}

	function _moveTime(){
		this._timerID = setTimeout((function(now){

			this._timerID = null;

			var currentTime = this.currentTime + (performance.now() - now) / 1000;

			if ( currentTime < this.duration ) {
				this._currentTime = currentTime;
				_moveTime.call(this);
			}
			else if ( this.loop ) {
				this._currentTime = 0;
				_moveTime.call(this);
			}
			else {
				this._currentTime = this.duration;
				this.pause();
			}

		}).bind(this, performance.now()), 10);
	}

	JustTimer.prototype.play = function(){
		if ( !this.paused ) {
			return;
		}
		this._paused = false;
		if ( this.currentTime === this.duration ) {
			this._currentTime = 0;
		}
		_fireEvent.call(this, 'play');
		_moveTime.call(this);
	};

	JustTimer.prototype.pause = function(){
		if ( this.paused ) {
			return;
		}
		this._paused = true;

		if ( this._timerID ) {
			clearTimeout(this._timerID);
			this._timerID = null;
		}

		_fireEvent.call(this, 'pause');
		if ( this.currentTime === this.duration ) {
			_fireEvent.call(this, 'ended');
		}
	};

	JustTimer.prototype.addEventListener = function(type, listener){
		if ( !this._listeners[type] ) {
			this._listeners[type] = [];
		}
		this._listeners[type].push(listener);
	};

	JustTimer.prototype.removeEventListener = function(type, listener){
		if ( !this._listeners[type] ) {
			return;
		}
		var i = 0;
		while( i < this._listeners[type].length ) {
			if ( listener === this._listeners[type][i] ) {
				this._listeners[type].splice(i,1);
			}
			else {
				i++;
			}
		}
	};

	window.JustTimer = JustTimer;

})();