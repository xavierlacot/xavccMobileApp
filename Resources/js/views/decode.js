Ti.include('../../redux.js');
var win = Titanium.UI.currentWindow;

if (Titanium.Platform.name != 'android') {
  win.hideNavBar(); // full screen app
}

// label and first field
var l1a = Titanium.UI.createLabel({
	text:'Short url to decode*',
	width:260,
	height:35,
	top:90,
	left:30,
	color:'#fff',
	textAlign:'left'
});
var l1b = Titanium.UI.createLabel({
	text:Titanium.App.Properties.getString('site_url', 'http://xav.cc/'),
	width:100,
	height:35,
	top:120,
	left:30,
	color:'#fff',
	textAlign:'left'
});
var tf1 = Titanium.UI.createTextField({
	color:'#192578',
	height:35,
	top:120,
	left:130,
	width:160,
	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});

// second label, for the result
var l2 = Titanium.UI.createLabel({
	text:'',
	width:260,
	height:90,
	left:30,
	top:300,
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':17}
});

// submit button
var b1 = Titanium.UI.createButton({
	title:'Decode this short url',
	height:30,
	width:260,
	left:30,
	top:200
});

// define logic
var doDecode = function() {
  var alias = xavcc.trim(tf1.value);

  if (!alias) {
    alert('Please write an alias!');
    tf1.focus();
    return;
  }

  xavcc.decode(alias);
  tf1.blur();
};

// add event listeners
tf1.addEventListener('return', doDecode);
b1.addEventListener('click', doDecode);

Ti.App.addEventListener('xavcc.change_site_url', function(event) {
  l1b.text = event.title;
});

Ti.App.addEventListener('xavcc.decode.result', function(event) {
  xavcc.hideIndicator();
  var url = event.result;

  if (url) {
    if (url.indexOf('http://') == 0) {
      xavcc.showResponse(l2, url);

      if (Titanium.App.Properties.getBool('auto_copy', true)) {
        // put the expanded url in the clipboard
        Titanium.UI.Clipboard.setText(url);
      }

      var shorturl = Titanium.App.Properties.getString('site_url', 'http://xav.cc/') + xavcc.trim(tf1.value);

      if (Titanium.App.Properties.getBool('use_history', true) && !xavcc.url.has(shorturl)) {
        // save in the local database
        xavcc.url.save(url, shorturl);
      }
    } else if (url.length > 0) {
      // something went wrong : display an alert message
    	alert(url);
    } else {
      alert('no response found');
  	}
  }
});


win.add(l1a);
win.add(l1b);
win.add(tf1);
win.add(l2);
win.add(b1);