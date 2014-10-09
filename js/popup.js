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
        urls: {
            readmore: "http://www.readmore.de",
            dota2: "http://www.gosugamers.net/dota2/gosubet",
            hs: "http://www.gosugamers.net/hearthstone/gosubet",
            sc2: "http://www.gosugamers.net/starcraft2/gosubet",
            lol: "http://www.gosugamers.net/lol/gosubet",
            csgo: {
                upc:"http://www.hltv.org/?m=yes&pageid=305",
                results:"http://www.hltv.org/?m=yes&pageid=296"
            }
        }
    },
    settings: {
        isSpoilerOn: localStorage.isSpoilerOn === "true",
        isTooltipOn: localStorage.isTooltipOn === "true"
       // menuPos: localStorage.menuPos === "left" ? "left" : "top"
    },
    matches: {
        all: {},
        csgo: {}, //save information for notification
        hltv: {
            upc: [],
            res: []
        },
        readmore: []
    },
    templates: {
        no_matches: "<tr class='eetrow centerText'><td><span class='glyphicon glyphicon-warning-sign left'></span> no #{gameType} matches found<span class='glyphicon glyphicon-warning-sign right'></span></td></tr>",
        //csgo_live: "<tr data-html='true' data-toggle='tooltip' title='#{coverage}<br>#{map}' id='#{gameType}_upc_#{id}' class='eetrow eventLive'><td class='live' data-container='body'><strong>Live</strong></td><td></td><td><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td><img class='flag' src='#{team2flag}' />#{team2name}</td></tr>",
        //csgo_soon: "<tr data-html='true' data-toggle='tooltip' title='#{coverage}<br>#{map}' id='#{gameType}_upc_#{id}' class='eetrow eventSoon'><td class='fromNow'>#{timeFromNow}</td><td><a class='notificationHref' data-id='#{id}' href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td><img class='flag' src='#{team2flag}' />#{team2name}</td></tr>",
        //csgo_done: "<tr data-html='true' data-toggle='tooltip' title='#{date}<br>#{coverage}<br>#{map}' id='#{gameType}_res_#{id}' class='eetrow eventDone'><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result}: #{team2result}</span></span></td><td class='team1'><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td class='team2'><img class='flag' src='#{team2flag}' />#{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconHltv'></span></a></td></tr>",
        csgo_vods_esltv: "<tr data-html='true' data-toggle='tooltip' title='#{coverage}' id='#{gameType}_vods_#{organisation}_#{id}' class='eetrow vod' ><td class='airtime'>#{airtime}</td><td class='vod_title'>#{title}</td><td class='vod_length'>#{videolength}</td><td><a class='myHref' href='#{videourl}'><span class='iconEsltv'></span></a></td></tr>",
        csgo: {
            live: "<tr id='#{id}' class='eetrow eventLive #{gameType}'><td class='live'><strong>Live</strong></td><td></td><td><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td><img class='flag' src='#{team2flag}' />#{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconHltv'></span></a></td></tr>",
            soon: "<tr id='#{id}' class='eetrow eventSoon #{gameType}'><td class='fromNow'>#{timeToLive}</td><td><a class='notificationHref' data-id='#{id}' href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td><img class='flag' src='#{team2flag}' />#{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconHltv'></span></a></td></tr>",
            done: "<tr id='#{id}' class='eetrow eventDone #{gameType}'><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result}: #{team2result}</span></span></td><td class='team1'><img class='flag' src='#{team1flag}' />#{team1name}</td><td>vs.</td><td class='team2'><img class='flag' src='#{team2flag}' />#{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconHltv'></span></a></td></tr>"
        },
        dota2: {
            live: "<tr id='#{id}' class='eetrow eventLive #{gameType}' ><td class='live'><b>Live</b></td><td></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            soon: "<tr id='#{id}' class='eetrow eventSoon #{gameType}' ><td class='gg_date'>#{timeToLive}</td><td><a class='notificationHref' data-id='#{id}' href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            done: "<tr id='#{id}' class='eetrow eventDone #{gameType}' ><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result} : #{team2result}</span></span></td><td class='team1'><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td class='team2'><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr>"
        },
        hs: {
            live: "<tr id='#{id}' class='eetrow eventLive #{gameType}' ><td class='live'><b>Live</b></td><td></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            soon: "<tr id='#{id}' class='eetrow eventSoon #{gameType}' ><td class='gg_date'>#{timeToLive}</td><td><a class='notificationHref' data-id='#{id}' href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            done: "<tr id='#{id}' class='eetrow eventDone #{gameType}' ><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result} : #{team2result}</span></span></td><td class='team1'><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td class='team2'><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr>"
        },
        sc2: {
            live: "<tr id='#{id}' class='eetrow eventLive #{gameType}' ><td class='live'><b>Live</b></td><td></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            soon: "<tr id='#{id}' class='eetrow eventSoon #{gameType}' ><td class='gg_date'>#{timeToLive}</td><td><a class='notificationHref' data-id='#{id}' href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            done: "<tr id='#{id}' class='eetrow eventDone #{gameType}' ><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result} : #{team2result}</span></span></td><td class='team1'><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td class='team2'><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr>"
        },
        lol: {
            live: "<tr id='#{id}' class='eetrow eventLive #{gameType}' ><td class='live'><b>Live</b></td><td></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            soon: "<tr id='#{id}' class='eetrow eventSoon #{gameType}' ><td class='gg_date'>#{timeToLive}</td><td><a class='notificationHref' data-id='#{id}' href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr></tr>",
            done: "<tr id='#{id}' class='eetrow eventDone #{gameType}' ><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>#{team1result} : #{team2result}</span></span></td><td class='team1'><span class='#{team1flag}'></span> #{team1name}</td><td>vs.</td><td class='team2'><span class='#{team2flag}'></span> #{team2name}</td><td><a class='myHref' href='#{url}'><span class='iconGosu'></span></a></td></tr>"
        }
    },
    init: function () {
        defineDefaults();
        //getEvents()
        //getHLTVMatches();
    }
};

