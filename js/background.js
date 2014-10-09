/*var count = 0;


*/
/*function retrieveStreams() {
	count++;
}*/

function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    //chrome.tabs.create({url: "options.html"});
}

function checkNotifications() {
    chrome.storage.sync.get("matches", function (obj) {
        if (!$.isEmptyObject(obj)){
            console.log("---notifications---");
            $.each(obj["matches"], function (i, match) {
              console.log(match.timestamp);
            });
            console.log("---end---");
        }
        else {
            console.log("---no notifications yet---")
        }
    });
}



function startService() {
    console.log("setting interval for updates!");
    setInterval(checkNotifications, 3000);
}

chrome.runtime.onInstalled.addListener(function(details) {
    console.log("installed!");
    chrome.storage.sync.clear(function(){}); /*todo:only for testing purposes*/
    //startService();
    //console.log(moment().format());
    /*chrome.notifications.create("myID", opt, function() {
        console.log("show noti");
    });*/


});

var opt = {
    type: "basic",
    title: "",
    message: "Game is live!",
    iconUrl: "/icon1.png"
}

function removeNotification(match) {
    chrome.storage.sync.get("matches", function (obj) {
        var matches = obj["matches"];
        matches = jQuery.grep(matches, function(_match) {return match.id != _match.id;}); //remove element with specific match.id
        chrome.storage.sync.set({ matches: matches }, function() {});
    });
}


/*todo: give unique id so you can get a notification again if the game was delayed*/
function setNotification(match) {
    var now = Math.round(+new Date()/1000);
    var diff = (parseInt(match["timestamp"]) - now)*1000;

    if (diff >= 0) {
        console.log(diff);
        opt.iconUrl = "/images/notifications/"+match.gameType+".png";
        opt.message = match.team1name+ " vs. "+match.team2name;
        setTimeout(function() {
            chrome.notifications.create(match.id.toString(), opt, function() {console.log("show notification for game "+match.team1name+ " vs. "+match.team2name);});
        }, diff);
        //todo: return id of notification
    } else {
        removeNotification(match);
    }
}

function addNotification(notifyObj) {
    opt.iconUrl = "/images/"+notifyObj.gameType+".png";
    opt.title = notifyObj.team1name+" vs. "+notifyObj.team2name;
    chrome.notifications.create(notifyObj.id.toString(), opt, function() {});
 /*   chrome.storage.sync.get("matches", function (obj) {
        var matches = [];
        if (!$.isEmptyObject(obj)) { //if there are any notifications left
            var matchAlreadyExists = false;
            matches = obj["matches"];
            $.each(matches, function (i, match) {
                if (notifyObj["id"] == match["id"])
                    matchAlreadyExists = true;
            });
            if (!matchAlreadyExists) {
                matches.push(notifyObj);
                setNotification(notifyObj);
            }
        }
        else {
            matches.push(notifyObj);
            setNotification(notifyObj);
        }
        chrome.storage.sync.set({ matches: matches }, function () {
        });
    });*/
}


//event handler if user wants a notification for an upcoming game
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    // if (request.greeting == "hello"){
        if (request.showNotification === true) {
                //addNotification(request.match);
            setNotification(request.match)
            sendResponse({success: "show notification"}); //todo: send notification id as response
        }
        else { //todo if request.deleteNotification
            sendResponse({success: "no notification shown"});
        }
    //sendResponse({farewell: "goodbye"});
});

/*
todo: set timeouts for older notifications again
 */
chrome.runtime.onStartup.addListener(function() {
    console.log("start");
    //setInterval(checkNotifications(), 3000);
    /*chrome.notifications.create("myID", opt2, function() {
        console.log("show noti");
    });*/
});