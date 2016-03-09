import {App, Platform} from 'ionic-angular';
import {ConferenceData} from './providers/conference-data';
import {UserData} from './providers/user-data';
//import {HomePage} from './pages/home/home';
import {SlidePage} from './pages/slides/slide';

// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


@App({
  templateUrl: './build/app.html',
  providers: [ConferenceData, UserData],
  config: {} // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  rootPage: Type = SlidePage;

  constructor(platform: Platform, confData: ConferenceData) {
    // load the conference data
    confData.load();

    platform.ready().then(() => {
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }
}