//cache settings
var isSpoilerOn = eet.settings.isSpoilerOn;
var isTooltipOn = eet.settings.isTooltipOn;

//helper variables
var csgo_winner = [];

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

$('body').on('click', '.menutab', function (e) {
    var lastTab = $(e.currentTarget).attr('id');
    localStorage.lastOpenedTab = lastTab;
    $('#sub_' + lastTab + '_' + localStorage.lastSubTab).tab('show');
});

$('body').on('click', '.submenu', function (e) {
    var lastSubTab = $(e.currentTarget).data('subtab');
    localStorage.lastSubTab = lastSubTab;
});

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
    console.log("setResultsSpoiler "+isSpoilerOn);
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

//show results and remove spoiler
$("body").on("click", ".eetrow .spoilerAlert", function () {
    event.preventDefault();
    $(this.firstChild).addClass("hide"); //remove spoiler
    $(this.lastChild).removeClass("hide"); //show results
});

var getCSEvents = $.ajax({
    url: eet.config.urls.csgo.upc,
    type: "GET",
    async: true,
    dataType: "",
    success: function (data) {
        var htmlMatches = "";
        var $foo = $(data);
        $foo.find(".col-xs-12.col-lg-7").filter(function() { //hopefully exist only 1 time?!
            var matches = $(this).find(".col-xs-12.col-md-6");
            $.each(matches, function(i, html) {
                var match = {};
                match.gameType = "csgo";
                //match.time = $(this).find(".badge").text();
                match.isLive = $(this).find(".pull-right.label-success").length >= 1 ? true : false; //only exist if match is live
                match.url = "http://www.hltv.org"+$(this).find("a").attr("href");
                match.id = match.url.hashCode();

                var gameInfoDiv =$(this).find("a").find("div");
                match.team1name = $(gameInfoDiv[0]).text();
                match.team1flag = $(gameInfoDiv[0]).find("img").attr("src");
                match.team2name = $(gameInfoDiv[1]).text();
                match.team2flag = $(gameInfoDiv[1]).find("img").attr("src");
               // match.coverage = $(gameInfoDiv[2]).text();
               // match.map =  $(gameInfoDiv[3]).text();


                if (match.isLive) {
                    htmlMatches += $.tmpl(eet.templates.csgo.live, match);
                }
                else {
                    match.timeToLive = $(this).find(".descriptiontext").text(); //only exist if event is not live
                    match.timestamp =  Math.round(strtotime("+ "+match.timeToLive.replace('h,', ' hours').replace('m', ' minutes').replace("\n", "")));
                    eet.matches.all[match.id] = match;
                    htmlMatches += $.tmpl(eet.templates.csgo.soon, match);
                    sendMessageToBackground(match);
                }
            });
            $('#tbody_csgo_upcMatches').html(htmlMatches);
        });
    }
});

