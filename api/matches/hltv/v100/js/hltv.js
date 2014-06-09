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

jQuery.fn.justtext = function() {
    return $(this)  .clone()
        .children()
        .remove()
        .end()
        .text();
};