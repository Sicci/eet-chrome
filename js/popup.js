/*
 TODO: VODS for SC2 (http://sc2casts.com/)
 */

$.ajaxSetup({
    type: "GET",
    dataType: "json",
    success: function () {
        $('.gif').remove();
    },
    error: function (err) {
        $('.gif').attr('class', 'alert alert-danger').html("The service is currently not available. Try again in a few minutes. If problems persist contact the developer: " +
            "<a href='mailto:'" + eet.config.email + "'>" + eet.config.email + "</a>");
        console.error(err);
    }
});


var eet = {
    config: {
        email: "siclotus@gmail.com",
        readmoreUrl: "http://www.readmore.de",
        hltvUrl: {
            upc: "http://www.hltv.org/?m=yes&pageid=305",
            res: "http://www.hltv.org/?m=yes&pageid=296"
        }
    },
    settings: {
        isSpoilerOn: localStorage.isSpoilerOn === "true",
        isTooltipOn: localStorage.isTooltipOn === "true",
        menuPos: localStorage.menuPos === "left" ? "left" : "top"
    },
    matches: {
        hltv: {
            upc: [],
            res: []
        },
        readmore: []
    },
    templates: {
        no_matches: "<tr class='eetrow centerText'><td><span class='glyphicon glyphicon-warning-sign left'></span> no matches found<span class='glyphicon glyphicon-warning-sign right'></span></td></tr>",
        csgo_live: "<tr data-html='true' data-toggle='tooltip' title='#{coverage}<br>#{map}' id='#{gameType}_upc_#{id}' class='eetrow eventLive'><td class='live' data-container='body'><strong>Live</strong></td><td></td><td><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td><img class='flag' src='#{team2flag}' />#{team2name}</td></tr>",
        csgo_soon: "<tr data-html='true' data-toggle='tooltip' title='#{coverage}<br>#{map}' id='#{gameType}_upc_#{id}' class='eetrow eventSoon'><td class='fromNow'>#{timeFromNow}</td><td><a href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td><img class='flag' src='#{team2flag}' />#{team2name}</td></tr>",
        csgo_done: "<tr data-html='true' data-toggle='tooltip' title='#{date}<br>#{coverage}<br>#{map}' id='#{gameType}_res_#{id}' class='eetrow eventDone'><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result}: #{team2result}</span></span></td><td class='team1'><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td class='team2'><img class='flag' src='#{team2flag}' />#{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconHltv'></span></a></td></tr>",
        csgo_vods_esltv: "<tr data-html='true' data-toggle='tooltip' title='#{coverage}' id='#{gameType}_vods_#{organisation}_#{id}' class='eetrow vod' ><td class='airtime'>#{airtime}</td><td class='vod_title'>#{title}</td><td class='vod_length'>#{videolength}</td><td><a class='myHref' href='#{videourl}'><span class='iconEsltv'></span></a></td></tr>"
    },
    init: function () {
        defineDefaults();
        //getEvents()
        //getHLTVMatches();
    }
};

//cache settings
var menuPos = eet.settings.menuPos;
var isSpoilerOn = eet.settings.isSpoilerOn;
var isTooltipOn = eet.settings.isTooltipOn;

//helper variables
var csgo_winner = [];

/*var setMenuPosition = function(menuPos) {
 var $tab = $('.tabbable');
 if (menuPos === "top") {
 $tab.removeClass("tabs-left");
 $('.ph-tableft').removeClass("sub-tabs-left");
 $tab.addClass("tabs-top");
 $('.ph-tabstop').addClass("sub-tabs-top");
 } else {
 $tab.removeClass("tabs-top");
 $('.ph-tabstop').removeClass("sub-tabs-top");
 $tab.addClass("tabs-left");
 $('.ph-tableft').addClass("sub-tabs-left");
 }
 };*/
/*$('.menu-position').click(function(){
 menuPos = $(this).data('position');
 localStorage.menuPos = menuPos;
 setMenuPosition(menuPos);
 });*/

$('body').on('click', '.menutab', function (e) {
    var lastTab = $(e.currentTarget).attr('id');
    localStorage.lastOpenedTab = lastTab;
    $('#sub_' + lastTab + '_' + localStorage.lastSubTab).tab('show');
});

$('body').on('click', '.submenu', function (e) {
    var lastSubTab = $(e.currentTarget).data('subtab');
    localStorage.lastSubTab = lastSubTab;
});

var defineDefaults = function () {
    // Last Opened Tab
    if (localStorage.lastOpenedTab !== undefined) {
        $('#' + localStorage.lastOpenedTab).tab('show');
    } else {
        $('#nav_csgo').tab('show');
    }

    //Last choosen subtab
    if (localStorage.lastSubTab !== undefined) {
        $('#sub_' + localStorage.lastOpenedTab + '_' + localStorage.lastSubTab).tab('show');
    }

    // Spoiler
    if (isSpoilerOn) {
        $('#spoilerLabelTrue').addClass("active");
    } else {
        $('#spoilerLabelFalse').addClass("active");
    }

    //Tooltip
    if (isTooltipOn) {
        $('#tooltipLabelTrue').addClass("active");
    } else {
        $('#tooltipLabelFalse').addClass("active");
    }
    //setTooltipMode(isTooltipOn); //not necessary, there are no tooltips at the beginning?
}

