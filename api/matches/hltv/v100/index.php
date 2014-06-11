<?php
require_once('php/simple_html_dom.php');
$html_upc = file_get_contents('http://www.hltv.org/?m=yes&pageid=305');
$html_res = file_get_contents('http://www.hltv.org/?m=yes&pageid=296');
$matchList = new simple_html_dom();
$resultList = new simple_html_dom();
$matchList->load($html_upc);
$resultList->load($html_res);
$output = array();
putenv('GDFONTPATH=' . realpath('.'));
$font = "DroidSans";
function trim_by_width($text,$width,$font_file,$font_size=7,$append_string = '...')
{
    $append_string_box = imagettfbbox($font_size,0,$font_file,$append_string);
    $append_string_width = $append_string_box[2];

    $str_len = strlen($text);
    for ($i = 0; $i<=$str_len; $i++)
    {
        $trimmed_text = substr($text,0,$i);
        $bounding_box = imagettfbbox($font_size,0,$font_file,$trimmed_text);
        $trimmed_text_width = $bounding_box[2];
        if ($trimmed_text_width + $append_string_width > $width && $i > 0)
        {
            $str_to_return = substr($trimmed_text,0,strlen($trimmed_text)-1);
            if ($trimmed_text_width != $str_len)
            {
                $str_to_return .= $append_string;
            }
            return $str_to_return;
        }
    }
    return $text;
}

$i = 0;
foreach ($matchList->find('div[class*="col-xs-12 col-lg-7"]') as $matches){
    foreach($matches->find('div[class*="col-xs-12 col-md-6"]') as $match) {
        $i++;
        $gameType = "csgo";
        $time = $match->find('.badge', 0)->plaintext;

        $isLive = false;

        if(gettype($match->find('small[class*="descriptiontext"]', 0)) == "NULL") {
            $isLive = true;
        }
        else {
            $timeFromNow = $match->find('small', 0)->plaintext;
        }

        $url = "http://www.hltv.org{$match->find('a', 0)->href}";
        $team1name = $match->find('a div',0)->plaintext;
        $team1flag = $match->find('a img',0)->src;
        $team2name = $match->find('a div',1)->plaintext;
        $team2flag = $match->find('a img',1)->src;
        $coverage = $match->find('a div',2)->plaintext;
        $map = $match->find('a div',3)->plaintext;

        if ($isLive) { //game is live
            $output["live"][] = array("gameType"=>$gameType, "id"=>$i,"time"=>$time,"isLive"=>$isLive, "timeFromNow"=>$timeFromNow, "url"=>$url, "team1name"=>$team1name, "team1flag"=>$team1flag, "team2name"=>$team2name, "team2flag"=>$team2flag, "coverage"=>$coverage, "map"=>$map);
        } else { //game is upcoming
            $output["soon"][] = array("gameType"=>$gameType, "id"=>$i,"time"=>$time,"isLive"=>$isLive, "timeFromNow"=>$timeFromNow, "url"=>$url, "team1name"=>$team1name, "team1flag"=>$team1flag, "team2name"=>$team2name, "team2flag"=>$team2flag, "coverage"=>$coverage, "map"=>$map);
        }
    }
}

$j = 0;
foreach($resultList->find('div[class*="row col-lg-12"] div[class="panel panel-default"]') as $matches) {
    $date = $matches->find('.panel-title',0)->plaintext;
    foreach($matches->find('div[class*="col-lg-12 col-md-12 col-xs-12"]') as $match) {
        $j++;
        $gameType = "csgo";
        $url = "http://www.hltv.org{$match->find('a',0)->href}";
        $team1 = $match->find('a div', 0)->plaintext;
        $team2 = $match->find('a div', 1)->plaintext;
        $team1name = substr($team1,0,strrpos($team1, ' ',-2));
        $team2name = substr($team2,0,strrpos($team2, ' ',-2));
        $team1flag = $match->find('a div img', 0)->src;
        $team2flag = $match->find('a div img', 1)->src;
        $team1result = $match->find('a div span',0)->plaintext;
        $team2result = $match->find('a div span',1)->plaintext;
        $coverage = $match->find('a div', 2)->plaintext;
        $map = $match->find('a div', 3)->plaintext;

        $winner = (intval($team1result) > intval($team2result) ? "team1" : "team2");
        $loser = (intval($team2result) > intval($team1result) ? "team1" : "team2");

        //$team1name = trim_by_width("{$team1name}",78,$font,8);
        //$team2name = trim_by_width("{$team2name}",78,$font,8);

        $output["done"][] = array("gameType"=>$gameType, "id"=>$j, "date"=>$date, "time"=>$time, "url"=>$url, "team1name"=>$team1name, "team1flag"=>$team1flag, "team2name"=>$team2name, "team2flag"=>$team2flag, "coverage"=>$coverage, "map"=>$map, "team1result"=>$team1result, "team2result"=>$team2result, "winnerTeam"=>$winner, "loserTeam"=>$loser);

    }

}

//$output = array_merge($output, $finishedList);
$str = trim(json_encode($output));
$filestr    = "api.json";
$fp=@fopen($filestr, 'w');
fwrite($fp, $str);
//fwrite($fp, "");
fclose($fp);
echo $str;
?>