Ti.include('../lib/vendor/joli.js/joli.js');
Ti.include('../lib/model/models.js');
Ti.include('../lib/xavcc.js');

var win = Titanium.UI.currentWindow;
win.backgroundImage = '../../images/background.png';

// label and first field
var l1 = Titanium.UI.createLabel({
	text:'Paste a long url*',
	width:260,
	height:35,
	top:40,
	left:30,
	color:'#fff',
	textAlign:'left'
});
var tf1 = Titanium.UI.createTextField({
	hintText:'type or paste here a valid url',
	color:'#192578',
	height:40,
	top:70,
	left:30,
	width:260,
	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	keyboardType:Titanium.UI.KEYBOARD_URL,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
	clearButtonMode:Titanium.UI.INPUT_BUTTONMODE_ONFOCUS
});
if (Titanium.UI.Clipboard.hasText() && Titanium.App.Properties.getBool('auto_paste', false)) {
  var text = Titanium.UI.Clipboard.getText();
  if ((text.indexOf('http') == 0) && (text.indexOf('http://xav.cc/') != 0) && (text.indexOf('http://xa.vc/') != 0)) {
    tf1.value = text;
  }
}

// labels and field for the optionnal alias
var l2a = Titanium.UI.createLabel({
	text:'Your own alias',
	width:260,
	height:35,
	top:120,
	left:30,
	color:'#fff',
	textAlign:'left'
});
var l2b = Titanium.UI.createLabel({
	text:Titanium.App.Properties.getString('site_url', 'http://xav.cc/'),
	font: {fontSize:15},
	width:120,
	height:40,
	top:150,
	left:30,
	color:'#fff',
	textAlign:'left'
});
var tf2 = Titanium.UI.createTextField({
	hintText:'(optional)',
	color:'#192578',
	height:40,
	top:150,
	left:130,
	width:160,
	autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
	returnKeyType:Titanium.UI.RETURNKEY_DEFAULT,
	borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
});

// second label, for the result
var l3 = Titanium.UI.createLabel({
	text:'',
	width:260,
	height:'auto',
	top:300,
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':23}
});

// submit button
var b1 = Titanium.UI.createButton({
	title:'Shorten this url',
	height:40,
	width:260,
	left:30,
	top:220
});

// define logic
var doShorten = function() {
  var longurl = xavcc.trim(tf1.value);
  var alias = xavcc.trim(tf2.value);

  if (!longurl) {
    tf1.blur();
    return;
  }

  xavcc.encode(longurl, alias);
  tf1.blur();
  tf2.blur();
};

// add event listeners
tf1.addEventListener('return', doShorten);
tf2.addEventListener('return', doShorten);
b1.addEventListener('click', doShorten);

Ti.App.addEventListener('xavcc.change_site_url', function(event) {
  l2b.text = event.title;
});

Ti.App.addEventListener('xavcc.encode.result', function(event) {
  xavcc.hideIndicator();

  if (event.result && event.result.indexOf('http://') == 0) {
    var alias = event.result.slice(xavcc.strrpos(event.result, '/', 7) + 1);
    var url = Titanium.App.Properties.getString('site_url', 'http://xav.cc/') + alias;
    xavcc.showResponse(l3, url);

    if (Titanium.App.Properties.getBool('auto_copy', true)) {
      // put the shortened url in the clipboard
      Titanium.UI.Clipboard.setText(url);
    }

    if (Titanium.App.Properties.getBool('use_history', true) && !xavcc.url.has(alias)) {
      // save in the local database
      Titanium.API.log('info', 'saving url ' + url);
      var longurl = xavcc.trim(tf1.value);
      xavcc.url.save(longurl, url);
    }
  } else {
    // something went wrong : display an alert message
    if (event.result) {
  		alert(event.result);
    } else {
      alert('Something went wrong, please check that you are connected to internet. Apologies for the inconvenience.');
    }
	}
});

win.add(b1);
win.add(l1);
win.add(tf1);
win.add(l2a);
win.add(l2b);
win.add(tf2);
win.add(l3);