$(document).on('change', 'input:radio[class^="spoilersettings"]', function (event) {
    isSpoilerOn = $(this).data('isspoiler');
    localStorage.isSpoilerOn = isSpoilerOn;
    setResultsSpoiler(isSpoilerOn);
});

$(document).on('change', 'input:radio[class^="tooltipsettings"]', function (event) {
    isTooltipOn = $(this).data('tooltip');
    localStorage.isTooltipOn = isTooltipOn;
    setTooltipMode(isTooltipOn);
});

var setTooltipMode = function (isTooltip) {
    if (isTooltipOn)
        $('[data-toggle="tooltip"]').tooltip('enable');
    else
        $('[data-toggle="tooltip"]').tooltip('disable');
}

var setResultsSpoiler = function (isSpoilerOn) {
    if (isSpoilerOn) {
        $(".spoiler").addClass("hide");
        //$(".winnerTeam").addClass("alert-success");
        $(".winnerTeam").addClass("winner");
        //$(".loserTeam").addClass("alert-danger");
        $(".result").removeClass("hide");
    }
    else {
        $(".spoiler").removeClass("hide");
        $(".winnerTeam").removeClass("winner");
        //$(".winnerTeam").removeClass("alert-success");
        //$(".loserTeam").removeClass("alert-danger");
        $(".result").addClass("hide");
    }
}


var jsonMatches = {matches: []};

/**
 * show results and remove spoiler
 */
$("body").on("click", ".eetrow .spoilerAlert", function () {
    event.preventDefault();
    $(this.firstChild).addClass("hide"); //remove spoiler
    $(this.lastChild).removeClass("hide"); //show results
});

function buildHTML(i, match) {
    var htmlListObject = '<tr id="' + i + '" class="eetrow ';

    if (match.time != "") {
        htmlListObject += 'eventSoon" href="#">' +
            '<td>' + match.time + '</td></td>';
    }
    else if (match.live != "") {
        htmlListObject += 'eventLive" href="#">' +
            '<td><strong>' + match.live + '</strong></td>';
    }

    else if (match.result != "") {
        htmlListObject += 'eventDone"><td><span class="spoilerAlert"><a class="spoiler" href="#">Score</a><span class="result hide">' + match.result + '</span></span></td>';
        //<span class='spoilerAlert'><a href='#' onclick='showSpoiler("+i+")'>Score</a></span><span class='result hide'>"+match.result+"</span>
    }

    htmlListObject += '<td>' + match.t1 + '</td><td>vs.</td><td>' + match.t2 + '</td><td><a id="test' + i + '" href="javascript:onclick(test(' + i + '))" ><span class="reminder glyphicon glyphicon-bell"></span></a></tr>';

    return htmlListObject;
}

function addJsonResultsToListview() {
    var htmlListObject = {
        // csgo:   {upc:"", res:""},
        dota2: {upc: "", res: ""},
        lol: {upc: "", res: ""},
        sc2: {upc: "", res: ""},
        hs: {upc: "", res: ""},
        wc3: {upc: "", res: ""}
    };
    var badgeNumbers = {
        //csgo:   {upc:0, res:0},
        dota2: {upc: 0, res: 0},
        lol: {upc: 0, res: 0},
        sc2: {upc: 0, res: 0},
        hs: {upc: 0, res: 0},
        wc3: {upc: 0, res: 0}
    };

    $.each(jsonMatches.matches, function (i, match) {
        if (match.result != "") {
            htmlListObject[match.gameType].res = buildHTML(i, match) + htmlListObject[match.gameType].res;
            badgeNumbers[match.gameType].res += 1;
        } else {
            htmlListObject[match.gameType].upc = buildHTML(i, match) + htmlListObject[match.gameType].upc;
            badgeNumbers[match.gameType].upc += 1;
        }
    });

    $.each(badgeNumbers, function (gameType, obj) {
        $.each(obj, function (subType, number) {
            if (number === 0) {
                htmlListObject[gameType][subType] = '<tr class="eetrow centerText"><td><span class="glyphicon glyphicon-warning-sign left">' +
                    '</span> no matches found<span class="glyphicon glyphicon-warning-sign right"></span></td></tr>';
            }
        })

        $('#tbody_' + gameType + '_upcMatches').html(htmlListObject[gameType].upc);
        $('#tbody_' + gameType + '_results').html(htmlListObject[gameType].res);
    });

    $.each(badgeNumbers, function (gameType, resObj) {
        $("#badge_" + gameType + "_results").html(resObj.res === 0 ? "" : resObj.res);
        $("#badge_" + gameType + "_upc").html(resObj.upc === 0 ? "" : resObj.upc);
    });

    setResultsSpoiler(isSpoilerOn);
}

