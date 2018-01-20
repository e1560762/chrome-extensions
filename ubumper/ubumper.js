var host_to_jump = {
	"wikipedia": "0wikipedia",
	"imgur" : "imgurp",
};
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		var new_url = "";
		var current_url = details.url;
		for (var host in host_to_jump) {
			if(current_url.match(host))
				new_url = current_url.replace(host, host_to_jump[host]);
		}
		return {redirectUrl: new_url}
	},
	{
		urls: [
			"*://imgur.com/*",
			"*://*.imgur.com/*",
			"*://*.wikipedia.org/*"
		],
		types: ["main_frame","sub_frame","stylesheet","script","image","object","xmlhttprequest","other"]
	},
	["blocking"]
);