var getDotaEvents = $.ajax({
        url: eet.config.urls.dota2,
        type: "GET",
        async: true,
        dataType: "",
        success: function (data) {
            var htmlLiveMatches = "", htmlUpcMatches="", htmlResultMatches="", htmlMatches = "";
            var $html = data.replace(/src/g, 'data-src');

            var categories = $($html).find("table.matches").length;
            if (categories === 3) {
                htmlLiveMatches = $($html).find("table.matches").eq(0);
                htmlUpcMatches = $($html).find("table.matches").eq(1);
                htmlResultMatches = $($html).find("table.matches").eq(2);
            }
            else if (categories === 2) {
                htmlUpcMatches = $($html).find("table.matches").eq(0);
                htmlResultMatches = $($html).find("table.matches").eq(1);
            }
            else {
                htmlResultMatches = $($html).find("table.matches").eq(0);
            }

            //-------------start scraping-------------
            liveUpcCounter = 0;
            htmlMatches += getGosuLive(htmlLiveMatches, "dota2");
            htmlMatches += getGosuUpc(htmlUpcMatches, "dota2");
            if (htmlMatches === "") {
                $('#tbody_dota2_upcMatches').html($.tmpl(eet.templates.no_matches, {gameType:"dota2"}));
            }
            else {
                $('#tbody_dota2_upcMatches').html(htmlMatches);
            }
            getGosuResults(htmlResultMatches, "dota2");
        }
    });

var getHearthstoneEvents = $.ajax({
        url: eet.config.urls.hs,
        type: "GET",
        async: true,
        dataType: "",
        success: function (data) {
            var htmlLiveMatches = "", htmlUpcMatches="", htmlResultMatches="", htmlMatches = "";
            var $html = data.replace(/src/g, 'data-src');

            var categories = $($html).find("table.matches").length;
            if (categories === 3) {
             htmlLiveMatches = $($html).find("table.matches").eq(0);
             htmlUpcMatches = $($html).find("table.matches").eq(1);
             htmlResultMatches = $($html).find("table.matches").eq(2);
            }
            else if (categories === 2) { //doenst work if there are live matches and no upc matches
                htmlUpcMatches = $($html).find("table.matches").eq(0);
                htmlResultMatches = $($html).find("table.matches").eq(1);
            }
            else {
                htmlResultMatches = $($html).find("table.matches").eq(0);
            }

        //-------------start scraping-------------
            liveUpcCounter = 0;
            htmlMatches += getGosuLive(htmlLiveMatches, "hs");
            htmlMatches += getGosuUpc(htmlUpcMatches, "hs");
            if (htmlMatches === "") {
                $('#tbody_hs_upcMatches').html($.tmpl(eet.templates.no_matches, {gameType:"hs"}));
            }
            else {
                $('#tbody_hs_upcMatches').html(htmlMatches);
            }
            getGosuResults(htmlResultMatches, "hs");
        }
    });

var getLeagueOfLegendsEvents = $.ajax({
        url: eet.config.urls.lol,
        type: "GET",
        async: true,
        dataType: "",
        success: function (data) {
            var htmlLiveMatches = "", htmlUpcMatches="", htmlResultMatches="", htmlMatches = "";
            var $html = data.replace(/src/g, 'data-src');

            var categories = $($html).find("table.matches").length;
            if (categories === 3) {
                htmlLiveMatches = $($html).find("table.matches").eq(0);
                htmlUpcMatches = $($html).find("table.matches").eq(1);
                htmlResultMatches = $($html).find("table.matches").eq(2);
            }
            else if (categories === 2) {
                htmlUpcMatches = $($html).find("table.matches").eq(0);
                htmlResultMatches = $($html).find("table.matches").eq(1);
            }
            else {
                htmlResultMatches = $($html).find("table.matches").eq(0);
            }

            //-------------start scraping-------------
            liveUpcCounter = 0;
            htmlMatches += getGosuLive(htmlLiveMatches, "lol");
            htmlMatches += getGosuUpc(htmlUpcMatches, "lol");
            if (htmlMatches === "") {
                $('#tbody_lol_upcMatches').html($.tmpl(eet.templates.no_matches, {gameType:"lol"}));
            }
            else {
                $('#tbody_lol_upcMatches').html(htmlMatches);
            }
            getGosuResults(htmlResultMatches, "lol");
        }
    });

