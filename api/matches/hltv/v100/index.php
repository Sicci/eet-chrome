<?php
    require_once('php/simple_html_dom.php');
    $html_upc = file_get_contents('http://www.hltv.org/?m=yes&pageid=305');
	$html_res = file_get_contents('http://www.hltv.org/?m=yes&pageid=296');
    $matchList = new simple_html_dom();
	$resultList = new simple_html_dom();
    $matchList->load($html_upc);
	$resultList->load($html_res);
    $output = array();
	
	$i = 0;
	foreach ($matchList->find('div[class*="col-xs-12 col-lg-7"]') as $matches){
		foreach($matches->find('div[class*="col-xs-12 col-md-6"]') as $match) {
			$i++;
			$gameType = "csgo";
			$time = $match->find('.badge', 0)->plaintext;
			$timeFromNow = $match->find('.descriptiontext', 0)->plaintext;
			$isLive = $match->find('[class*="pull-right label-success"]', 0); 
			$url = "http://www.hltv.org{$match->find('a', 0)->href}"; 
			$team1name = $match->find('a div',0)->plaintext;
			$team1flag = $match->find('a img',0)->src;
			$team2name = $match->find('a div',1)->plaintext;
			$team2flag = $match->find('a img',1)->src;
			$coverage = $match->find('a div',2)->plaintext;
			$map = $match->find('a div',3)->plaintext;
			
			if ($isLive) { //game is live
				$output["live"][] = "<tr data-toggle='tooltip' title='{$coverage}<br>{$map}' id='{$gameType}_upc_{$i}' class='eetrow eventLive'><td class='live' data-container='body'><strong>Live</strong></td><td><img src='{$team1flag}' />{$team1name}</td><td>vs.</td><td><img src='{$team2flag}' />{$team2name}</td></tr>";
			} else { //game is upcoming
				$output["soon"][] = "<tr data-toggle='tooltip' title='{$coverage}<br>{$map}' id='{$gameType}_upc_{$i}' class='eetrow eventSoon'><td class='fromNow'>{$timeFromNow}</td><td><a href='#'><span class='reminder glyphicon glyphicon-bell'></span></a></td><td><img src='{$team1flag}' />{$team1name}</td><td>vs.</td><td><img src='{$team2flag}' />{$team2name}</td></tr>";
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

			if ($team1result > $team2result) {
			    $result = "<td class='winnerTeam'><img src='{$team1flag}' />{$team1name}</td><td>vs.</td><td class='loserTeam'><img src='{$team2flag}' />{$team2name}</td>";
			} else {
                $result = "<td class='loserTeam'><img src='{$team1flag}' />{$team1name}</td><td>vs.</td><td class='winnerTeam'><img src='{$team2flag}' />{$team2name}</td>";
			}
				
			$output["done"][] = "<tr data-toggle='tooltip' title='{$date}<br>{$coverage}<br>{$map}' id='{$gameType}_res_{$j}' class='eetrow eventDone'><td><span class='spoilerAlert'><a class='spoiler' href='#'>Score</a><span class='result hide'>{$team1result}: {$team2result}</span></span></td>{$result}<td><a class=myHref href='{$url}'><span class='iconHltv'></span></a></td></tr>";
		}
		
	}
	
	//$output = array_merge($output, $finishedList);
	$str = trim(json_encode($output));
	$filestr    = "api.json";
	$fp=@fopen($filestr, 'w');
	fwrite($fp, $str);
	fwrite($fp, ""); 
	fclose($fp);
	echo $str;
?>