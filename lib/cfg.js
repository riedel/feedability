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

/**
 * Module provides methods for accessing the json based configuration
 * settings.
 * 
 * @fileOverview
 */

// built in libraries
var fs = require('fs'),
    util = require('util');

// external libraries
var func = require('./func.js');

var settings = {
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
    "file": false,
    "console_level": 3,
    "file_level": 4
  }

};

// load the configuration settings
function load() {
  if(settings == null) {
    console.log('[load settings.json file]');
    settings = JSON.parse(fs.readFileSync('settings.json', 'utf8'));
    if(func.file_exists('user_settings.json')) {
      console.log('[found and load the user_settings.json file]');
      var user_settings = JSON.parse(
        fs.readFileSync('user_settings.json', 'utf8')
      );

      settings = func.object_merge(settings, user_settings);
    }
    
    // merge log settings:
    var Logger = require('./log.js').Logger;
    if(settings.log) {
      Logger.merge_options(settings.log);
    }
    var log = new Logger('cfg');
    log.info('configuration options merged');
  }
}
load();

function get(key) {
  return settings[key];
}
exports.get = get;