var getStarcraftEvents = $.ajax({
        url: eet.config.urls.sc2,
        type: "GET",
        async: true,
        dataType: "",
        success: function (data) {
            var htmlLiveMatches = "", htmlUpcMatches="", htmlResultMatches="", htmlMatches = "";
            var $html = data.replace(/src/g, 'data-src');

            var categories = $($html).find("table.matches").length;
            if (categories === 3) {
                htmlLiveMatches = $($html).find("table.matches").eq(0);
                htmlUpcMatches = $($html).find("table.matches").eq(1);
                htmlResultMatches = $($html).find("table.matches").eq(2);
            }
            else if (categories === 2) {
                htmlUpcMatches = $($html).find("table.matches").eq(0);
                htmlResultMatches = $($html).find("table.matches").eq(1);
            }
            else {
                htmlResultMatches = $($html).find("table.matches").eq(0);
            }

            //-------------start scraping-------------
            liveUpcCounter = 0;
            htmlMatches += getGosuLive(htmlLiveMatches, "sc2");
            htmlMatches += getGosuUpc(htmlUpcMatches, "sc2");
            if (htmlMatches === "") {
                $('#tbody_sc2_upcMatches').html($.tmpl(eet.templates.no_matches, {gameType:"sc2"}));
            }
            else {
                $('#tbody_sc2_upcMatches').html(htmlMatches);
            }
            getGosuResults(htmlResultMatches, "sc2");
        }
    });

var liveUpcCounter = 0;

function getGosuLive(html, gameType) {
    var htmlMatches = "";
    $(html).find("tr").filter(function () {
        liveUpcCounter++;
        var match = {};
        match.gameType = gameType;


        var team1 = $(this).find(".opp1");
        match.team1name = team1.text();
        match.team1flag = team1.children().last().attr('class');

        var team2 = $(this).find(".opp2");
        match.team2name = team2.text();
        match.team2flag = team2.children().first().attr('class');

        match.url = "http://www.gosugamers.net"+$(this).find("a").first().attr('href');
        match.id = match.url.hashCode();

        //-------- get deeper information ------
        match.timestamp = null;
        match.time = null;
        match.date = null; //not necessarry
        match.coverage = null;
        //match.bestOf = null; //check dota extension

        htmlMatches += $.tmpl(eet.templates[gameType].live, match);


    });
    return htmlMatches;
}

function getGosuUpc(html, gameType) {
    var htmlMatches = "";
    $(html).find("tr").filter(function () {
        if (liveUpcCounter < 15) {
            liveUpcCounter++;
            var match = {};
            match.gameType = gameType;
            match.timeToLive = $(this).find(".type-specific").text();

            var team1 = $(this).find(".opp1");
            match.team1name = team1.text();
            match.team1flag = team1.children().last().attr('class');

            var team2 = $(this).find(".opp2");
            match.team2name = team2.text();
            match.team2flag = team2.children().first().attr('class');

            match.url = "http://www.gosugamers.net"+$(this).find("a").first().attr('href');
            match.id = match.url.hashCode();
            match.timestamp =  Math.round(strtotime("+ "+match.timeToLive.replace('h', ' hours').replace('m', ' minutes').replace('d', ' days').replace("\n", "")));

            //-------- get deeper information ------ todo:you only need to do that if you have tooltips enabled
            match.date = null;
            match.time = null;
            match.coverage = null;
            match.bestOf = null;

            htmlMatches += $.tmpl(eet.templates[gameType].soon, match);

            eet.matches.all[match.id] = match;

            sendMessageToBackground(match);
        }
    });
    return htmlMatches;
}

