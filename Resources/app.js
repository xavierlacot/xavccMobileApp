Ti.include('redux.js');
includeGlobal('js/lib/vendor/joli.js/joli.js');
includeGlobal('js/lib/model/models.js');
Ti.include('js/lib/initialize.js');
Ti.include('js/lib/install.js');
includeGlobal('js/lib/xavcc.js');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

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

tabGroup.addEventListener('focus', function(e) {
  if (Titanium.Platform.name != 'android') {
    if (e.index < 2) {
      Titanium.UI.iPhone.statusBarHidden = true;
    } else {
      Titanium.UI.iPhone.statusBarHidden = false;
    }
  }
});

// open tab group
tabGroup.open();