<?php
$dir = __DIR__;
$backupDir = $dir . '/backup_php';

if (!is_dir($backupDir)) {
    exit("Backup directory not found. Restoration failed.");
}

function replaceLinks($html) {
    // Replace .php links with .html
    $html = preg_replace_callback('/([\'"])([a-zA-Z0-9_\-\.\/]+)\.php\1/i', function($matches) {
        if (strpos($matches[2], 'send_mail') !== false) return $matches[0];
        return $matches[1] . $matches[2] . '.html' . $matches[1];
    }, $html);
    
    // Branding: 오피스 GPT -> OfficeGPT
    $html = str_replace('오피스 GPT', 'OfficeGPT', $html);
    
    return $html;
}

// 1. Process header.php -> header.html
$headerOrigFile = $backupDir . '/header.php';
$headerOrig = file_get_contents($headerOrigFile);
$headerLines = explode("\n", str_replace("\r", "", $headerOrig));
$header_body = "";
$nav_script = "";

foreach($headerLines as $index => $line) {
    if ($index >= 14 && $index <= 241) {
        $header_body .= $line . "\n";
    }
    if ($index >= 246 && $index <= 273) {
        $nav_script .= $line . "\n";
    }
}
file_put_contents($dir . '/header.html', replaceLinks(trim($header_body)));

// 2. Process footer.php -> footer.html
$footerOrig = file_get_contents($backupDir . '/footer.php');
file_put_contents($dir . '/footer.html', replaceLinks(trim($footerOrig)));

// 3. Create js/load_includes.js
$js_content = <<<JS
document.addEventListener("DOMContentLoaded", function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.outerHTML = data;
                
                // Initialize mobile nav script
$nav_script
            }
        });

    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
                footerPlaceholder.outerHTML = data;
            }
        });
});
JS;
if (!is_dir($dir . '/js')) mkdir($dir . '/js', 0777, true);
file_put_contents($dir . '/js/load_includes.js', $js_content);

// 4. Process all backup php files to html
$files = glob($backupDir . '/*.php');
foreach ($files as $file) {
    $basename = basename($file);
    if ($basename === 'header.php' || $basename === 'footer.php' || $basename === 'test.php' || $basename === 'send_mail.php') {
        if ($basename === 'send_mail.php') {
            copy($file, $dir . '/' . $basename);
        }
        continue;
    }
    
    // Page specific title
    $title = "오프라인 GPT 솔루션";
    if (strpos($basename, 'officegpt') !== false) $title = "OfficeGPT | CAD BOM Agent";
    else if (strpos($basename, 'docsgpt') !== false) $title = "OfficeGPT | Document Summary Agent";
    else if (strpos($basename, 'officepage') !== false || strpos($basename, 'docspage') !== false) $title = "OfficeGPT | 주요핵심 기능";
    else if (strpos($basename, 'docsview') !== false) $title = "OfficeGPT | 기업 활용 사례";

    $head_top = <<<HTML
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>$title</title>
  <link rel="icon" href="images/favicon.ico" type="image/png">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link href="./css/style.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
</head>
<body>
  <div id="header-placeholder"></div>
HTML;

    $footer_bottom = <<<HTML
  <div id="footer-placeholder"></div>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="./js/load_includes.js"></script>
</body>
</html>
HTML;

    $content = file_get_contents($file);
    
    // Remove includes
    $content = preg_replace('/<\?php\s+include\s*\([\'"]header\.php[\'"]\);\s*\?>/i', '', $content);
    $content = preg_replace('/<\?php\s+include\s*\([\'"]footer\.php[\'"]\);\s*\?>/i', '', $content);
    $content = preg_replace('/<\?php\s+include\s+[\'"]header\.php[\'"]\;\s*\?>/i', '', $content);
    $content = preg_replace('/<\?php\s+include\s+[\'"]footer\.php[\'"]\;\s*\?>/i', '', $content);
    $content = preg_replace('/<\?=\s*include\s*\([\'"]header\.php[\'"]\)\s*\?>/i', '', $content);
    $content = preg_replace('/<\?=\s*include\s*\([\'"]footer\.php[\'"]\)\s*\?>/i', '', $content);
    
    // Convert links and branding
    $content = replaceLinks($content);
    
    $new_content = $head_top . "\n" . trim($content) . "\n" . $footer_bottom;
    
    $new_filename = $dir . '/' . str_replace('.php', '.html', $basename);
    file_put_contents($new_filename, $new_content);
}

echo "Restoration and Conversion with Favicon complete.";
?>
