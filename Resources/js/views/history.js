Ti.include('../../redux.js');
var win = Titanium.UI.currentWindow;

win.addEventListener('focus',function(e) {
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
      height: 50
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
      font: {fontSize:15},
      width: 'auto',
      textAlign: 'left',
      top: 5,
      left: 80,
      height: 18
    });
    row.add(title);
    var urllabel = Titanium.UI.createLabel({
      text: details_text,
      font: {fontSize:12},
      width: 'auto',
      textAlign: 'left',
      top: 30,
      left: 80,
      height: 14
    });
    row.add(urllabel);
    var poslabel = Titanium.UI.createLabel({
      text: shorturls[i].position,
      font: {fontSize:20, fontWeight:'bold'},
      width: 'auto',
      textAlign: 'right',
      top: 20,
      color: 'red',
      right: 40,
      height: 20
    });
    row.add(poslabel);

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

  // add the tableview
  var tableview = Titanium.UI.createTableView({
  	data: data, editable:true, moveable:true
  });

  // display short url screen
  tableview.addEventListener('click',function(e) {
		var win_details = Titanium.UI.createWindow({
			url: 'details.js',
			title: 'Short url details'
		});
		win_details.longurl = e.row.children[0].text;
		win_details.shorturl = e.row.children[1].text;
		Titanium.UI.currentTab.open(win_details, {animated:true});
  });

  // add move event listener
  tableview.addEventListener('move',function(e) {
    var from = e.fromIndex + 1;
    var to = e.index + 1;

    if (from != to)
    {
      if (from > to)
      {
        // select rows to reposition
        var rows = models.shorturl.all({

        });

          db.execute('SELECT * FROM URL WHERE POS >= ? and POS < ?', to, from);

        while (rows.isValidRow()) {
          var new_position = rows.fieldByName('pos') + 1;
          db.execute(
            'UPDATE URL SET POS = ? WHERE URL = ? AND SHURL = ?',
            new_position,
            rows.fieldByName('url'),
            rows.fieldByName('shurl')
          );
        	rows.next();
        }
      }
      else
      {
        // to > from
        // select rows to reposition
        var rows = db.execute('SELECT * FROM URL WHERE POS <= ? and POS > ?', to, from);

        while (rows.isValidRow()) {
          var new_position = rows.fieldByName('pos') - 1;
          db.execute(
            'UPDATE URL SET POS = ? WHERE URL = ? AND SHURL = ?',
            new_position,
            rows.fieldByName('url'),
            rows.fieldByName('shurl')
          );
        	rows.next();
        }
      }

      rows.close();
      db.execute(
        'UPDATE URL SET POS = ? WHERE URL = ? AND SHURL = ?',
        to,
        e.row.children[0].text,
        e.row.children[1].text
      );
      db.close();
    }
  });

  // add delete event listener
  tableview.addEventListener('delete',function(e) {
    var db = Titanium.Database.open('urldb');
    db.execute(
      'DELETE FROM URL WHERE URL = ? AND SHURL = ?',
      e.row.children[0].text,
      e.row.children[1].text
    );

    var rows = db.execute('SELECT * FROM URL ORDER BY POS ASC');
    var position = 1;

    while (rows.isValidRow()) {
      db.execute(
        'UPDATE URL SET POS = ? WHERE URL = ? AND SHURL = ?',
        position,
        rows.fieldByName('url'),
        rows.fieldByName('shurl')
      );
      position++;
    	rows.next();
    }

    rows.close();
    db.close();
  });

  win.add(tableview);

  //
  //  create edit/cancel buttons for nav bar
  //
  var edit = Titanium.UI.createButton({
  	title:'Edit'
  });

  edit.addEventListener('click', function()
  {
  	win.setRightNavButton(cancel);
  	tableview.editing = true;
  });

  var cancel = Titanium.UI.createButton({
  	title:'Done',
  	style:Titanium.UI.iPhone.SystemButtonStyle.DONE
  });
  cancel.addEventListener('click', function()
  {
  	win.setRightNavButton(edit);
  	tableview.editing = false;
  });

  win.setRightNavButton(edit);
});