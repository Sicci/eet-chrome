<?php
//http://en.el.tv/videos/?no_cache=1&tx_esltv_pi3[swords]=&tx_esltv_pi3[sortby]=newest_first&tx_esltv_pi3[filter][language]=en&tx_esltv_pi3[filter][channels]=main&tx_esltv_pi3[filter][game]=csgo&tx_esltv_pi3[filter][maxdaysold]=30
    require_once('php/simple_html_dom.php');
    $html_esltv = file_get_contents('http://en.esl.tv/videos/?no_cache=1&tx_esltv_pi3%5Bswords%5D=&tx_esltv_pi3%5Bsortby%5D=newest_first&tx_esltv_pi3%5Bfilter%5D%5Blanguage%5D=en&tx_esltv_pi3%5Bfilter%5D%5Bchannels%5D=main&tx_esltv_pi3%5Bfilter%5D%5Bgame%5D=csgo&tx_esltv_pi3%5Bfilter%5D%5Bmaxdaysold%5D=30');
    $matchList = new simple_html_dom();
	//$resultList = new simple_html_dom();
    $matchList->load($html_esltv);
	//$resultList->load($html_res);
    $output = array();
    foreach ($matchList->find('div[class*="vod_listing_wide details"]') as $match){
		$airtime = $match->find('.airtime',0)->plaintext;
		$gameType = "csgo";
		$organisation = "esltv";
		$gameName = $match->find('.title_game',0)->plaintext;
		$videolength = $match->find('.videolength',0)->plaintext;
		$videourl = $match->find('a',0)->href;
		$str = explode("-",$match->find('a',0)->plaintext,2);
		
		$title = $str[0];
		$coverage = $str[1];
		
		$output["esltv"][] = "<tr id='{$gameType}_vods_{$organisation}' class='eetrow vod' data-toggle='tooltip' title='{$coverage}'><td class='airtime'>{$airtime}</td><td class='vod_title'>{$title}</td><td class='vod_length'>{$videolength}</td><td><a class='myHref' href='{$videourl}'><span class='iconEsltv'></span></a></td></tr>";
    }
	
	$json = trim(json_encode($output));
	$filestr    = "api.json";
	$fp=@fopen($filestr, 'w');
	fwrite($fp, $json);
	fwrite($fp, ""); 
	fclose($fp);
	echo $json;

?>