import Klangobject from './Model/klangobject';
var displayNode = require('./View/display').displayNode;
var displayActiveNode = require('./View/display').displayActiveNode;
var updateDOM = require('./View/display').updateDOM;
var nodeClick = require('./Controller/mouseEvents').nodeClick;
var mouseHover = require('./Controller/mouseEvents').mouseHover;
var createTimelist = require('./Controller/timeEvents').createTimelist;
var scaleListener = require('./Controller/scaleEvents').scaleListener;
var klanginterface = require('./../ITF/interfaceEvents').klanginterface;
var loadingFinished = require('./../ITF/interfaceEvents').loadingFinished;
var p5 = require('p5');

import './../../public/mylib/p5.dom';
import './../../public/mylib/p5.sound';

var sketch = function (p, data) {
	var canvas;
	var w, h;
	var osc;
	var color_nodes;
	var start_pos = null;
	var active_node;
	var master_list;
	var active_list = [];
	var h1, h2, h3, h4;
	var showAll = false;
	var data;

	// controller
	var all_nodes_normal = true;
	var active_view = false;

	// view
	var lately_pos = null;

	p.setup = function () {
		p.frameRate(20); //max framerate 20

		// Init Elements
		create_dom();
		osc = new p5.Oscillator();
		osc.setType('sine');
		osc.amp(1);

		color_nodes = [
			p.color(239, 174, 44),	// yellow
			p.color(40, 132, 197),	// blue
			p.color(227, 44, 78),	// magenta
			p.color(116, 78, 197),	// purple
			p.color(105, 193, 135),	// green
			p.color(252, 102, 18),	// orange
			p.color(70, 206, 196)	// cyan
		];

		master_list = [];
		let master_element;

		for (var m in allKlangobj) {
			var month = allKlangobj[m];
			let index = 0;
			datelist.push(m);
			master_element = [];
			for (var f in month) {
				let target_pos = get_position(f);
				var feature = month[f];
				let c = f;
				for (var k in feature) {
					var songs = feature[k]['songs'];
					let s = Object.keys(feature[k]['songs']).length;
					let v = parseFloat(k);
					let f = feature[k]['friends'];
					let c_node = get_color(c);
					//p, songs, index, w, h, xoff1, xoff2, xoff3, size, value, categorie, mycolor, map_v, scale_v, friends, target_pos
					master_element.push(new Klangobject(p, songs, index++, w, h, p.random(0, 1000000), p.random(0, 1000000), p.random(0, 1000000), s * 1.5, v, c, c_node, f, target_pos));
				}
				target_pos++;
			}
			master_list.push(master_element);
		}

		// Init timelist and scalelist
		createTimelist();
		scaleListener();

		// Init interface
		klanginterface();

		// Show all
		loadingFinished();

		// Feedback
		/*
		console.log('raw data' + allKlangobj);
		console.log('klangobjects' + master_list);
		console.log('circles:' + master_list[t].length);
		*/
	};

	p.draw = function () {
		p.background(255);
		active_list = [];
		
		for (let i = 0; i < master_list[t].length; i++) {
			let status = mouseHover(p, master_list[t][i], i, osc, active_node, active_view, start_pos);
			active_node = status[0];
			start_pos = status[1];
			if (master_list[t][i] == active_node || master_list[t][i].friendship_state == true || showAll) {
				active_list.push(master_list[t][i]);
				master_list[t][i].move_to_active();
			} else {
				if (master_list[t][i].active == true) {
					master_list[t][i].move_to_passiv();
				} else {
					master_list[t][i].move();
				}
				displayNode(p, master_list[t][i], all_nodes_normal, showAll);
			}
		}

		for (let i = 0; i < active_list.length; i++) {
			displayNode(p, active_list[i], all_nodes_normal, showAll);
		}
		displayActiveNode(p, active_node, h3, h4);
	};

	// Init Helper
	function create_dom() {
		w = window.innerWidth;
		h = window.innerHeight;
		canvas = p.createCanvas(w, h);
		canvas.parent('canvasContainer');
		canvas.mousePressed(pressed_handler);

		let time = document.getElementById('timelist');
		time.addEventListener('mouseup', time_handler);

		let sortButton = p.createElement('p', 'sort');
		sortButton.addClass('scaleButton');
		sortButton.addClass('sortButton');
		sortButton.parent('scaleList');
		sortButton.mousePressed(sort_handler);

		h1 = p.createElement('h1', ' ');
		h1.parent('click_cv');
		h2 = p.createElement('h2', ' ');
		h2.parent('click_cv');

		h3 = p.createElement('h1', ' ');
		h3.parent('hover_cv');
		h4 = p.createElement('h2', ' ');
		h4.parent('hover_cv');
	};

	// Helper
	function get_color(categorie) {
		let color;
		switch (categorie) {
			case 'acousticness':
				color = color_nodes[0];
				break;
			case 'liveness':
				color = color_nodes[1];
				break;
			case 'danceability':
				color = color_nodes[2];
				break;
			case 'energy':
				color = color_nodes[3];
				break;
			case 'mood':
				color = color_nodes[4];
				break;
			case 'instrumentalness':
				color = color_nodes[5];
				break;
			case 'speechiness':
				color = color_nodes[6];
				break;
			default:
				color = p.color(255, 0, 0);
				console.log('error');
		}
		return color;
	}

	function get_position(categorie) {
		let target_pos;
		let gap = 2.4;	// responsive -> if w > 2000 -> gap = 4 ....
		switch (categorie) {
			case 'acousticness':
				target_pos = 0 + gap;
				break;
			case 'liveness':
				target_pos = 1 + gap;
				break;
			case 'danceability':
				target_pos = 2 + gap;
				break;
			case 'energy':
				target_pos = 3 + gap;
				break;
			case 'mood':
				target_pos = 4 + gap;
				break;
			case 'instrumentalness':
				target_pos = 5 + gap;
				break;
			case 'speechiness':
				target_pos = 6 + gap;
				break;
			default:
				color = p.color(255, 0, 0);
				console.log('error');
		}
		return target_pos;
	}

	// mouse events +++++++++++++++++++++
	function pressed_handler() {
		let states = nodeClick(p, h1, h2, active_node, all_nodes_normal, active_view, master_list, t);
		active_view = states[0];
		all_nodes_normal = states[1];
		active_node_outside = active_node;
		showAll = false;
	}

	function time_handler() {
		for (let ele of master_list[t]) {
			ele.friendship_state = false;
			ele.root = false;
			all_nodes_normal = true;
		};
		active_view = false;
		showAll = false;
		updateDOM(h1, h2, 'time');
	}

	function sort_handler() {
		showAll = true;
		active_view = false;
		updateDOM(h1, h2, 'sort');
	}

	// scaleEvents 
	// timeEvents
};

export { sketch as default };
