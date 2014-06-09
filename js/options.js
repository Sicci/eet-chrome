function resetSettings() {
    chrome.storage.sync.clear(function(){console.log("clear storage")});
}

function initialzeSettings() {
    /**set gameTypes
     */
    chrome.storage.sync.get("settings", function(obj){
        if ($.isEmptyObject(obj)) {
            $("input.gameType:checkbox").each(function(){
                obj[$(this).val()] = true; //default value is true
            });

            $("input.optional:checkbox").each(function(){
                obj[$(this).val()] = false; //default value is false
            });

            for (var prop in obj) {
                console.log(prop + " "+obj[prop]);
                $("input.gameType[value='"+prop+"'").prop("checked", obj[prop]);
            }
            chrome.storage.sync.set({ settings: obj }, function() {});
        }
        else {
            var settingsObj = obj["settings"];
            console.log(settingsObj);
            for (var prop in settingsObj) {
                $("input[value='"+prop+"'").prop("checked", settingsObj[prop]);
            }
        }
    });

    /*if ($("input[value='group']").prop("checked",false)) {
        $("#sortable").sortable( "disable").addClass("disabled");
    }*/

    chrome.storage.sync.get("order", function(obj){
        if ($.isEmptyObject(obj)) {
            var html = '<li data-gametype="csgo" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Counter-Strike: Global Offensive</li>'+
            '<li data-gametype="dota2" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Dota 2</li>'+
             '   <li data-gametype="hs" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Hearthstone</li>'+
           ' <li data-gametype="lol" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>League of Legends</li>'+
            '   <li data-gametype="sc2" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Starcraft II</li>'+
           '<li data-gametype="wc3" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>Warcraft III</li>'
            $("#sortable").append(html);
            chrome.storage.sync.set({order:getCurrentGroupOrder()},function(){});
        }

        else {
            $.each(obj.order, function(index, value) {
                var html = '<li data-gametype="'+value.gameType+'" class="ui-state-default"><span class="ui-icon ui-icon-arrowthick-2-n-s"></span>'+value.label+'</li>'
                $("#sortable").append(html);
            });

            }
    });

}

function showNotification(str) {
    noty({
        layout: 'bottomCenter',
        dismissQueue: true,
        type: 'alert',
        timeout: 2000,
        maxVisible: 3,
        text: str});

}

function getCurrentGroupOrder() {
    var groupList = [];
    $("#sortable>li").each(function() {
        var tmpObj = {}
        var str = $(this).text();
        var gameType =  $(this).data("gametype");
        tmpObj.gameType = gameType;
        tmpObj.label = str;
        groupList.push(tmpObj);
    });
    return groupList;
}

$(document).ready(function() {

    $( "#sortable" ).sortable({
        update: function( event, ui ) { }
    });
    $( "#sortable" ).disableSelection();

    initialzeSettings();

    $("input:checkbox").change(function () {
        var cKey = $(this).val();
        var cValue = $(":checkbox[value="+cKey+"]").prop('checked');

        chrome.storage.sync.get("settings", function(obj){
            var settingsObj = obj["settings"];
            settingsObj[cKey] = cValue;
            chrome.storage.sync.set({ settings: settingsObj }, function() {});
        });

        showNotification('settings '+cKey+' successful changed');
    });

    $( "#sortable" ).on( "sortupdate", function( event, ui ) {

        //console.log(groupList);
        chrome.storage.sync.set({order:getCurrentGroupOrder()},function(){});
        showNotification("group order successful changed");
        //console.log(ui.item.text() + " "+ui.item.data("gametype"));
    } );

   /* chrome.storage.onChanged.addListener(function(changes, namespace) {
        for (key in changes) {
            var storageChange = changes[key];
            console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
        }
    });*/

});
