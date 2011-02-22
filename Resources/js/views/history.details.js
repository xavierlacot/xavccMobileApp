Ti.include('../../redux.js');
var win = Titanium.UI.currentWindow;

// load url from db
var shorturl = models.shorturl.findOneBy('id', win.shorturlId);
xavcc.url.details(shorturl.shorturl);

var scrollView = Titanium.UI.createScrollView({
  contentWidth:320,
  contentHeight:'auto',
  top:0,
  left:0,
  showVerticalScrollIndicator:true,
  showHorizontalScrollIndicator:false
});
var mediaHeigh;

if (shorturl.media) {
  var image = Titanium.UI.createImageView({
  	image:shorturl.media.replace(/\/small\//gi, '/large/'),
  	width:300,
  	height:225,
  	top:10,
  	left: 10,
  	canScale: true
  });
  scrollView.add(image);
  mediaHeight = 225;
} else {
  mediaHeight = 0;
}

// labels
if (Titanium.Platform.name != 'android') {
  var labelTitle = Titanium.UI.createLabel({
  	text: xavcc.trim(shorturl.title),
  	width:300,
  	height: 'auto',
  	top:25 + mediaHeight,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':20, fontWeight:'bold'}
  });
  scrollView.add(labelTitle);
  var labelDescription = Titanium.UI.createLabel({
  	text: xavcc.trim(shorturl.description),
  	width:300,
  	height: 'auto',
  	top:35 + mediaHeight + labelTitle.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13}
  });
  scrollView.add(labelDescription);

  var labelShorturl = Titanium.UI.createLabel({
  	text: 'Short url',
  	width:300,
  	height: 'auto',
  	top:65 + mediaHeight + labelTitle.height + labelDescription.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{fontSize:13, fontWeight:'bold'}
  });
  scrollView.add(labelShorturl);
  var labelShorturlValue = Titanium.UI.createLabel({
  	text: shorturl.shorturl,
  	width:300,
  	height: 'auto',
  	top:80 + mediaHeight + labelTitle.height + labelDescription.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13}
  });
  scrollView.add(labelShorturlValue);

  var labelLongurl = Titanium.UI.createLabel({
  	text:'Original url',
  	width:300,
  	height: 'auto',
  	top:95 + mediaHeight + labelTitle.height + labelDescription.height + labelShorturl.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13, fontWeight:'bold'}
  });
  scrollView.add(labelLongurl);
  var labelLongurlValue = Titanium.UI.createLabel({
  	text: xavcc.trim(shorturl.longurl),
  	width:300,
  	height: 'auto',
  	top:110 + mediaHeight + labelTitle.height + labelDescription.height + labelShorturl.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13}
  });
  scrollView.add(labelLongurlValue);
} else {
  // android, add labels first, then set their height and top

  var labelTitle = Titanium.UI.createLabel({
  	text: xavcc.trim(shorturl.title),
  	width:300,
  	top:25 + mediaHeight,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':20, fontWeight:'bold'}
  });
  scrollView.add(labelTitle);
  var labelDescription = Titanium.UI.createLabel({
  	text: xavcc.trim(shorturl.description),
  	width:300,
  	top:35 + mediaHeight + labelTitle.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13}
  });
  scrollView.add(labelDescription);

  var labelShorturl = Titanium.UI.createLabel({
  	text: 'Short url',
  	width:300,
  	top:65 + mediaHeight + labelTitle.height + labelDescription.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{fontSize:13, fontWeight:'bold'}
  });
  scrollView.add(labelShorturl);
  var labelShorturlValue = Titanium.UI.createLabel({
  	text: shorturl.shorturl,
  	width:300,
  	top:80 + mediaHeight + labelTitle.height + labelDescription.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13}
  });
  scrollView.add(labelShorturlValue);

  var labelLongurl = Titanium.UI.createLabel({
  	text:'Original url',
  	width:300,
  	top:95 + mediaHeight + labelTitle.height + labelDescription.height + labelShorturl.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13, fontWeight:'bold'}
  });
  scrollView.add(labelLongurl);
  var labelLongurlValue = Titanium.UI.createLabel({
  	text: xavcc.trim(shorturl.longurl),
  	width:300,
  	top:110 + mediaHeight + labelTitle.height + labelDescription.height + labelShorturl.height,
  	left: 10,
  	color:'#fff',
  	textAlign:'left',
  	font:{'fontSize':13}
  });
  scrollView.add(labelLongurlValue);
}


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
  scrollView.add(actionButton);
}

win.add(scrollView);