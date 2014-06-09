/*
TODO: VODS for SC2 (http://sc2casts.com/)
 */

$.ajaxSetup({
    type: "GET",
    dataType: "json",
    success: function() {
        $('.gif').remove();
    },
    error: function(err) {
        $('.gif').attr('class', 'alert alert-danger').html("The service is currently not available. Try again in a few minutes. If problems persist contact the developer: "+
        "<a href='mailto:'"+eet.config.email+"'>"+eet.config.email+"</a>");
        console.error(err);
    }
});


var eet = {
  config: {
    email:"siclotus@gmail.com",
    readmoreUrl: "http://www.readmore.de",
    hltvUrl: {
        upc:"http://www.hltv.org/?m=yes&pageid=305",
        res:"http://www.hltv.org/?m=yes&pageid=296"
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
  init: function() {
      defineDefaults();
      //getEvents()
      //getHLTVMatches();
  }
};

//cache settings
var menuPos = eet.settings.menuPos;
var isSpoilerOn = eet.settings.isSpoilerOn;
var isTooltipOn = eet.settings.isTooltipOn;

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

$('body').on('click', '.menutab', function(e) {
    var lastTab = $(e.currentTarget).attr('id');
    localStorage.lastOpenedTab = lastTab;
    $('#sub_'+lastTab+'_'+localStorage.lastSubTab).tab('show');
});

$('body').on('click', '.submenu', function(e) {
    var lastSubTab = $(e.currentTarget).data('subtab');
    localStorage.lastSubTab = lastSubTab;
});

var defineDefaults = function() {
    // Last Opened Tab
    if (localStorage.lastOpenedTab !== undefined) {
        $('#'+localStorage.lastOpenedTab).tab('show');
    } else {
        $('#nav_csgo').tab('show');
    }

    //Last choosen subtab
    if (localStorage.lastSubTab !== undefined) {
        $('#sub_'+localStorage.lastOpenedTab+'_'+localStorage.lastSubTab).tab('show');
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
    setTooltipMode(isTooltipOn); //not necessary, there are no tooltips at the beginning?
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

var setTooltipMode = function(isTooltip) {
    if (isTooltipOn)
        $('[data-toggle="tooltip"]').tooltip('enable');
    else
        $('[data-toggle="tooltip"]').tooltip('disable');
}

var setResultsSpoiler = function (isSpoilerOn) {
    if (isSpoilerOn) {
        $(".spoiler").addClass("hide");
        $(".winnerTeam").addClass("alert-success");
        $(".loserTeam").addClass("alert-danger");
        $(".result").removeClass("hide");
    }
    else {
        $(".spoiler").removeClass("hide");
        $(".winnerTeam").removeClass("alert-success");
        $(".loserTeam").removeClass("alert-danger");
        $(".result").addClass("hide");
    }
}


var jsonMatches = {matches:[]};

/**
 * show results and remove spoiler
 */
$("body").on("click", ".eetrow .spoilerAlert", function () {
    event.preventDefault();
    $(this.firstChild).addClass("hide"); //remove spoiler
    $(this.lastChild).removeClass("hide"); //show results
});

function buildHTML(i, match) {
    var htmlListObject = '<tr id="'+i+'" class="eetrow ';

    if (match.time != "") {
        htmlListObject+='eventSoon" href="#">'+ // rel="tooltip" data-original-title="
            '<td>'+match.time+'</td></td>';
    }
    else if (match.live != "") {
        htmlListObject+='eventLive" href="#">'+
            '<td><strong>'+ match.live+'</strong></td>';
    }

   else if (match.result != "") {
        htmlListObject+='eventDone"><td><span class="spoilerAlert"><a class="spoiler" href="#">Score</a><span class="result hide">'+match.result+'</span></span></td>';
        //<span class='spoilerAlert'><a href='#' onclick='showSpoiler("+i+")'>Score</a></span><span class='result hide'>"+match.result+"</span>
    }

    htmlListObject+='<td>'+match.t1+'</td><td>vs.</td><td>'+match.t2+'</td><td><a id="test'+i+'" href="javascript:onclick(test('+i+'))" ><span class="reminder glyphicon glyphicon-bell"></span></a></tr>';

    return htmlListObject;
}

/**
 * TODO:badgeNumbers
 * TODO:tooltip
 * TODO:gameResults-tab
 * TODO:notifications
 *
 */
var displayUpcMatchesFromHLTV = function() {
    var html = "";
    $.each(eet.matches.hltv.upc, function(i, match) {
        html += '<tr data-toggle="tooltip" title="'+match.coverage+'<br>'+match.map+'" id="'+match.gameType+'_upc_'+i+'" class="eetrow ';
        if(match.isLive) {
            html += 'eventLive"><td class="live" data-container="body"><strong>Live</strong></td>';
        }
        else {
            html += 'eventSoon">'+
                '<td>'+match.timeFromNow+'</td><td><a href="#"><span class="reminder glyphicon glyphicon-bell"></span></a></td>';
        }
        html += '<td><img src="'+match.team1flag+'" />'+trimAfter(match.team1name,13)+'</td><td>vs.</td>'+
            '<td><img src="'+match.team2flag+'" />'+trimAfter(match.team2name,13)+'</td>'+
            '</tr>'; /*TODO:try after time with fix td size*/
    });

    if (!html) {
        html = '<tr class="eetrow centerText"><td><span class="glyphicon glyphicon-warning-sign left">'+
            '</span> no upcoming matches<span class="glyphicon glyphicon-warning-sign right"></span></td></tr>';
    }

    $('#tbody_csgo_upcMatches').html(html);
};

var displayResultMatchesFromHLTV = function() {
    var html = "";
    $.each(eet.matches.hltv.res, function(i, match) {
        html += '<tr data-toggle="tooltip" title="'+match.date+'<br>'+match.coverage+'<br>'+match.map+'" id="'+match.gameType+'_res_'+i+'" class="eetrow eventDone">';
        html += '<td><span class="spoilerAlert"><a class="spoiler" href="#">Score</a><span class="result hide">'+match.result+'</span></span></td>';
        html += '<td><img src="'+match.team1flag+'" />'+ trimAfter(match.team1name,13)+'</td><td>vs.</td>'+
            '<td><img src="'+match.team2flag+'" />'+trimAfter(match.team2name,13)+'</td>'+
            //'<td data-container="body" data-toggle="popover" data-content="<a class=myHref href='+match.url+'>HLTV result page</a>"><span class="glyphicon glyphicon-eye-open"></span> </td></tr>';
            '<td><a class=myHref href='+match.url+'><span class="iconHltv"></span></a></td></tr>';
    });
    $('#tbody_csgo_results').html(html);
};

function addJsonResultsToListview() {
    var htmlListObject = {
       // csgo:   {upc:"", res:""},
        dota2:  {upc:"", res:""},
        lol:    {upc:"", res:""},
        sc2:    {upc:"", res:""},
        hs:     {upc:"", res:""},
        wc3:    {upc:"", res:""}
    };
    var badgeNumbers = {
        //csgo:   {upc:0, res:0},
        dota2:  {upc:0, res:0},
        lol:    {upc:0, res:0},
        sc2:    {upc:0, res:0},
        hs:     {upc:0, res:0},
        wc3:    {upc:0, res:0}
    };

    $.each(jsonMatches.matches, function(i, match) {
        if (match.result != "") {
            htmlListObject[match.gameType].res = buildHTML(i, match) + htmlListObject[match.gameType].res;
            badgeNumbers[match.gameType].res += 1;
        } else {
            htmlListObject[match.gameType].upc = buildHTML(i, match) + htmlListObject[match.gameType].upc;
            badgeNumbers[match.gameType].upc += 1;
        }
    });

    $.each(badgeNumbers, function(gameType, obj) {
        $.each(obj, function(subType, number) {
            if (number === 0) {
                htmlListObject[gameType][subType] = '<tr class="eetrow centerText"><td><span class="glyphicon glyphicon-warning-sign left">'+
                    '</span> no matches found<span class="glyphicon glyphicon-warning-sign right"></span></td></tr>';
            }
        })

        $('#tbody_'+gameType+'_upcMatches').html(htmlListObject[gameType].upc);
        $('#tbody_'+gameType+'_results').html(htmlListObject[gameType].res);
    });

    $.each(badgeNumbers, function(gameType, resObj) {
        $("#badge_"+gameType+"_results").html(resObj.res === 0 ? "" : resObj.res);
        $("#badge_"+gameType+"_upc").html(resObj.upc === 0 ? "" : resObj.upc);
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
        success: function(data) {
            var gameType, t1, t2, timeOrResult, time, result, live;
            var $foo = $('<form>' + data + '</form>');
            $foo.find('#nav_matchticker').filter(function () {
                var matches = $(this).children('.clear');
                matches.each(function (i) {
                    var tmpMatch = {gameType: "", t1:"", t2:"", time:"", live:"", result:""};
                    if (i != matches.length - 1) { //don't scrape the last element (Datum:gestern - heute - morgen...)
                        var match = $(this).children();
                        var gameType = match.first().attr('class').split(" ")[0]
                        if (gameType == "sc" || gameType == "csgo") // don't collect games of old starcraft
                            return; //continue
                        var t1 = $(match[0]).text();
                        var t2 = $(match[2]).text();
                        var timeOrResult = $(match[3]).text();
                        if (timeOrResult.indexOf("h") >= 0 || timeOrResult.indexOf(".") >= 0 ) {
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
                            live="";
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
        error: function(status) {
        }
    });
}
//http://www.hltv.org/?pageid=305

/* HLTV */
var getHLTVMatches = function() {

    var load_hltv_upc_machtes = $.ajax({
        url: eet.config.hltvUrl.upc,
        type: "get",
        async: true,
        success: function(data) {
            var matchList = [];
            var $foo = $(data);
            $foo.find(".col-xs-12.col-lg-7").filter(function() { //hopefully exist only 1 time?!
                var matches = $(this).find(".col-xs-12.col-md-6");
                $.each(matches, function(i, html) {
                    var match = {}; /*TODO:check if this is really a new object and not a reference to old object */
                    match.gameType = "csgo";
                    match.time = $(this).find(".badge").text();
                    match.timeFromNow = $(this).find(".descriptiontext").text(); //only exist if event is not live
                    match.isLive = $(this).find(".pull-right.label-success").length >= 1 ? true : false; //only exist if match is live
                    match.url = "http://www.hltv.org"+$(this).find("a").attr("href");
                    var gameInfoDiv =$(this).find("a").find("div");
                    match.team1name = $(gameInfoDiv[0]).text();
                    match.team1flag = $(gameInfoDiv[0]).find("img").attr("src");
                    match.team2name = $(gameInfoDiv[1]).text();
                    match.team2flag = $(gameInfoDiv[1]).find("img").attr("src");
                    match.coverage = $(gameInfoDiv[2]).text();
                    match.map =  $(gameInfoDiv[3]).text();
                    /*TODO:MAP and Streams*/
                    matchList.push(match);
                });
                eet.matches.hltv.upc = matchList; //if $foo exist more than one time, this has to be outside of the filter function
                displayUpcMatchesFromHLTV(); //if $foo exist more than one time, this has to be outside of the filter function
            });
        },
        error: function(status) {
            console.error(status);
        }
    });

    var load_hltv_res_matches = $.ajax({
        url: eet.config.hltvUrl.res,
        type: "get",
        async: true,
        success: function(data) {
            var matchList = [];
            var $foo = $(data);
            $foo.find(".row.col-lg-12 > .panel-default").filter(function() {
                var date = $(this).find(".panel-title").text();
                var matches = $(this).find(".col-lg-12.col-md-12.col-xs-12");
                $.each(matches, function(i, html) {
                    var match = {};
                    match.gameType = "csgo";
                    var gameInfoDiv =$(this).find("a").find("div");
                    match.date = date;
                    match.url = "http://www.hltv.org"+$(this).find("a").attr("href");
                    match.team1name = $(gameInfoDiv[0]).justtext();
                    match.team1result = $(gameInfoDiv[0]).find(".label.pull-right").text();
                    match.team1flag = $(gameInfoDiv[0]).find("img").attr("src");
                    match.team2name = $(gameInfoDiv[1]).justtext();
                    match.team2result = $(gameInfoDiv[1]).find(".label.pull-right").text();
                    match.team2flag = $(gameInfoDiv[1]).find("img").attr("src");
                    match.result = match.team1result+":"+match.team2result;
                    match.coverage = $(gameInfoDiv[2]).text();
                    match.map =  $(gameInfoDiv[3]).text();
                    matchList.push(match);
                });
            });
            eet.matches.hltv.res = matchList;
            displayResultMatchesFromHLTV();
        },
        error: function(status) {
            console.error(status);
        }
    });

        $.when(load_hltv_upc_machtes, load_hltv_res_matches).done(function() { // does not work for sub functions?!


            //  showTooltips();

            if (!isTooltipOn) {
                $('[data-toggle="tooltip"]').tooltip('disable');
            }

            $('[data-toggle="popover"]').popover({
                html:"true",
                placement:"left",
                trigger: 'click'
            })

            $('body').on('click', '.myHref', function(e){
                e.stopPropagation();
                var url = $(this).attr('href');
                window.open(url);
            });
        });


}

var test_loadHLTV = $.ajax({
        url: "http://api.lotusarts.de/matches/hltv/v100/api.json",
        success: function (data) {
            var upc_matches, res_matches;
            $.each(data, function(key, value) {
               if (key  === "done") {
                   res_matches += value;
               }
               else {
                   upc_matches += value;
               }
            });

            $('#tbody_csgo_upcMatches').html(upc_matches);
            $('#tbody_csgo_results').html(res_matches);
        }
    });


/*$('.tab-content').on('click', '.eetrow', function(e){
    e.stopPropagation();
    var url = $(this).attr('href');
    window.open(url);
});*/

/*
var load_test = $.ajax("http://api.dotaprj.me/jd/matches/v130/api.json")
    .success(function(data) {
        var recent, finished;
        $.each(data, function(key, val) {
            if (key === "eventDone") {
                finished += val;
            } else if (key === "eventSoon") {
                recent += val;
            } else {
                recent = val + recent;
            }
        });
        $('#tbody_jdUpMatches').html(recent);
        $('#tbody_jdReMatches').html(finished);
    });
*/


document.addEventListener('DOMContentLoaded', function () {
    var cTime = new Date($.now());
    $("#currentTime").html(cTime);
    //var bg = chrome.extension.getBackgroundPage();
    //setInterval(function() {console.log(bg.count);}, 2000);


    eet.init();
    getEvents();
    //getHLTVMatches();

    $.when(test_loadHLTV).done(function() {
      /*  showTooltips(".eetrow");*/

        if (!isTooltipOn) {
            $('[data-toggle="tooltip"]').tooltip('disable');
        }

        $('[data-toggle="popover"]').popover({
            html:"true",
            placement:"left",
            trigger: 'click'
        })

        $('body').on('click', '.myHref', function(e){
            e.stopPropagation();
            var url = $(this).attr('href');
            window.open(url);
        });
    });

    $(".my-popover").attr({"data-toggle":"popover", "data-container":"body", "data-placement":"bottom", "data-content":"My popover content", "data-original-title":"Popover title"});
    $("[data-toggle=popover]").popover();


});


$("body").tooltip({ selector: '[data-toggle="tooltip"]',html:true });

jQuery.fn.justtext = function() {
    return $(this)  .clone()
        .children()
        .remove()
        .end()
        .text();
};

var trimAfter = function(text,n) {
    var short = text;
    if (text.length > n+2)
        short = text.substr(0, n)+"..";
    return short;
};
