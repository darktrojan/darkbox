var ContentBox = {

	tFunc: null,

	init: function() {
		var self = this;
		this.hidden = true;

		$cna(document.body, 'db-hidden');

		this.t = false;
		if ('MozTransition' in document.body.style) {
			this.t = 'transitionend';
		} else if ('WebkitTransition' in document.body.style) {
			this.t = 'webkitTransitionEnd';
		} else if ('OTransition' in document.body.style) {
			this.t = 'oTransitionEnd';
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
				var computed = getComputedStyle(this, null).getPropertyValue(event.propertyName);
				if (self.tFunc && event.propertyName == 'opacity' && computed == 1) {
					self.tFunc(event);
					self.tFunc = null;
				}
			}, false);
		}
		document.body.appendChild(this.b);
	},

	setContent: function(content, w, h) {
		content.style.margin = '10px';
		$c(this.b);
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
		$cna(document.body, 'db-hidden');
		this.hidden = true;
		if (typeof this.afterHide == 'function') {
			this.afterHide();
		}
	},

	show: function() {
		$cnr(document.body, 'db-hidden');
		if (typeof this.afterShow == 'function') {
			if (this.t) {
				this.tFunc = this.afterShow;
			} else {
				this.afterShow();
			}
		}
		this.hidden = false;
	}
};

_loadList.push(function() {
	ContentBox.init();
});
