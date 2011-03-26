# xavccMobileApp - an opensource mobile url shortening application #

## Introduction ##

xavccMobileApp is an opensource mobile url shortening application built on top of the mobile framework [Appcelerator Titanium Mobile](http://www.appcelerator.com/products/titanium-mobile-application-development/). The application uses the APIs provided by the url shortener [xav.cc](http://xav.cc/).

Might you want to give it a run, the application is available in the Apple AppStore and in the Android Market:

 * [URL shortener xav.cc on the Apple Store](http://xav.cc/iphone);
 * [URL shortener xav.cc on the Android Market](http://xav.cc/android);


## Download and install ##

 * Grab the source from GitHub:
   * download the project: [https://github.com/xavierlacot/xavccMobileApp](https://github.com/xavierlacot/xavccMobileApp),
   * take care that there is an external dependancy to the [javascript ORM "joli.js"](https://github.com/xavierlacot/joli.js) in the folder `Resources/js/lib/vendor/joli.js`.
 * Import the project in Titanium Developer. Make sure the Iphone and Android SDKs are installed
 * compile the application, fork it, push it! :)


## Conception ##

The application uses the APIs provided by the url shortener xav.cc. It is built using a `TabGroup` binding the four main windows, which code resides in `Resources/js/views`.

The main business logic is written in `Resoures/js/lib/xav.cc`.

The project uses the javascript ORM "joli.js" in order to save shortened urls and their detail in a "`shorturl`" table on the mobile device. The model is described in the file `Resoures/js/lib/model/models.js`.

## Credits and license ##

This application has been developed by [Xavier Lacot](http://lacot.org/) and is licensed under the MIT license.