Ti.include('js/lib/vendor/joli/joli.js');
Ti.include('js/lib/model/models.js');
Ti.include('js/lib/initialize.js');
Ti.include('js/lib/install.js');
Ti.include('js/lib/xavcc.js');

if (Titanium.Platform.name != 'android') {
  Titanium.UI.iPhone.statusBarHidden = false;
}

// create tab group
var tabGroup = Titanium.UI.createTabGroup({barColor: '#273f95'});

if (Titanium.Platform.name == 'android') {
  tabGroup.softKeyboardOnFocus = Titanium.UI.Android.SOFT_KEYBOARD_HIDE_ON_FOCUS;

  tabGroup.addEventListener('focus', function(e) {
	  Ti.UI.Android.hideSoftKeyboard();
  });
}

// add windows and tabs
var win1 = Titanium.UI.createWindow({
    url:'js/views/encode.js',
    title:'Create a new short url',
    backgroundImage:'images/background.png'
});
var tab1 = Titanium.UI.createTab({
    icon:'images/icons/encode.png',
    title:'Encode',
    window:win1
});

var win2 = Titanium.UI.createWindow({
    url:'js/views/decode.js',
    title:'Decode a short url',
    backgroundImage:'images/background.png'
});
var tab2 = Titanium.UI.createTab({
    icon:'images/icons/decode.png',
    title:'Decode',
    window:win2
});

var win3 = Titanium.UI.createWindow({
    url:'js/views/history.js',
    title:'Short urls history',
    backgroundColor:'#fff'
});
var tab3 = Titanium.UI.createTab({
    icon:'images/icons/history.png',
    title:'History',
    window:win3
});

var win4 = Titanium.UI.createWindow({
    url:'js/views/settings.js',
    title:'Settings',
    backgroundImage:'images/background.png'
});
var tab4 = Titanium.UI.createTab({
    icon:'images/icons/config.png',
    title:'Settings',
    window:win4
});

//  add tabs
tabGroup.addTab(tab1);
tabGroup.addTab(tab2);
tabGroup.addTab(tab3);
tabGroup.addTab(tab4);

// open tab group
tabGroup.open();