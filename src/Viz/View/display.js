function displayNode(p, node, all_nodes_normal, showAll) {
	p.push();
	p.noFill();
	if (node.hover_state || node.friendship_state || showAll) {
		p.fill(node.active_color); // active color
	} else {
		if (all_nodes_normal) {
			p.fill(node.normal_color); // passiv color
		} else {
			p.fill(node.passiv_color);
		}
	}
	p.strokeWeight(0);
	node.s = p.map(p.sin(node.xoff3), -1, 1, 1, 1 + (node.size > 5 ? 0.2 : 0.25));
	node.y = node.s;
	node.xoff3 += node.map_v;
	p.ellipse(node.posx, node.posy, node.s * node.size * scale_value, node.s * node.size * scale_value);
	p.pop()
}

function displayActiveNode(p, active_node, h3, h4) {
	if (active_node != null) {
		h3.html(active_node.categorie);
		h3.style('color', active_node.active_color)
		h4.html(active_node.value);
		h4.style('color', active_node.active_color);
	} else {
		h3.html("");
		h4.html("");
	}
}

function updateDOM(h1, h2, state, active_node, p) {
	switch (state) {
		case 'time':
			h1.html("");
			h2.html("");
			$('#infoContainer').css('background', `grey`);
			$('#infoContainer').removeClass('bigIC');
			$('#infoContainer').addClass('smallIC');
			$('.active_color').css('color', `grey`);
			$('#scaleList p:last-child').removeClass('current_sort');
			break;
		case 'sort':
			h1.html("");
			h2.html("");
			$('#infoContainer').css('background', `grey`);
			$('#infoContainer').removeClass('bigIC');
			$('#infoContainer').addClass('smallIC');
			$('.active_color').css('color', `grey`);
			$('#openInfoContainer').css('display', `none`);
			$('#scaleList p:last-child').addClass('current_sort');
			break;
		case 'click_active':
			h1.html(active_node.categorie);
			h1.style('color', active_node.active_color)
			h2.html(active_node.value);
			h2.style('color', active_node.active_color);
			h1.style('padding-right', '50px');
			h1.style('padding-left', '1px');
			h2.style('padding-left', '1px');
			$('#categorie').html(active_node.categorie);
			$('#value').html(active_node.value);
			$('#openInfoContainer').css('background', `${active_node.active_color}`);
			$('#openInfoContainer').css('display', `block`);
			$('.active_color').css('color', `${active_node.active_color}`);
			$('#infoContainer').css('background', `rgb(${p.red(active_node.active_color)},${p.green(active_node.active_color)},${p.blue(active_node.active_color)})`);
			$('#scaleList p:last-child').removeClass('current_sort');

			
			$('#infoContainer').removeClass('smallIC');
			$('#infoContainer').addClass('bigIC');

			break;
		case 'click_passiv':
			h1.html("");
			h2.html("");
			h1.style('padding-right', '0px');
			h1.style('padding-left', '0px');
			h2.style('padding-left', '0px');
			$('#infoContainer').css('background', `grey`);
			$('.active_color').css('color', `grey`);
			$('#openInfoContainer').css('display', `none`);
			$('#scaleList p:last-child').removeClass('current_sort');

			$('#infoContainer').removeClass('bigIC');
			$('#infoContainer').addClass('smallIC');

			break;
		default:
			console.log("error");
	}
}

module.exports = { displayActiveNode: displayActiveNode, displayNode: displayNode, updateDOM: updateDOM }
