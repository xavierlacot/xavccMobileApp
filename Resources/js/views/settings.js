Ti.include('../lib/vendor/joli/joli.js');
Ti.include('../lib/model/models.js');
Ti.include('../lib/xavcc.js');

var win = Titanium.UI.currentWindow;
win.backgroundImage = '../../images/background.png';

// history
var row1 = Ti.UI.createTableViewRow({height:45});
var l1 = Ti.UI.createLabel({
	text:'save short urls to history',
	font: { fontSize: 14 },
	left: 10,
	width: 160
});
row1.add(l1);
var sw1 = Ti.UI.createSwitch({
	right:10,
	value:Titanium.App.Properties.getBool('use_history', true)
});
row1.add(sw1);

// auto-copy
var row2 = Ti.UI.createTableViewRow({height:45});
var l2 = Ti.UI.createLabel({
	text:'auto-copy to clipboard',
	font: { fontSize: 14 },
	left: 10,
	width: 160
});
row2.add(l2);
var sw2 = Ti.UI.createSwitch({
	right:10,
	value:Titanium.App.Properties.getBool('auto_copy', true)
});
row2.add(sw2);

// auto-paste
var row3 = Ti.UI.createTableViewRow({height:45});
var l3 = Ti.UI.createLabel({
	text:'auto-paste on launch',
	font: { fontSize: 14 },
	left: 10,
	width: 160
});
row3.add(l3);
var sw3 = Ti.UI.createSwitch({
	right:10,
	value:Titanium.App.Properties.getBool('auto_paste', false)
});
row3.add(sw3);

// prefered domain
var row4 = Ti.UI.createTableViewRow({height:45});
var l4 = Ti.UI.createLabel({
	text:'prefered short domain',
	font: { fontSize: 14 },
	left: 10,
	width: 160
});
var b4 = Titanium.UI.createButton({
	title:Titanium.App.Properties.getString('site_name'),
	height:40,
	width:58,
	right:10
});
row4.add(l4);
row4.add(b4);

// clear local history
var row5 = Ti.UI.createTableViewRow({height:45});
var l5 = Ti.UI.createLabel({
	text:'clear local history',
	font: { fontSize: 14 },
	left: 10,
	width: 160
});
var b5 = Titanium.UI.createButton({
	title:'clear',
	height:40,
	width:58,
	right:10
});
row5.add(l5);
row5.add(b5);


// add about field
var button_about = Titanium.UI.createButton({
	title:'about',
	height:40,
	width:300,
	right:10,
	top: 300
});


// table view
var tableViewOptions1 = {
	data: [row1,row2,row3,row4,row5],
	style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
	backgroundColor:'transparent',
	rowBackgroundColor:'white',
	moveable: false,
	top:0
};
var tableView1 = Titanium.UI.createTableView(tableViewOptions1);
tableView1.addEventListener('click', function(e) {});
win.add(tableView1);


if (Titanium.Platform.name != 'android') {
  // url shortener picker
  var cancel =  Titanium.UI.createButton({
  	title:'Cancel',
  	style:Titanium.UI.iPhone.SystemButtonStyle.BORDERED
  });
  var done =  Titanium.UI.createButton({
  	title:'Done',
  	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
  });
  var spacer =  Titanium.UI.createButton({
  	systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
  });
  var toolbar =  Titanium.UI.createToolbar({
  	top:0,
  	items:[cancel,spacer,done]
  });
  var picker_view = Titanium.UI.createView({
  	height:251,
  	bottom:-251
  });
  var picker = Titanium.UI.createPicker({
  	top:43
  });
  picker.selectionIndicator = true;
  var shorteners = [
    Titanium.UI.createPickerRow({title: 'xav.cc'}),
    Titanium.UI.createPickerRow({title: 'xa.vc'})
  ];
  picker.add(shorteners);
  picker_view.add(toolbar);
  picker_view.add(picker);
  win.add(picker_view);
  var slide_in = Titanium.UI.createAnimation({bottom:0});
  var slide_out = Titanium.UI.createAnimation({bottom:-251});
  var show_picker = function() {
    button_about.hide();
  	picker_view.animate(slide_in);
  };
  var hide_picker = function() {
    button_about.show();
  	picker_view.animate(slide_out);
  };
  b4.addEventListener('click', show_picker);
  cancel.addEventListener('click', function() {
  	hide_picker();
  });
  done.addEventListener('click', function() {
    var url = picker.getSelectedRow(0).title;
  	Titanium.App.Properties.setString('site_name', url);
  	Titanium.App.Properties.setString('site_url', 'http://' + url + '/');
  	b4.title = url;
    Ti.App.fireEvent('xavcc.change_site_url', { title: 'http://' + url + '/' });
  	hide_picker();
  });
} else {
  // on android, use an option dialog
  b4.addEventListener('click', function(e) {
    var dialog = Titanium.UI.createOptionDialog({
      title: 'Which url shortener domain do you wan to use by default?',
      options: ['xav.cc', 'xa.vc'],
      cancel: 0
    });
    dialog.show();

    dialog.addEventListener('click', function(e) {
      var url;

      if (0 == e.index) {
        url = 'xav.cc';
      } else if (1 == e.index) {
        url = 'xa.vc';
      }

    	Titanium.App.Properties.setString('site_name', url);
    	Titanium.App.Properties.setString('site_url', 'http://' + url + '/');
    	b4.title = url;
      Ti.App.fireEvent('xavcc.change_site_url', { title: 'http://' + url + '/' });
    });
  });
}

win.add(button_about);

// add event listeners
sw1.addEventListener('change', function(e) {
	Titanium.App.Properties.setBool('use_history', e.value);
});
sw2.addEventListener('change', function(e) {
	Titanium.App.Properties.setBool('auto_copy', e.value);
});
sw3.addEventListener('change', function(e) {
	Titanium.App.Properties.setBool('auto_paste', e.value);
});

b5.addEventListener('click', function(e) {
  var dialog = Titanium.UI.createOptionDialog({
    title: 'If you empty the local short url history, all the short urls will be removed from the application, but not from xav.cc. Are you sure that you really want to clear the local history?',
    options: ['Yes, clear the local short url history', 'No, cancel'],
    cancel: 0
  });
  dialog.show();

  dialog.addEventListener('click', function(e) {
    if (0 == e.index) {
      xavcc.url.clear();
    }
  });
});

button_about.addEventListener('click', function(e) {
  var dialog = Titanium.UI.createOptionDialog({
    title: 'This application is provided by xav.cc. Please visit our website for more informations.',
    options: ['Visit xav.cc', 'No, thank you'],
    cancel: 0
  });
  dialog.show();

  dialog.addEventListener('click', function(e) {
    if (0 == e.index) {
      Titanium.Platform.openURL('http://xav.cc/info/about');
    }
  });
});