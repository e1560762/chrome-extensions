var host_to_jump = {
	"wikipedia": "0wikipedia",
	"imgur" : "imgurp",
};
chrome.webRequest.onBeforeRequest.addListener(
	function(details) {
		var new_url = "";
		for (var host in host_to_jump) {
			new_url = details.url.replace(host, host_to_jump[host]);
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