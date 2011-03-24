Ti.include('../lib/vendor/joli.js/joli.js');
Ti.include('../lib/model/models.js');
Ti.include('../lib/xavcc.js');

var win = Titanium.UI.currentWindow;
win.backgroundImage = '../../images/background.png';

// add the tableview
var tableview = Titanium.UI.createTableView({
	editable:true, moveable:true, backgroundColor: '#fff'
});

// display short url screen
tableview.addEventListener('click',function(e) {
	var win_details = Titanium.UI.createWindow({
		url: '/js/views/history.details.js',
		title: 'Short url details',
		shorturlId: e.row.shorturlId,
    fullscreen: false,
    navBarHidden: false,
    backgroundImage:'../../images/background.png'
	});
	Titanium.UI.currentTab.open(win_details, {animated:true});
});

// add move event listener
tableview.addEventListener('move', function(e) {
  var from = e.fromIndex + 1;
  var to = e.index + 1;
  var q;

  if (from != to)
  {
    if (from > to)
    {
      // move rows one position after
      q = new joli.query()
        .update('shorturl')
        .set({'position = position + 1': ''})
        .where('position >= ?', to)
        .where('position < ?', from);
      q.execute();
    }
    else
    {
      // to > from
      // move rows one position before
      q = new joli.query()
        .update('shorturl')
        .set({'position = position - 1': ''})
        .where('position <= ?', to)
        .where('position > ?', from);
      q.execute();
    }

    // move the shorturl to its new position
    q = new joli.query()
      .update('shorturl')
      .set({'position': to})
      .where('id = ?', e.row.shorturlId);
    q.execute();
  }
});

// add delete event listener
tableview.addEventListener('delete',function(e) {
  // delete this row
  var shorturl = models.shorturl.findOneById(e.row.shorturlId);
  var q = new joli.query()
    .destroy()
    .from('shorturl')
    .where('id = ?', e.row.shorturlId);
  q.execute();

  // move rows before
  q = new joli.query()
    .update('shorturl')
    .set({'position = position - 1': ''})
    .where('position > ?', shorturl.position);
  q.execute();
});

win.add(tableview);

if (Titanium.Platform.name != 'android') {
  //  create edit/cancel buttons for nav bar
  var edit = Titanium.UI.createButton({
  	title:'Edit'
  });
  var cancel = Titanium.UI.createButton({
  	title:'Done',
  	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
  });
  edit.addEventListener('click', function() {
  	win.setRightNavButton(cancel);
  	tableview.editing = true;
  });
  cancel.addEventListener('click', function() {
  	win.setRightNavButton(edit);
  	tableview.editing = false;
  });
  win.setRightNavButton(edit);
}

var loadHistory = function() {
  var shorturls = models.shorturl.all({
    order: ['position asc']
  });
  var data = [];
  var title_text;
  var details_text;
  var i = 0;

  while (i < shorturls.length) {
    xavcc.url.details(shorturls[i].shorturl);
    var row = Ti.UI.createTableViewRow({
      hasChild: true,
      height: 50,
      shorturlId: shorturls[i].id
    });

    if (shorturls[i].title != '') {
      title_text = shorturls[i].title;
      details_text = shorturls[i].longurl;
    } else {
      title_text = shorturls[i].longurl;
      details_text = shorturls[i].shorturl;
    }

    var title = Titanium.UI.createLabel({
      text: title_text,
      color: '#000',
      font: {fontSize:15},
      width: 'auto',
      textAlign: 'left',
      top: 5,
      left: 80,
      height: 22
    });
    row.add(title);
    var urllabel = Titanium.UI.createLabel({
      text: details_text,
      color: '#000',
      font: {fontSize:12},
      width: 'auto',
      textAlign: 'left',
      top: 30,
      left: 80,
      height: 18
    });
    row.add(urllabel);
/*
    var poslabel = Titanium.UI.createLabel({
      text: shorturls[i].id + ' - ' + shorturls[i].position,
      font: {fontSize:20, fontWeight:'bold'},
      width: 'auto',
      textAlign: 'right',
      top: 20,
      color: 'red',
      right: 40,
      height: 20
    });
    row.add(poslabel);
*/
    if (shorturls[i].media) {
      var image = Titanium.UI.createImageView({
      	image:shorturls[i].media,
      	width:66,
      	height:50,
      	top:0,
      	left: 0,
      	canScale: true,
      	zIndex:1000
      });
      row.add(image);
    }

    row.className = 'shorturl_row';
  	data.push(row);
  	i++;
  }

  tableview.data = data;
};

win.addEventListener('focus',function(e) {
  loadHistory();
});

win.tabGroup.addEventListener('focus',function(e) {
  loadHistory();
});

Ti.App.addEventListener('xavcc.url.saved',function(e) {
  // update when new url is saved (for android, which doesn't fire focus event each time the win is focused)
  loadHistory();
});