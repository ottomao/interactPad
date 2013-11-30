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

        $resHeader = $this->readHeader($sock);
        $out       = $this->readBody($sock,$resHeader);

        fclose($sock);

        return array(
            'header' => $resHeader,
            'body'   => $out
            );
    }

    protected function readBody($sock,$header) {
        $body = '';
        if ($this->isChunked($header)) {
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

    protected function readHeader($sock){
        $header = '';

        # 读取 header
        while (($h = $this->readLine($sock)) !== '') {
            $header .= $h;
        }

        return $header;
    }

    protected function isChunked($header) {
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

$resourceComponent = parse_url($__GET["file"]);
$host = $resourceComponent['host']; // $__GET["host"];
$file = $resourceComponent['path']; // $__GET["file"]; //TODO : error handling

$http = new HTTP_Socket_Request($host);
$http->setFilepath($file);

$res = $http->getResponse();

$header = $res["header"];
$body   = $res["body"];

if(preg_match('/image\/jpeg/', $header) > 0){
    header('Content-Type: image/jpeg');
    echo $body;
}else if(preg_match('/image\/png/', $header) > 0){
    header('Content-Type: image/png');
    echo $body;
}else if(preg_match('/image\/gif/', $header) > 0){
    header('Content-Type: image/gif');
    echo $body;
}else{
    echo "err";
}

?>