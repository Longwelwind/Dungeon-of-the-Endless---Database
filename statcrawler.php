<?php

$url = $_GET["url"];

$rawHtml = file_get_contents($url);

$dom = new DomDocument();

// !!!!!!!!!!!!!!!!!!!!!
@$dom->loadHTML($rawHtml);

$tables = $dom->getElementsByTagName("table");
$statTable = $tables->item(0);

$rows = $statTable->childNodes;

$stats = array();

$i = 0;
foreach ($rows as $row) {

    if ($i == 0) {
        // First line contains the header
        $i++;
        continue;
    }

    $cells = $row->childNodes;

    preg_match("/([0-9])+/", $cells->item(7)->nodeValue, $matches);

    $stat = array(
        (double) $cells->item(1)->nodeValue,
        (double) $cells->item(2)->nodeValue,
        (double) $cells->item(3)->nodeValue,
        (double) $cells->item(4)->nodeValue,
        (double) $cells->item(5)->nodeValue,
        (double) $cells->item(6)->nodeValue,
        (double) $matches[0],
        (double) $cells->item(8)->nodeValue,
        (double) $cells->item(10)->nodeValue,

    );
    $stats[] = $stat;

    $i++;
}


echo json_encode($stats);
