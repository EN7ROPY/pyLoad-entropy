var tabs = require("sdk/tabs");
var buttons = require('sdk/ui/button/action');
var Request = require("sdk/request").Request;
var text_entry = require("sdk/panel").Panel({
  contentURL: "./name-entry.html",
  contentScriptFile: "./get-name.js"
});


var button = buttons.ActionButton({
	id: "load",
	label : "Send link to pyLoad",
	icon: {
		"16": "./entropy-16.png",
		"32": "./entropy-32.png",
		"64": "./entropy-64.png"
	},
	onClick: giveName
});

var button2 = buttons.ActionButton({
	id: "gotopyLoad",
	label : "Go to pyLoad",
	icon: {
		"16": "./pyload-16.png",
		"32": "./pyload-32.png",
		"64": "./pyload-64.png"
	},
	onClick: visitServer
});


Request({
  url: "http://" + require("sdk/simple-prefs").prefs.pyLoadServer + ":" + require("sdk/simple-prefs").prefs.pyLoadPort + "/login",
  content: { do: 'login', username: require("sdk/simple-prefs").prefs.pyLoadUser, password: require("sdk/simple-prefs").prefs.pyLoadPassword }/*,
  onComplete: function (response) {
    console.log( response.text );
  }*/
}).post();


//Give a name for the download
function giveName(state) {
  text_entry.show();
}

text_entry.on("show", function() {
  text_entry.port.emit("show");
});

text_entry.port.on("text-entered", function (text) {
  pyLoadPost(text);
  text_entry.hide();
});

//Send URL as POST Request to pyLoadServer
function pyLoadPost(name) {

text_entry.show();

//console.log("Send POST: " + name);

Request({
  url: "http://" + require("sdk/simple-prefs").prefs.pyLoadServer + ":" + require("sdk/simple-prefs").prefs.pyLoadPort + "/json/add_package",
  content: { add_name: name, add_links: tabs.activeTab.url, add_dest: require("sdk/simple-prefs").prefs.toqueue }/*,
  onComplete: function (response) {
    console.log( response.text );
  }*/
}).post();
}


//Open webinterface in a new tab
function visitServer(state) {
	tabs.open("http://" + require("sdk/simple-prefs").prefs.pyLoadServer + ":" + require("sdk/simple-prefs").prefs.pyLoadPort);
}

