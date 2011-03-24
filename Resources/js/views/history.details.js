Ti.include('../lib/vendor/joli.js/joli.js');
Ti.include('../lib/model/models.js');
Ti.include('../lib/xavcc.js');

var win = Titanium.UI.currentWindow;

// load url from db
var shorturl = models.shorturl.findOneBy('id', win.shorturlId);
xavcc.url.details(shorturl.shorturl);


var tableview = Titanium.UI.createTableView({
  backgroundColor: 'transparent',
  minRowHeight:50,
  separatorColor: 'transparent'
});
var row = Ti.UI.createTableViewRow({
  height:'auto',
  className:'row'
});
var view = Ti.UI.createView({
	height:'auto',
	width:'auto',
	layout:'vertical',
	left:0,
	top:10,
	bottom:10
});

if (shorturl.media) {
  var image = Titanium.UI.createImageView({
  	image:shorturl.media.replace(/\/small\//gi, '/large/'),
  	width:300,
   	left: 10,
  	height:225,
  	canScale: true
  });
  view.add(image);
}

// labels
var labelTitle = Titanium.UI.createLabel({
	text: xavcc.trim(shorturl.title),
	width:300,
	left:10,
	top: 15,
	height: 'auto',
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':20, fontWeight:'bold'}
});
view.add(labelTitle);
var labelDescription = Titanium.UI.createLabel({
	text: xavcc.trim(shorturl.description),
	width:300,
	left:10,
	top: 10,
	height: 'auto',
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':13}
});
view.add(labelDescription);

var labelShorturl = Titanium.UI.createLabel({
	text: 'Short url',
	width:300,
	left:10,
	top: 20,
	height: 'auto',
	color:'#fff',
	textAlign:'left',
	font:{fontSize:13, fontWeight:'bold'}
});
view.add(labelShorturl);
var labelShorturlValue = Titanium.UI.createLabel({
	text: shorturl.shorturl,
	width:300,
	left:10,
	top: 3,
	height: 'auto',
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':13}
});
view.add(labelShorturlValue);

var labelLongurl = Titanium.UI.createLabel({
	text:'Original url',
	width:300,
	left:10,
	top: 20,
	height: 'auto',
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':13, fontWeight:'bold'}
});
view.add(labelLongurl);
var labelLongurlValue = Titanium.UI.createLabel({
	text: xavcc.trim(shorturl.longurl),
	width:300,
	left:10,
	top: 3,
	height: 'auto',
	color:'#fff',
	textAlign:'left',
	font:{'fontSize':13}
});
view.add(labelLongurlValue);

// actions button
var actionButton = Titanium.UI.createButton();
actionButton.addEventListener('click', function() {
  var dialog = Titanium.UI.createOptionDialog({
    options: [
      'Show this page in Safari',
      'Copy the short url',
      'Copy the long url',
      'Cancel'
    ],
    cancel: 3
  });
  dialog.show();

  dialog.addEventListener('click', function(e) {
    if (0 == e.index) {
      Titanium.Platform.openURL(shorturl.shorturl);
    } else if (1 == e.index) {
      Titanium.UI.Clipboard.setText(shorturl.shorturl);
    } else if (2 == e.index) {
      Titanium.UI.Clipboard.setText(shorturl.longurl);
    }
  });
});

if (Titanium.Platform.name != 'android') {
  //  add the action button to the nav bar
  actionButton.systemButton = Titanium.UI.iPhone.SystemButton.ACTION;
  win.setRightNavButton(actionButton);
} else {
  // add the action button to the page
  actionButton.title = 'more';
  actionButton.top = 10;
  actionButton.right = 10;
  view.add(actionButton);
}

// display the view
row.add(view);
var data = [];
data.push(row);
tableview.setData(data);
win.add(tableview);