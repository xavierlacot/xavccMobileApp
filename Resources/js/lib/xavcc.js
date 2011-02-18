var xavcc = (function() {
  var api = {};
  api.url = {};

  api.createClient = function() {
    var client = Titanium.Network.createHTTPClient();
	  client.timeout = 10000;  // 10 s. timeout
    return client;
  };

  api.decode = function(alias) {
  	var escapedUrl = api.encodeUrl(alias);
    var url = Titanium.App.Properties.getString('api_url', 'http://api.xav.cc/');
    url = url + 'simple/decode?alias=' + escapedUrl;
    log('decode using: ' + url);

    // create http client
    var client = api.createClient();

    client.onreadystatechange = function() {
      if (this.readyState == 4) {
        Ti.App.fireEvent('xavcc.decode.result', { result: this.responseText });
      }
    };

    if (Titanium.Platform.name != 'android') {
      client.open('GET', url, true);
    } else {
      client.open('GET', url, false);
    }

    this.showIndicator();
    client.send(null);
  };


  api.encode = function(longurl, alias) {
    // first, search in the local history if enabled

    // else shorten the value
  	var escapedUrl = api.encodeUrl(longurl);
    var url = Titanium.App.Properties.getString('api_url', 'http://api.xav.cc/');
    url = url + 'simple/encode?url=' + escapedUrl;
    log('encode using: ' + url);

    if (alias) {
      url = url + '&alias=' + api.encodeUrl(alias);
    }

    // create http client
    var client = api.createClient();

    client.onreadystatechange = function() {
      if (this.readyState == 4) {
        Ti.App.fireEvent('xavcc.encode.result', { result: this.responseText });
      }
    };

    if (Titanium.Platform.name != 'android') {
      client.open('GET', url, true);
    } else {
      client.open('GET', url, false);
    }

    this.showIndicator();
    client.send(null);
  };


  api.encodeUrl = function(url) {
    if (!url) {
      return '';
    }

    return encodeURIComponent(url).replace( /%2F/g, '/');
  };


  api.hideIndicator = function() {
    if ((Titanium.Platform.name != 'android') && Titanium.UI.currentWindow) {
    	Titanium.UI.currentWindow.setToolbar(null,{animated:true});
    }
  };


  api.parseDate = function(dt) {
  var hit = dt.match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})/);

  if (hit && hit.length === 7) {
    return new Date(
       Number(hit[1]),
       Number(hit[2]) - 1,
       Number(hit[3]),
       Number(hit[4]),
       Number(hit[5]),
       Number(hit[6]));
  } else {
    return false;
  };
}


  api.showIndicator = function() {
    var toolActInd;

    if ((Titanium.Platform.name != 'android') && Titanium.UI.currentWindow) {
      toolActInd = Titanium.UI.createActivityIndicator();
    	toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
    	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
    	toolActInd.color = 'white';
    	toolActInd.message = 'Loading...';
    	Titanium.UI.currentWindow.setToolbar([toolActInd],{animated:true});
    	toolActInd.show();
    }

    if ((Titanium.Platform.name == 'android') && Titanium.UI.currentWindow) {
      toolActInd = Titanium.UI.createActivityIndicator({
      	bottom:10,
      	height:50,
      	width:10,
      	style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN
      });
      Titanium.UI.currentWindow.add(toolActInd);
    	toolActInd.show();
    	toolActInd.message = 'Loading...';

    	setTimeout(function() {
    		toolActInd.hide();
    	}, 1000);
    }
  };


  api.showResponse = function(label, shorturl) {
    var length = Math.max(8, Math.min(30, shorturl.length));
    var size = Math.ceil(12 + (30 - length) * (15 / 10));
    label.font = {'fontSize':size};
    label.text = shorturl;
  };


  api.strpos = function (haystack, needle) {
    var i = (haystack + '').indexOf(needle, 0);
    return i === -1 ? false : i;
  };


  api.trim = function(str) {
    if (!str) {
      return str;
    }

  	str = str.replace(/^\s+/, '');

  	for (var i = str.length - 1; i >= 0; i--) {
  		if (/\S/.test(str.charAt(i))) {
  			str = str.substring(0, i + 1);
  			break;
  		}
  	}

  	return str;
  };


  api.ucfirst = function(text) {
    if (!text) {
      return text;
    }

    return text.charAt(0).toUpperCase() + text.substr(1);
  };


  api.url.details = function(shorturl) {
    var model = joli.models.get('shorturl');
    var item = model.findOneBy('shorturl', shorturl);

    if (!item || (item.length == 0)) {
      return;
    }

    // compute the difference between item creation and last update date
    var diff = parseInt(item.updated_at) - parseInt(item.created_at);

    if ((item.title == null) && (item.created_at == null || (diff < 300 * 1000))) {
      // if the title is null, and the item has never been updated or its
      // update time has been made less than 2 minutes after it was created,
      // load from REST service
      var alias = shorturl.slice(api.strpos(shorturl, 'c/') + 2);
      var url = Titanium.App.Properties.getString('api_url', 'http://api.xav.cc/');
      url = url + 'sf_short_url?shorturl=' + alias;
      log('get details using: ' + url);

      // create http client
      var client = api.createClient();

      client.onreadystatechange = function() {
        if (this.readyState == 4) {
          // parse the response
          var item = joli.jsonParse(this.responseText);

          if (item && item.length > 0) {
            // build the update array
            item = item[0];
            var date = new Date();
            var updated_at = date.getTime() + (date.getTimezoneOffset() * 60000);
            var created_at = api.parseDate(item.created_at);

            if (created_at) {
              created_at = created_at.getTime();
            }

            var update = {
              viewcount:  item.viewcount,
              title:      item.title,
              created_at: created_at,
              updated_at: updated_at
            };

            if (item.screencapture) {
              var media_url = item.screencapture.small.slice(0, api.strpos(item.screencapture.small, '?'));
              update.media = media_url;
            }

            // execute the update
            var q = new joli.query()
              .update('shorturl')
              .set(update)
              .where('shorturl = ?', shorturl);
            q.execute();
          }
        }
      };

      if (Titanium.Platform.name != 'android') {
        client.open('GET', url, true);
      } else {
        client.open('GET', url, false);
      }

      client.send(null);
    }
  };

  api.url.has = function(shorturl) {
    return new joli.query()
    .count()
    .from('shorturl')
    .where('shorturl.shorturl = ?', shorturl)
    .execute();
  };

  api.url.save = function(longurl, shorturl) {
    var model = joli.models.get('shorturl');
    var item = {
      longurl:   longurl,
      shorturl:  shorturl,
      position:  (model.getMaxPosition() + 1)
    };
    log(item);
    model.newRecord(item).save();
  };


  return api;
})();