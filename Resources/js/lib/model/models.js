// open database
joli.connection = new joli.Connection('xavcc');

var getMaxPosition = function() {
  var q = new joli.query()
    .select('max(shorturl.position) as max')
    .from('shorturl');
  var result = q.execute();

  if (!result.length) {
    return 0;
  } else {
    if (null == result[0].max) {
      return 0;
    }

    return parseInt(result[0].max);
  }
}

// define the models
var models = (function() {
  var m = {};

  // shorturl model
  m.shorturl = new joli.model({
    table:    'shorturl',
    columns:  {
      id:               'INTEGER',
      created_at:       'TEXT',
      longurl:          'TEXT',
      media:            'TEXT',
      position:         'INTEGER',
      shorturl:         'TEXT',
      title:            'TEXT',
      updated_at:       'TEXT',
      viewcount:        'INTEGER'
    },
    methods:  {
      getMaxPosition:   getMaxPosition
    }
  });

  return m;
})();