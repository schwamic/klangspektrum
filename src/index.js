/*
Klangspektrum - by Michael Schwarz
Hochschule Augsburg 2016/2017
 */

'use-strict';
import api from './Api/api';

window.onload = function () {
	let access_token = getQueryString('access_token');
	let refresh_token = getQueryString('refresh_token');
	let user = localStorage.getItem("user_id");
	let domain = document.location.host;
	$('body').css('overflow', 'hidden');

	// Start api-calls
	var client_api = new api(access_token, refresh_token, user, domain);
	client_api.loadMe();
};

// Helper
var getQueryString = function (field, url) {
	var href = url ? url : window.location.href;
	var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
	var string = reg.exec(href);
	return string ? string[1] : null;
};