function getGosuResults(html, gameType){
    var winners = [], htmlResult = "";
    var counter = 0;
    $(html).find("tr").filter(function () {
        if (counter < 15) {
            counter++;
            var match = {};
            match.gameType = gameType;

            var team1 = $(this).find(".opp1");
            match.team1name = team1.text();
            match.team1flag = team1.children().last().attr('class');

            var team2 = $(this).find(".opp2");
            match.team2name = team2.text();
            match.team2flag = team2.children().first().attr('class');

            match.url = "http://www.gosugamers.net"+$(this).find("a").first().attr('href');
            match.id = match.url.hashCode();

            match.team1result = $(this).find(".hscore").text();
            match.team2result = $(this).find(".ascore").text();
            match.winner = parseInt(match.team1result) > parseInt(match.team2result) ? "team1" : "team2";
            match.loser = parseInt(match.team2result) > parseInt(match.team1result) ? "team1" : "team2";

            htmlResult += $.tmpl(eet.templates[gameType].done, match);

            if (match.winner !== match.loser) {
                winners.push({id:match.id, class: match.winner});
            }
        }
    });

    $("#tbody_"+gameType+"_results").html(htmlResult);

    $.each(winners, function(i, v) {
        $("#"+ v.id+" ."+ v.class).addClass("winnerTeam");
    });
}



function sendMessageToBackground(obj, showNotification) {
    showNotification = showNotification || false; //todo:replace 'false' with global notification from localstorage
    var foo = {
        showNotification: showNotification,
        match: obj
    }
    chrome.runtime.sendMessage(foo, function(response) {
        console.log(response.success);
    });
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
                        if (gameType == "sc" || gameType == "csgo" || gameType=="soccer") // don't collect games of old starcraft
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

/*var loadHLTVMatches = $.ajax({
    url: "http://josef.virtual-artz.de/api/matches/hltv/v100/api.json",
    success: function (data) {
        var upc_matches, res_matches, foo;

        if (data["soon"] === null && data["live"] === null) {
            upc_matches = eet.templates.no_matches;
        }

        csgo_winner = [];
        $.each(data, function (key, match) { //key: done,soon,live
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
            else { // live and soon
                if (match !== null) {
                    $.each(match, function (i, gameInfo) {
                        eet.matches.csgo[gameInfo["id"]] = gameInfo;
                        if (gameInfo["isLive"]) {
                            console.log("game is live");
                            upc_matches += $.tmpl(eet.templates.csgo_live, gameInfo);
                        }
                        else {
                            upc_matches += $.tmpl(eet.templates.csgo_soon, gameInfo);
                        }
                    });
                }
            }
        });
        $('#tbody_csgo_upcMatches').html(upc_matches);
        $('#tbody_csgo_results').html(res_matches);
        console.log(eet.matches.csgo);
        $.each(csgo_winner, function(i, winner){
           $("#"+winner.id+" ."+winner.class).addClass("winnerTeam");
        });
    }
});*/

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

$("#ex6").slider();
$("#ex6").on('slide', function(slideEvt) {
    $("#ex6SliderVal").text(slideEvt.value);
});

document.addEventListener('DOMContentLoaded', function () {
    eet.init();
   // getEvents();

    $.when(loadCsgoVods, getCSEvents, getStarcraftEvents, getDotaEvents, getHearthstoneEvents, getLeagueOfLegendsEvents).done(function () {
        console.log("loading finished");
        setResultsSpoiler(isSpoilerOn);

        if (!isTooltipOn) {
            $('[data-toggle="tooltip"]').tooltip('disable');
        }

    /*    $('[data-toggle="popover"]').popover({
            html: "true",
            placement: "left",
            trigger: 'click'
        })*/

        $('body').on('click', '.myHref', function (e) {
            e.stopPropagation();
            var url = $(this).attr('href');
            window.open(url);
        });

        /*todo:change icon to remove notification and so on*/
        $('body').on('click', '.notificationHref', function (e) {
            e.stopPropagation();
            var id = $(this).data("id");

            var notifyObj = {
                    showNotification: true,
                    match: eet.matches.all[id]
            };

            chrome.runtime.sendMessage(notifyObj, function(response) {
                console.log(response.success);
            });
        });
    });




});

//$(".my-popover").attr({"data-toggle": "popover", "data-container": "body", "data-placement": "bottom", "data-content": "My popover content", "data-original-title": "Popover title"});
//$("[data-toggle=popover]").popover();
$("body").tooltip({ selector: '[data-toggle="tooltip"]', html: true });


var trimAfter = function (text, n) {
    var short = text;
    if (text.length > n + 2)
        short = text.substr(0, n) + "..";
    return short;
};

String.prototype.hashCode = function() {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};