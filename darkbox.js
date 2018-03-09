var DarkBox = {
	list: [],
	descriptions: [],
	desc: null,
	ontransitionend: null,

	init: function() {
		if ('a' in this)
			return;

		var self = this;
		this.listIndex = -1;
		this.hidden = true;

		document.body.classList.add('db-hidden');

		this.a = document.createElement('div');
		this.a.id = 'darkbox-a';
		this.a.onclick = function() {
			self.hide();
		};
		document.body.appendChild(this.a);

		this.b = document.createElement('div');
		this.b.id = 'darkbox-b';
		this.b.className = 'db-noimg';
		this.b.addEventListener('transitionend', this);
		document.body.appendChild(this.b);

		var loading = document.createElement('div');
		loading.id = 'darkbox-loading';
		this.b.appendChild(loading);

		this.c = document.createElement('img');
		this.c.id = 'darkbox-c';
		this.c.onload = function() {
			self.b.classList.add('db-noimg');
			var delay = self.resize(this.naturalWidth, this.naturalHeight);

			if (delay) {
				self.ontransitionend = function() {
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

		window.addEventListener('resize', this);
		document.documentElement.addEventListener('keydown', this);
		document.body.addEventListener('touchstart', this);
		document.body.addEventListener('touchend', this);

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
		var maxWidth = window.innerWidth - 50;
		var maxHeight = window.innerHeight - 50;

		var scale = Math.min(maxWidth / (w), maxHeight / (h), 1);
		w = w * scale + 20;
		h = h * scale + 20;

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

		this.ontransitionend = function() {
			self.d.innerHTML = '';
			self.c.src = src;
		};
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
		case 27: // Escape
			this.hide();
			event.preventDefault();
			break;
		case 37: // Left
			this.previous();
			event.preventDefault();
			break;
		case 39: // Right
			this.next();
			event.preventDefault();
			break;
		case 33: // Page Up
		case 34: // Page Down
		case 38: // Up
		case 40: // Down
			event.preventDefault();
			break;
		}
	},

	touchCoords: null,
	handleEvent: function(event) {
		if (this.hidden) {
			return;
		}

		switch (event.type) {
		case 'DOMContentLoaded':
			window.removeEventListener('DOMContentLoaded', this);
			this.init();

			if (typeof this.onready == 'function') {
				this.onready.call();
			}
			break;
		case 'transitionend':
			if (this.ontransitionend) {
				this.ontransitionend.call(event);
				this.ontransitionend = null;
			}
			break;
		case 'resize':
			if (this.c.complete) {
				this.resize(this.c.naturalWidth, this.c.naturalHeight);
			}
			break;
		case 'keydown':
			this.onkeydown(event);
			break;
		case 'touchstart':
			if (event.touches.length == 1) {
				this.touchCoords = {
					x: event.touches[0].clientX,
					y: event.touches[0].clientY
				};
				event.preventDefault();
			}
			break;
		case 'touchend':
			if (this.touchCoords) {
				var deltaX = event.changedTouches[0].clientX - this.touchCoords.x;
				var deltaY = event.changedTouches[0].clientY - this.touchCoords.y;
				if (deltaX < 10 && deltaY < 10) {
					event.target.dispatchEvent(new MouseEvent('click', {
						clientX: event.clientX,
						clientY: event.clientY
					}));
				} else if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= window.innerWidth / 5) {
					if (deltaX > 0) {
						this.previous();
					} else {
						this.next();
					}
				}
				this.touchCoords = null;
				event.preventDefault();
			}
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

window.addEventListener('DOMContentLoaded', DarkBox);
