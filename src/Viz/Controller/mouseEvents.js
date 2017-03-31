'use-strict';
/** Sort- and pressedEvents */

var updateDOM = require('./../View/display').updateDOM;

function nodeClick(p, h1, h2, active_node, all_nodes_normal, active_view, master_list, t) {
	// check node and friends 
	if (active_node != null) {
		// clear all
		active_view = true;
		for (let ele of master_list[t]) {
			ele.friendship_state = false;
			all_nodes_normal = true;
		}
		// set active friends
		master_list[t][active_node.id].friendship_state = true;
		master_list[t][active_node.id].root = true;
		for (let f of active_node.friends) {
			master_list[t][f.valueID].friendship_state = true;
		}
		all_nodes_normal = false;
		// display
		updateDOM(h1, h2, 'click_active', active_node, p);
	} else {
		// clear all
		active_view = false;
		for (let ele of master_list[t]) {
			ele.friendship_state = false;
			ele.root = false;
			all_nodes_normal = true;
		}
		// display
		updateDOM(h1, h2, 'click_passiv');
	}
	return [active_view, all_nodes_normal];
};

function mouseHover(p, node, index, osc, active_node, active_view, start_pos) {
	// check node
	let node_size = ((node.size / 2) * scale_value) * node.s < 5 ? 5 : ((node.size / 2) * scale_value) * node.s;
	if (p.dist(p.mouseX, p.mouseY, node.posx, node.posy) < node_size && (active_node == node || active_node == null)) {
		switch (active_view) {
			case true:
				if (node.friendship_state) {
					node.hover_state = true;
					start_pos = index;
					active_node = node;

					osc.freq(p.map(node.value, 0, 1, 500, 5000));
					if (node.osc_status) {
						osc.start();
						node.osc_status = false;
					} else {
						osc.stop();
					}
				}
				break;
			case false:
				node.hover_state = true;
				start_pos = index;
				active_node = node;
				osc.freq(p.map(node.value, 0, 1, 500, 5000));
				if (node.osc_status) {
					osc.start();
					node.osc_status = false;
				} else {
					osc.stop();
				}
				break;
		}
	} else {
		if (node == active_node) {
			active_node = null;
			osc.stop();
			node.osc_status = true;
		}
		node.hover_state = false;
	}
	return [active_node, start_pos];
};

module.exports = { nodeClick: nodeClick, mouseHover: mouseHover };
