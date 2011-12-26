/**
 * Feedability: Node.js Feed Proxy With Readability
 * Copyright (c) 2011, Matthias -apoc- Hecker <http://apoc.cc/>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
console.log('Feedability : NodeJS Feed Proxy With Readability');

/**
 * Core module for startup and shutdown of the feedability HTTP server.
 * 
 * @fileOverview
 */
function getcfg(key) {
  return settings[key];
}

var cfg={
"get": getcfg,
"settings":
{
  "proxy":
  {
    "bind": "127.0.0.1",
    "port": 13232,
    "banner": "Feedability/0.0",
    "preserve_order": true,
    "use_auth": false,
    "auth": "user:pass"
  },

  "urlopen":
  {
    "cache": true,
    "headers":
    {
      "User-Agent": "Mozilla/5.0 (compatible; Feedability/0.0; +https://github.com/4poc/feedability)",
      "Accept": "*/*"
    },
    "ignore_http_charset": true,
    "convert_charset": true
  },

  "cookies":
  {
    "activate": false,
    "whitelist": [],
    "type": "firefox_sqlite",
    "cookie_jar": "/home/user/.mozilla/firefox/abcdefgh.default/cookies.sqlite"
  },

  "ce":
  {
    "cache": true
  },

  "ce_single":
  {
    "cache": false
  },

  "filter":
  {
    "activate": true,
    "jquery_url": "http://code.jquery.com/jquery-1.4.2.min.js",
    "rules":
    {
      ".*":
      {
        "post": 
        {
          "replace": 
          {
            "(src|href)=('|\")?(\/)": "$1=$2%{URL_BASE}",
            "<script[^>]*>([\\s\\S]*?)</script>": " ",
            "onclick=\"[^\"]+\"": ""
          },
          "remove": ["object"]
        }
      },
      "heise.de": 
      {
        "pre": 
        {
          "remove": ["#mitte_rechts"]
        }
      },
      "carta.info": 
      {
        "pre": 
        {
          "remove": ["#commentblock"]
        }
      },
      "giessener-allgemeine.de": 
      {
        "prepend": [".fettvorspann"]
      }
    }
  },

  "cache":
  {
    "path": "./cache"
  },

  "log": 
  {
    "console": true,
    "stderr": false,
    "file": true,
    "file_seperate": false,
    "syncronized": false,
    "path": "./logs",
    "console_level": 3,
    "file_level": 4
  }

}
}
// built in libraries
var fs = require('fs'),
    http = require('http'),
    util = require('util');

// internal libraries
var log = new (require('./lib/log.js').Logger)('core'),
    func = require('./lib/func.js'),
    ProxyRequest = require('./lib/proxy.js').ProxyRequest;

// some variables used for the http server
var bind = cfg.get('proxy')['bind'];
var port = cfg.get('proxy')['port'];

// create the http server with the feed proxy
http.createServer(function(request, response) {

  try {
    var proxy_request = new ProxyRequest(request, response);
    proxy_request.process();    
  }
  catch(exception) {
    log.error('proxy request exception: '+exception);
  }

}).listen(port, bind);
console.log('http server listening on '+bind+' port '+port);
console.log('open a browser and try: http://127.0.0.1:'+port+'/\n');

