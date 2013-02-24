<?php
require_once('secret.php');

function is_valid_callback($subject) {

    //way stricter then necesary
    $identifier_syntax = '/^[$_a-zA-Z][$_a-zA-Z0-9]*$/u';

    $reserved_words = array(
    'abstract', 'alert', 'all', 'anchor', 'anchors', 'area', 'arguments', 
    'Array', 'assign', 'blur', 'boolean', 'break', 'button', 'byte', 'case', 
    'catch', 'char', 'checkbox', 'class', 'clearInterval', 'clearTimeout', 
    'clientInformation', 'close', 'closed', 'confirm', 'const', 'constructor', 
    'continue', 'crypto', 'Date', 'debugger', 'decodeURI', 
    'decodeURIComponent', 'default', 'defaultStatus', 'delete', 'do', 
    'document', 'double', 'element', 'elements', 'else', 'embed', 'embeds', 
    'encodeURI', 'encodeURIComponent', 'enum', 'escape', 'eval', 'event', 
    'export', 'extends', 'false', 'fileUpload', 'final', 'finally', 'float', 
    'focus', 'for', 'form', 'forms', 'frame', 'frameRate', 'frames', 
    'function', 'getClass', 'goto', 'hasOwnProperty', 'hidden', 'history', 
    'if', 'image', 'images', 'implements', 'import', 'in', 'Infinity', 
    'innerHeight', 'innerWidth', 'instanceof', 'int', 'interface', 'isFinite', 
    'isNaN', 'isPrototypeOf', 'java', 'JavaArray', 'JavaClass', 'JavaObject', 
    'JavaPackage', 'layer', 'layers', 'length', 'let', 'link', 'location', 
    'long', 'Math', 'mimeTypes', 'name', 'NaN', 'native', 'navigate', 
    'navigator', 'new', 'null', 'Number', 'Object', 'offscreenBuffering', 
    'onbeforeunload', 'onblur', 'onclick', 'oncontextmenu', 'ondragdrop', 
    'onerror', 'onfocus', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 
    'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 
    'onreset', 'onsubmit', 'onunload', 'open', 'opener', 'option', 
    'outerHeight', 'outerWidth', 'package', 'packages', 'pageXOffset', 
    'pageYOffset', 'parent', 'parseFloat', 'parseInt', 'password', 'pkcs11', 
    'plugin', 'private', 'prompt', 'propertyIsEnum', 'protected', 'prototype', 
    'public', 'radio', 'reset', 'return', 'screenX', 'screenY', 'scroll', 
    'secure', 'select', 'self', 'setInterval', 'setTimeout', 'short', 
    'static', 'status', 'String', 'submit', 'super', 'switch', 'synchronized', 
    'taint', 'text', 'textarea', 'this', 'throw', 'throws', 'top', 'toString', 
    'transient', 'true', 'try', 'typeof', 'undefined', 'unescape', 'untaint', 
    'valueOf', 'var', 'void', 'volatile', 'while', 'window', 'with', 'yield'
    );

    return preg_match($identifier_syntax, $subject)
        && ! in_array($subject, $reserved_words, true);
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
        return true;
    }
    $start  = $length * -1; //negative
    return (substr($haystack, $start) === $needle);
}

function main() {
    header('content-type: text/javascript; charset=UTF-8');
    
    $referrerIsValid = false;
    $hasReferrer = false;
    if (isset($_SERVER['HTTP_REFERER'])) {
        $parts = parse_url($_SERVER['HTTP_REFERER']);
        if (isset($parts['host'])) {
            $hasReferrer = true;
            $host = $parts['host'];
            $referrerIsValid = $host === 'crydust.be' || endsWith($host, '.crydust.be') || $host === 'localhost';
        }
    }
    if ($hasReferrer && !$referrerIsValid) {
        header('status: 400 Bad Request', true, 400);
        die('// invalid request');
    }
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
        $output = $_GET['output'];
        $callback = $_GET['callback'];

        if ($output === 'jsonp') {
            if (!isset($callback)) {
                header('status: 400 Bad Request', true, 400);
                die('// callback not set');
            }
            if (!is_valid_callback($callback)) {
                header('status: 400 Bad Request', true, 400);
                die('// callback is not valid');
            }
        }

        $q = $_GET['q'];
        if (!isset($q)) {
            header('status: 400 Bad Request', true, 400);
            die('// q not set');
        }

        if($output !== 'jsonp' || is_valid_callback($callback)) {
            $url = "http://maps.google.com/maps/geo?q={$q}&output=json&sensor=true&key={$googlemaps_key}";
            // 3 second timeout
            $context = stream_context_create(array(
                'http' => array(
                    'timeout' => 3
                )
            ));
            $json = file_get_contents($url, false, $context);

            $json = @file_get_contents($url);
            if ($json === false || empty($json)) {
                header('status: 503 Service Temporarily Unavailable', true, 503);
                die('error');
            } else {
                $maxage_days = 32;
                $maxage_seconds = 60*60*24*$maxage_days;
                $now = time();
                header('Pragma: public');
                header('Cache-Control: maxage=' . $maxage_seconds);
                header('Expires: ' . gmdate('D, d M Y H:i:s', $now + $maxage_seconds) . ' GMT');
                if ($output === 'jsonp') {
                    header('Content-Type: application/javascript');
                    echo $callback, '(', $json, ')';
                } else {
                    header('Content-Type: application/json');
                    echo $json;
                }
                exit();
            }
        }
        
    }
    
    # Otherwise, bad request
    header('status: 400 Bad Request', true, 400);
}

main();


