/*var count = 0;


chrome.runtime.onStartup.addListener(function() {
    console.log("started!");
    startService();
});
*/
/*function retrieveStreams() {
	count++;
}*/

function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "options.html"});
}


/*function startService() {
    console.log("retrieve streams for the first time!");
    
    console.log("setting interval for updates!");
    setInterval(retrieveStreams, 1000);
}*/

chrome.runtime.onInstalled.addListener(function(details) {
    console.log("installed!");
    install_notice();
});