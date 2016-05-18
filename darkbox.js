if (typeof Array.prototype.indexOf != 'function') {
	Array.prototype.indexOf = function(e) {
		for (var i = 0, iCount = this.length; i < iCount; i++)
			if (this[i] == e)
				return i;
		return -1;
	};
}

var DarkBox = {

	list: [],
	descriptions: [],
	desc: null,
	tFunc: null,

	onload: function() {
		window.removeEventListener('DOMContentLoaded', DarkBox.onload, false);
		window.removeEventListener('load', DarkBox.onload, false);
		DarkBox.init();

		if (typeof DarkBox.onready == 'function') {
			DarkBox.onready();
		}
	},

	init: function() {
		if ('a' in this)
			return;

		var self = this;
		this.listIndex = -1;
		this.hidden = true;

		document.body.classList.add('db-hidden');

		this.t = null;
		var transitions = {
			'transition': 'transitionend',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition': 'oTransitionEnd'
		};
		for (var styleProperty in transitions) {
			if (styleProperty in document.body.style) {
				this.t = transitions[styleProperty];
				break;
			}
		}

		this.a = document.createElement('div');
		this.a.id = 'darkbox-a';
		this.a.onclick = function() {
			self.hide();
		};
		document.body.appendChild(this.a);

		this.b = document.createElement('div');
		this.b.id = 'darkbox-b';
		this.b.className = 'db-noimg';
		if (this.t) {
			this.b.addEventListener(this.t, function(event) {
				if (self.tFunc) {
					self.tFunc(event);
					self.tFunc = null;
				}
			}, false);
		}
		document.body.appendChild(this.b);

		var loading = document.createElement('div');
		loading.id = 'darkbox-loading';
		this.b.appendChild(loading);

		this.c = document.createElement('img');
		this.c.id = 'darkbox-c';
		this.c.onload = function() {
			self.b.classList.add('db-noimg');
			var delay = self.resize(this.width + 20, this.height + 20);

			if (delay && self.t) {
				self.tFunc = function() {
					self.b.classList.remove('db-noimg');
					self.b.classList.remove('db-loading');
				};
			} else {
				self.b.classList.remove('db-noimg');
				self.b.classList.remove('db-loading');
			}
			var desc = null;
			if (self.listIndex >= 0) {
				desc = self.descriptions[self.listIndex];
				self.l.style.visibility = '';
				self.r.style.visibility = '';
			} else {
				desc = self.desc;
				self.l.style.visibility = 'hidden';
				self.r.style.visibility = 'hidden';
			}
			if (desc) {
				self.d.innerHTML = desc;
				self.d.classList.remove('db-nodesc');
			} else {
				self.d.innerHTML = '';
				self.d.classList.add('db-nodesc');
			}
			if (self.listIndex >= 0 && self.listIndex < self.list.length - 2) {
				self.preload(self.list[self.listIndex + 2]);
			}
		};
		this.b.appendChild(this.c);

		this.d = document.createElement('div');
		this.d.id = 'darkbox-d';
		this.d.className = 'db-nodesc';
		this.b.appendChild(this.d);

		this.l = document.createElement('a');
		this.l.id = 'darkbox-l';
		this.l.onclick = function() {
			self.previous();
		};
		this.b.appendChild(this.l);

		this.r = document.createElement('a');
		this.r.id = 'darkbox-r';
		this.r.onclick = function() {
			self.next();
		};
		this.b.appendChild(this.r);

		document.documentElement.addEventListener('keydown', function(event) {
			self.onkeydown(event);
		}, false);

		var ss = document.styleSheets;
		for (var i = 0, iCount = ss.length; i < iCount; i++) {
			var m = (/^(.*\/)darkbox\.css(\?|:|$)/.exec(ss[i].href));
			if (m) {
				this.preload(m[1] + 'flash.gif');
				this.preload(m[1] + 'blank.gif');
				this.preload(m[1] + 'db-leftarrow.png');
				this.preload(m[1] + 'db-rightarrow.png');
				this.preload(m[1] + 'db-bg.png');
				break;
			}
		}

		if (this.list.length) {
			this.initPreload();
		}
	},

	resize: function(w, h) {
		if (this.b.style.width == w + 'px' && this.b.style.height == h + 'px') {
			return false;
		}

		this.b.style.marginLeft = '-' + Math.ceil(w / 2) + 'px';
		this.b.style.width = w + 'px';
		this.b.style.marginTop = '-' + Math.ceil(h / 2) + 'px';
		this.b.style.height = h + 'px';

		var third = Math.floor(w / 3);
		this.l.style.width = (third + 40) + 'px';
		this.r.style.width = (w - third + 40) + 'px';

		return true;
	},

	replaceImage: function(src) {
		var self = this;
		this.b.classList.add('db-noimg');
		this.b.classList.add('db-loading');
		this.d.classList.add('db-nodesc');

		if (this.t) {
			this.tFunc = function() {
				self.d.innerHTML = '';
				self.c.src = src;
			};
		} else {
			this.d.innerHTML = ''; // out of order for onload
			this.c.src = src;
		}
	},

	hide: function() {
		document.body.classList.add('db-hidden');

		this.hidden = true;
		this.b.classList.add('db-noimg');
		this.c.src = '';
		if (typeof this.afterHide == 'function') {
			this.afterHide();
		}
	},

	show: function(src, desc) {
		document.body.classList.remove('db-hidden');

		this.b.classList.add('db-noimg');
		this.b.classList.add('db-loading');
		if (typeof src == 'number' && this.list) {
			this.listIndex = src;
			this.c.src = this.list[src];
		} else if (typeof src == 'string') {
			this.listIndex = -1;
			if (typeof desc == 'string') {
				this.desc = desc;
			} else {
				this.desc = null;
			}
			this.c.src = src;
		}
		this.hidden = false;
	},

	previous: function() {
		if (this.list.length > 1) {
			this.listIndex = (this.listIndex + this.list.length - 1) % this.list.length;
			this.replaceImage(this.list[this.listIndex]);
		}
	},

	next: function() {
		if (this.list.length > 1) {
			this.listIndex = ++this.listIndex % this.list.length;
			this.replaceImage(this.list[this.listIndex]);
		}
	},

	onkeydown: function(event) {
		if (this.hidden) {
			return;
		}
		switch (event.keyCode) {
		case 37:
			this.previous();
			break;
		case 39:
			this.next();
			break;
		}
	},

	preloadList: [],

	initPreload: function() {
		for (var i = 0; i < 2 && i < this.list.length; i++) {
			this.preload(this.list[i]);
		}
	},

	preload: function(src) {
		var self = this;
		if (this.preloadList.indexOf(src) >= 0) {
			return;
		}
		setTimeout(function() {
			var img = new Image();
			img.src = src;
			self.preloadList.push(src);
		}, 500);
	}
};

if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', DarkBox.onload, false);
	window.addEventListener('load', DarkBox.onload, false);
}
