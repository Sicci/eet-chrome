<?php
//copyright by Hamed "Wololo" Al-Khabaz

require_once('php/simple_html_dom.php');
date_default_timezone_set("CET");
$html = file_get_contents('http://www.gosugamers.net/dota2/gosubet');
$matchList = new simple_html_dom();
$matchList->load($html);
$titleList = new simple_html_dom();
$gameArray = array();
$done = $matchList->find('.matches', 2);
if ($done) {
    $d0 = 0;
    $d1 = 1;
    $d2 = 2;
    $live = true;
} else {
    $d0 = 0;
    $d1 = 0;
    $d2 = 1;
    $live = false;
}

//started
if ($live) {
    $started = $matchList->find('.matches', $d0);
    foreach($started->find('tr') as $aGame) {
        $gameType = "dota2";
        $img1 = "http://www.gosugamers.net".$aGame->find('span[class*="flag"]', 0)->class;
        $team1 =  trim($aGame->find('.opp1', 0)->plaintext);
        if (!$team1) {
            continue;
        }
        $img2  = "http://www.gosugamers.net".$aGame->find('span[class*="flag"]', 1)->class;
        $team2 =  trim($aGame->find('.opp2', 0)->plaintext);
        $linkID = "http://www.gosugamers.net".$aGame->find('a', 0)->href;
        $id = hash("adler32",$linkID);

        $html = file_get_contents($linkID);
        $titleList->load($html);
        $bestof = $titleList->find('.match-extras .bestof', 0)->plaintext;
        $bestof = current(array_slice(explode(' ', $bestof), 2, 1));
        if(!is_numeric($bestof)) $bestof = '?';
        $eventName = $titleList->find('.box-match-page > h2 a', 0)->plaintext . " [BO{$bestof}]";
        $fullDate = $titleList->find('.match-extras .datetime', 0)->plaintext;
        $fullDate = str_replace("at", "", $fullDate);
        $fullDate = $fullDate . "Europe/Berlin";
        $timeStamp = strtotime($fullDate);

        $date = "Live";
        $gameArray["live"][] = "<tr id='{$gameType}_upc_{$id}' class='eetrow eventLive' href='{$linkID}' title='{$eventName}' data-toggle='tooltip'><td alt='{$timeStamp}' class='live'><b>{$date}</b></td><td></td><td><span class='{$img1}'></span> {$team1}</td><td>vs.</td><td><span class='{$img2}'></span> {$team2}</td></tr>";
    }
}
//upcoming
$upcoming = $matchList->find('.matches', $d1);
foreach($upcoming->find('tr') as $aGame) {
    $gameType = "dota2";
    $img1 = "http://www.gosugamers.net".$aGame->find('span[class*="flag"]', 0)->class;
    $team1 =  trim($aGame->find('.opp1', 0)->plaintext);
    if (!$team1) {
        continue;
    }
    $img2  = "http://www.gosugamers.net".$aGame->find('span[class*="flag"]', 1)->class;
    $team2 =  trim($aGame->find('.opp2', 0)->plaintext);
    $linkID = "http://www.gosugamers.net".$aGame->find('a', 0)->href;
    $id = hash("adler32",$linkID);
    $date = trim($aGame->find('.live-in', 0)->plaintext);

    $html = file_get_contents($linkID);
    $titleList->load($html);
    $bestof = $titleList->find('.match-extras .bestof', 0)->plaintext;
    $bestof = current(array_slice(explode(' ', $bestof), 2, 1));
    if(!is_numeric($bestof)) $bestof = '?';
    $eventName = $titleList->find('.box-match-page > h2 a', 0)->plaintext . " [BO{$bestof}]";
    $fullDate = $titleList->find('.match-extras .datetime', 0)->plaintext;
    $fullDate = str_replace("at", "", $fullDate);
    $fullDate = $fullDate . "Europe/Berlin";
    $timeStamp = strtotime($fullDate);

    $gameArray["soon"][] =  "<tr id='{$gameType}_upc_{$id}' class='eetrow eventSoon' href='{$linkID}' title='{$eventName}' data-toggle='tooltip'><td alt='{$timeStamp}' class='gg_date'>{$date}</td><td><a href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><span class='{$img1}'></span> {$team1}</td><td>v</td><td><span class='{$img2}'></span> {$team2}</td></tr>";
}

//done
$done = $matchList->find('.matches', $d2);
foreach($done->find('tr') as $aGame) {
    $gameType = "dota2";
    $img1 = "http://www.gosugamers.net".$aGame->find('span[class*="flag"]', 0)->class;
    $team1 =  trim($aGame->find('.opp1', 0)->plaintext);
    if (!$team1) {
        continue;
    }
    $img2  = "http://www.gosugamers.net".$aGame->find('span[class*="flag"]', 1)->class;
    $team2 =  trim($aGame->find('.opp2', 0)->plaintext);
    $linkID = "http://www.gosugamers.net".$aGame->find('a', 0)->href;
    $id = hash("adler32",$linkID);

    $html = file_get_contents($linkID);
    $titleList->load($html);
    $bestof = $titleList->find('.match-extras .bestof', 0)->plaintext;
    $bestof = current(array_slice(explode(' ', $bestof), 2, 1));
    if(!is_numeric($bestof)) $bestof = '?';
    $eventName = $titleList->find('.box-match-page > h2 a', 0)->plaintext . " [BO{$bestof}]";
    $fullDate = $titleList->find('.match-extras .datetime', 0)->plaintext;
    $fullDate = str_replace("at", "", $fullDate);
    $fullDate = $fullDate . "Europe/Berlin";
    $timeStamp = strtotime($fullDate);
    $score1 = 0 + trim($titleList->find('.match-extras .hidden span', 0)->plaintext);
    $score2 = 0 + trim($titleList->find('.match-extras .hidden span', 1)->plaintext);
    $series = "{$score1}:{$score2}";
    if ($score1 == $score2)
        $winner = "=";
    else if ($score1 > $score2) {
        $team1 = '<b>'.$team1.'</b>';
        $winner = ">";
    } else {
        $team2 = '<b>'.$team2.'</b>';
        $winner = "<";
    }
    $gameArray["eventDone"][] = "<tr id='{$gameType}_res_{$id}' class='eetrow eventDone' href='{$linkID}' title='{$eventName}' data-toggle='tooltip'><td alt='{$timeStamp}' class='gg_date series'>{$series}</td><td><span class='{$img1}'></span> {$team1}</td><td class='winResult' data-winner='{$winner}'>{$winner}</td><td><span class='{$img2}'></span> {$team2}</td></tr>";
}

$str = trim(json_encode($gameArray));
$filestr    = "api.json";
$fp=@fopen($filestr, 'w');
fwrite($fp, $str);
fwrite($fp, "");
fclose($fp);
echo $str;
?>