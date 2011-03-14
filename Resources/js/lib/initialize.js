/**
 * Allows to initialize the application, in case it has not been made before.
 */

if (!Titanium.App.Properties.hasProperty('site_name')) {
  Titanium.App.Properties.setString('site_name', 'xav.cc');
  Titanium.App.Properties.setString('site_url', 'http://xav.cc/');
}

Titanium.App.Properties.setString('api_url', 'http://api.xav.cc/');
Titanium.App.Properties.setString('api_user_agent', 'xavccMobileApp/2.0 (' + Titanium.Platform.name + '/' + Titanium.Platform.version + '; ' + Titanium.Platform.osname + '; ' + Titanium.Platform.locale + ')');

if (!Titanium.App.Properties.hasProperty('auto_copy')) {
  Titanium.App.Properties.setBool('auto_copy', true);
}

if (!Titanium.App.Properties.hasProperty('auto_paste')) {
  Titanium.App.Properties.setBool('auto_paste', true);
}

if (!Titanium.App.Properties.hasProperty('use_history')) {
  Titanium.App.Properties.setBool('use_history', true);
}