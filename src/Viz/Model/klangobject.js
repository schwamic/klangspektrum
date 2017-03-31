'use-strict';
function Klangobject(p, songs, index, w, h, xoff1, xoff2, xoff3, size, value, categorie, mycolor, friends, target_pos) {
	this.songs = songs;
	this.w = w;
	this.h = h;
	this.s = 0;
	this.id = index;
	this.value = value;
	this.categorie = categorie;
	this.friendship_state = false;
	this.size = size;
	this.map_v = p.map(value, 0, 1, 0.15, 0.7);
	this.friends = friends;
	this.osc_status = true;
	this.active_color = p.color(p.red(mycolor), p.green(mycolor), p.blue(mycolor), 150);
	this.passiv_color = p.color(220, 220, 220, 200);
	this.normal_color = p.color(20, 20, 20, 150);
	this.state_move = true;
	this.hover_state = false;
	this.xoff1 = xoff1;
	this.xoff2 = xoff2;
	this.xoff3 = xoff3;
	this.posx = 0;
	this.posy = 0;
	this.old_posy;
	this.old_xoff1;
	this.target_pos = target_pos;
	this.target = (this.h / 11) * target_pos;
	this.active = false;
	this.easing = 0.05;
	this.root = false;

	this.move = function () {
		if (this.state_move && !this.hover_state) {
			this.posx = p.map(p.noise(this.xoff1), 0, 1, 90, this.w);
			this.posy = p.map(p.noise(this.xoff2), 0, 1, 0, this.h);
			this.xoff1 += 0.002;
			this.xoff2 += 0.002;
			this.old_posy = this.posy;
			this.old_xoff1 = this.xoff1;
		}
	};

	this.move_to_active = function () {
		this.active = true;
		if (this.state_move && !this.hover_state) {
			let direction = this.target - this.posy;
			this.posy += direction * this.easing;
			this.posx = p.map(p.noise(this.xoff1), 0, 1, 90, this.w);
			this.xoff1 += 0.002;
		}
	};

	this.move_to_passiv = function () {
		if (this.state_move && !this.hover_state) {
			let direction = this.old_posy - this.posy;
			this.posy += direction * this.easing;
			if (Math.abs(direction) < 1) {
				this.active = false;
			}
			this.posx = p.map(p.noise(this.xoff1), 0, 1, 90, this.w);
			this.xoff1 += 0.002;
		}
	};
};

export { Klangobject as default };
