var xavcc = (function() {
  var api = {};

  // create http client
  var client = Titanium.Network.createHTTPClient();
	client.timeout = 10000;  // 10 s. timeout


  api.decode = function(alias) {
  	var escapedUrl = api.encodeUrl(alias);
    var url = Titanium.App.Properties.getString('api_url', 'http://api.xav.cc/');
    url = url + 'simple/decode?alias=' + escapedUrl;

    client.onreadystatechange = function() {
      Titanium.API.log('this.readyState: ' + this.readyState, 'info');
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
  	var escapedUrl = api.encodeUrl(longurl);
    var url = Titanium.App.Properties.getString('api_url', 'http://api.xav.cc/');
    url = url + 'simple/encode?url=' + escapedUrl;

    if (alias) {
      url = url + '&alias=' + api.encodeUrl(alias);
    }

    client.onreadystatechange = function() {
      Titanium.API.log('this.readyState: ' + this.readyState, 'info');
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


  api.showIndicator = function() {
    var toolActInd;

    if ((Titanium.Platform.name != 'android') && Titanium.UI.currentWindow) {
      toolActInd = Titanium.UI.createActivityIndicator();
    	toolActInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN;
    	toolActInd.font = {fontFamily:'Helvetica Neue', fontSize:15,fontWeight:'bold'};
    	toolActInd.color = 'white';
    	toolActInd.message = 'Chargement...';
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


  return api;
})();