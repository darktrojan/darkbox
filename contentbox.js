var ContentBox = {

	tFunc: null,

	onload: function() {
		if (window.removeEventListener) {
			window.removeEventListener('DOMContentLoaded', ContentBox.onload, false);
			window.removeEventListener('load', ContentBox.onload, false);
		} else {
			if (document.readyState != "complete")
				return;
			document.detachEvent('onreadystatechange', ContentBox.onload);
			window.detachEvent('onload', ContentBox.onload);
		}
		ContentBox.init();
	},

	init: function() {
		if ('a' in this)
			return;

		var self = this;
		this.hidden = true;

		if (!/\bdb-hidden\b/.test(document.body.className))
			document.body.className += ' db-hidden';

		this.t = null;
		var transitions = {
			'transition': 'transitionend',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'OTransition': 'oTransitionEnd'
		};
		for (var styleProperty in transitions) {
			if (styleProperty in document.body.style)
				this.t = transitions[styleProperty];
		}

		this.a = document.createElement('div');
		this.a.id = 'darkbox-a';
		this.a.onclick = function() {
			self.hide();
		};
		document.body.appendChild(this.a);

		this.b = document.createElement('div');
		this.b.id = 'darkbox-b';
		this.b.className = 'content-box';
		if (this.t) {
			this.b.addEventListener(this.t, function(event) {
				if (!self.tFunc || event.propertyName != 'opacity')
					return;
				self.tFunc(event);
				self.tFunc = null;
			}, false);
		}
		document.body.appendChild(this.b);
	},

	setContent: function(content, w, h) {
		content.style.margin = '10px';
		while (this.b.lastChild)
			this.b.removeChild(this.b.lastChild);
		this.b.appendChild(content);
		if (!!w && !!h) {
			this.resize(w, h);
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

		return true;
	},

	hide: function() {
		if (typeof this.beforeHide == 'function' && !this.beforeHide()) {
			return;
		}

		if (!/\bdb-hidden\b/.test(document.body.className))
			document.body.className += ' db-hidden';

		this.hidden = true;
		if (typeof this.afterHide == 'function') {
			if (this.t)
				this.tFunc = this.afterHide;
			else
				this.afterHide();
		}
	},

	show: function() {
		if (typeof this.beforeShow == 'function' && !this.beforeShow()) {
			return;
		}

		document.body.className = document.body.className.replace(/\s*db-hidden\b/g, '');

		if (typeof this.afterShow == 'function') {
			if (this.t)
				this.tFunc = this.afterShow;
			else
				this.afterShow();
		}
		this.hidden = false;
	}
};

if (window.addEventListener) {
	window.addEventListener('DOMContentLoaded', ContentBox.onload, false);
	window.addEventListener('load', ContentBox.onload, false);
} else {
	document.attachEvent('onreadystatechange', ContentBox.onload);
	window.attachEvent('onload', ContentBox.onload);
}
