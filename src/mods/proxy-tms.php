<?php
/**
 * HTTP request: perform a http request through socket
 * 
 * only support method 'GET'
 *
 * Author: linqian.zl@taobao.com
 */
class HTTP_Socket_Request {
    protected $host,
              $method = 'GET',
              $port,
              $timeout,
              $filepath = '',

              $body = '',
              $error_no  = NULL,
              $error_msg = NULL;

    const BUFFER_SIZE = 1024;

    function __construct($host, $port = 80, $timeout = 30) {
        $this->host    = $host;
        $this->port    = $port;
        $this->timeout = $timeout;
    }

    function setFilepath($file, $queries = '') {
        $re = '';

        if (is_array($queries)) {
            $re = http_build_query($queries);
        } else {
            $re = $queries;
        }

        $this->filepath = $file . ($re === '' ? '' : "?{$re}");
    }

    function getResponse() {
        $sock = @fsockopen($this->host, $this->port, $this->error_no, $this->error_msg, $this->timeout);
        $header = '';
        if (!$sock) {
            return false;
        } else {
            $header .= "{$this->method} /{$this->filepath} HTTP/1.1\r\n";
            $header .= "HOST: {$this->host}\r\n";
            $header .= "Accept: application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5\r\n";
            $header .= "User-Agent: PHP\r\n";
            $header .= "Accept-Language: zh-CN,zh;q=0.8\r\n";
            $header .= "Accept-Charset: GBK,utf-8;q=0.7,*;q=0.3\r\n";
            $header .= "Connection: Close\r\n\r\n";
        }

        @fwrite($sock, $header);

        $out = $this->readBody($sock);

        fclose($sock);

        return $out;
    }

    protected function readBody($sock) {
        $body = '';
        if ($this->isChunked($sock)) {
            $body = $this->readChunked($sock);
        } else {
            while (!feof($sock)) {
                $body .= @fread($sock, self::BUFFER_SIZE);
            }
        }

        return $body;
    }

    protected function readChunked($sock) {
        $data = '';
        $chunkLength = 0;

        while(!feof($sock) ) {
            $line = $this->readLine($sock);
            if (!preg_match('/^([0-9a-f]+)/i', $line, $matches)) {
                // TODO: error
            } else {
                $chunkLength = hexdec($matches[1]);

                # 分段读取
                $leftLength = $chunkLength;
                do {
                    $data .= @fread($sock, min($leftLength, self::BUFFER_SIZE));
                    $leftLength -= self::BUFFER_SIZE;
                } while ($leftLength > 0);

                $this->readLine($sock); // Trailing CRLF 
            }
        }

        return $data;
    }

    protected function isChunked($sock) {
        $header = '';

        # 读取 header
        while (($h = $this->readLine($sock)) !== '') {
            $header .= $h;
        }

        return preg_match('/transfer-encoding:\s*chunked/i', $header) > 0;
    }

    protected function readLine($sock) {
        $line = '';
        
        # 分多次读取
        while (!feof($sock)) {
            $line .= @fgets($sock, self::BUFFER_SIZE);

            if (substr($line, -1) == "\n") {
                $line = rtrim($line, "\r\n");
                return $line;
            }
        }

        return $line;
    }

    function isError() {
        return $this->error_no || $this->error_msg;
    }

    function getError() {
        if ($this->isError()) {
            return $this->error_msg;
        } else {
            return false;
        }
    }
}

$host = htmlspecialchars($__GET["host"]);
$file = htmlspecialchars($__GET["file"]); //TODO : error handling

$type = htmlspecialchars($__GET["mime"]);
switch ($type) {
    case 'jpg':
        $mime = 'image/jpeg';
        break;
    case 'gif':
        $mime = 'image/gif';
        break;
    case 'png':
        $mime = 'image/png';
        break;
    default:
        $mime = 'image/jpeg';
}
header('Content-Type: '.$mime);

$http = new HTTP_Socket_Request($host);
$http->setFilepath($file);

$out = $http->getResponse();
echo $out;

//
?>