/* readmore  */
function getEvents() {
    $.ajax({
        url: eet.config.readmoreUrl,
        type: "get",
        async: true,
        dataType: "",
        success: function (data) {
            var gameType, t1, t2, timeOrResult, time, result, live;
            var $foo = $('<form>' + data + '</form>');
            $foo.find('#nav_matchticker').filter(function () {
                var matches = $(this).children('.clear');
                matches.each(function (i) {
                    var tmpMatch = {gameType: "", t1: "", t2: "", time: "", live: "", result: ""};
                    if (i != matches.length - 1) { //don't scrape the last element (Datum:gestern - heute - morgen...)
                        var match = $(this).children();
                        var gameType = match.first().attr('class').split(" ")[0]
                        if (gameType == "sc" || gameType == "csgo") // don't collect games of old starcraft
                            return; //continue
                        var t1 = $(match[0]).text();
                        var t2 = $(match[2]).text();
                        var timeOrResult = $(match[3]).text();
                        if (timeOrResult.indexOf("h") >= 0 || timeOrResult.indexOf(".") >= 0) {
                            time = timeOrResult;
                            live = "";
                            result = "";
                        }
                        else if (timeOrResult.indexOf("live") >= 0) {
                            result = "";
                            live = "Live";
                            time = "";
                        }
                        else {
                            result = timeOrResult;
                            time = "";
                            live = "";
                        }
                        tmpMatch.gameType = gameType;
                        tmpMatch.t1 = t1;
                        tmpMatch.t2 = t2;
                        tmpMatch.time = time;
                        tmpMatch.live = live;
                        tmpMatch.result = result;
                        jsonMatches.matches.push(tmpMatch);
                    }
                });
            });
            addJsonResultsToListview();

        },
        error: function (status) {
        }
    });
}

/*todo:if results == null*/
var loadHLTVMatches = $.ajax({
    url: "http://josef.virtual-artz.de/api/matches/hltv/v100/api.json",
    success: function (data) {
        var upc_matches, res_matches, foo;
        csgo_winner = [];
        $.each(data, function (key, match) {
            if (key === "done") {
                $.each(match, function (i, gameInfo) {
                    if (gameInfo["winnerTeam"] !== gameInfo["loserTeam"]) {
                        foo = {id:"csgo_res_"+gameInfo["id"], class:gameInfo["winnerTeam"]};
                        csgo_winner.push(foo);
                    }
                    gameInfo["team1name"] = trimAfter(gameInfo["team1name"],13);
                    res_matches += $.tmpl(eet.templates.csgo_done, gameInfo);
                });
            }
            else {
                $.each(match, function (i, gameInfo) {
                    if (gameInfo["isLive"]) {
                        console.log("game is live");
                        upc_matches += $.tmpl(eet.templates.csgo_live, gameInfo);
                    }
                    else {
                        console.log("game upcoming but not live");
                        console.log(gameInfo);
                        upc_matches += $.tmpl(eet.templates.csgo_soon, gameInfo);
                    }
                });
            }
        });
        $('#tbody_csgo_upcMatches').html(upc_matches);
        $('#tbody_csgo_results').html(res_matches);

        $.each(csgo_winner, function(i, winner){
           $("#"+winner.id+" ."+winner.class).addClass("winnerTeam");
        });
    }
});

var loadCsgoVods = $.ajax({
   url: "http://josef.virtual-artz.de/api/vods/csgo/v100/api.json",
    success: function (data) {
        var esltv;
        $.each(data, function(key, value) {
           if (key == "esltv" && value !== null) {
               $.each(value, function(i, gameInfo) {
                   esltv += $.tmpl(eet.templates.csgo_vods_esltv, gameInfo);
               });

           }
            else {
               esltv = eet.templates.no_matches;
           }
        });
        $('#tbody_csgo_vods').html(esltv);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    var cTime = new Date($.now());
    $("#currentTime").html(cTime);

    eet.init();
    getEvents();

    $.when(loadHLTVMatches, loadCsgoVods).done(function () {
        console.log("loading finished");
        setResultsSpoiler();

        if (!isTooltipOn) {
            $('[data-toggle="tooltip"]').tooltip('disable');
        }

        $('[data-toggle="popover"]').popover({
            html: "true",
            placement: "left",
            trigger: 'click'
        })

        $('body').on('click', '.myHref', function (e) {
            e.stopPropagation();
            var url = $(this).attr('href');
            window.open(url);
        });
    });

    $(".my-popover").attr({"data-toggle": "popover", "data-container": "body", "data-placement": "bottom", "data-content": "My popover content", "data-original-title": "Popover title"});
    $("[data-toggle=popover]").popover();


});


$("body").tooltip({ selector: '[data-toggle="tooltip"]', html: true });


var trimAfter = function (text, n) {
    var short = text;
    if (text.length > n + 2)
        short = text.substr(0, n) + "..";
    return short;
};