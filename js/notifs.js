var checkNotifs = function(sess) {
	var perms = window.localStorage.getItem("notifs");
	if (perms == "granted") {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("POST", "https://messenger.stibarc.gq/api/getnotifs.sjs", true);
		xmlHttp.send("sess="+sess);
		xmlHttp.onload = function(e) {
			var tmp = xmlHttp.responseText.split("\n");
			var lastID = window.localStorage.getItem("lastNotifID");
			if (lastID == "" || lastID == undefined || lastID == null) {lastID = -1;}
			if (tmp[0].concat(tmp[1]) != lastID) {
				var text = tmp[3].replace(/<br\/>/g, "\n");
				var user = tmp[2];
				window.localStorage.setItem("lastNotifID", tmp[0].concat(tmp[1]));
				var notification = new Notification(user, {body: text,requireInteraction:true,icon:'icon.png'});
				notification.onclick = function(evt) {
					notification.close();
					window.parent.parent.focus();
					window.location.assign("chat.html?id="+tmp[1]+"#"+tmp[0]);
				}
			}
		}
	}
}



var setupNotifs = function() {
	if (Notification.permission == "default") {
		var perms = window.localStorage.getItem("notifs");
		if (perms == "" || perms == undefined || perms == null) {
			Notification.requestPermission(function (permission) {
				if (permission == "granted") {
					window.localStorage.setItem("notifs", "granted");
					var notification = new Notification("STiBaRC Messenger", {body: "Notifications enabled!",requireInteraction:true,icon:'icon.png'});
					notification.onclick = function(evt) {
						window.parent.parent.focus();
					}
				} else {
					window.localStorage.setItem("notifs", "denied");
				}
			});
		}
	}
}

var doCheck = function() {
	var sess = window.localStorage.getItem("sess");
	checkNotifs(sess);
}

var startNotifs = function() {
	setupNotifs();
	setInterval(doCheck, 500);
}