var ContentBox = {
	ontransitionend: null,

	init: function() {
		if ('a' in this) {
			return;
		}

		var self = this;
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
		this.b.className = 'content-box';
		this.b.addEventListener('transitionend', this);
		document.body.appendChild(this.b);
	},

	setContent: function(content, w, h) {
		content.style.margin = '10px';
		while (this.b.lastChild) {
			this.b.removeChild(this.b.lastChild);
		}
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

		if (!this.b.classList.contains('db-fixed')) {
			this.b.style.marginTop = '-' + Math.ceil(h / 2) + 'px';
			this.b.style.height = h + 'px';
		}

		return true;
	},

	hide: function() {
		if (typeof this.beforeHide == 'function' && !this.beforeHide()) {
			return;
		}

		document.body.classList.add('db-hidden');

		this.hidden = true;
		if (typeof this.afterHide == 'function') {
			this.ontransitionend = this.afterHide;
		}
	},

	show: function() {
		if (typeof this.beforeShow == 'function' && !this.beforeShow()) {
			return;
		}

		document.body.classList.remove('db-hidden');

		if (typeof this.afterShow == 'function') {
			this.ontransitionend = this.afterShow;
		}
		this.hidden = false;
	},

	handleEvent: function(event) {
		switch (event.type) {
		case 'DOMContentLoaded':
			window.removeEventListener('DOMContentLoaded', this);
			this.init();

			if (typeof this.onready == 'function') {
				this.onready.call();
			}
			break;
		case 'transitionend':
			if (this.ontransitionend && event.propertyName == 'opacity') {
				this.ontransitionend.call(event);
				this.ontransitionend = null;
			}
			break;
		}
	}
};

window.addEventListener('DOMContentLoaded', ContentBox);
