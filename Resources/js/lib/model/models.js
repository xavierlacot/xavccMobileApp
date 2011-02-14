// open database
joli.connection = new joli.Connection('xavcc');

var models = (function() {
  var m = {};

  // shorturl model
  m.shorturl = new joli.model({
    table:    'shorturl',
    columns:  {
      id:               'INTEGER',
      shorturl:         'TEXT',
      longurl:          'TEXT',
      viewcount:        'INTEGER',
      title:            'TEXT',
      position:         'INTEGER'
    }
  });

  return m;
})();