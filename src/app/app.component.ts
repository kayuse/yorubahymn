import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = IntroPage;
  loader:any

  constructor(platform: Platform, public loadingCtrl: LoadingController, public storage: Storage,statusBar: StatusBar, splashScreen: SplashScreen) {
    //this.presentLoading();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
     // statusBar.styleDefault();
     // splashScreen.hide();

      this.storage.get('appIntroShown').then((result) => {
        //console.log(result);
        if(result){
          this.rootPage = TabsPage;
        } else {
          this.rootPage = IntroPage;
          this.storage.set('introShown', true);
        }
 
        //this.loader.dismiss();
 
      });
    });
  }
  presentLoading() {
 
    this.loader = this.loadingCtrl.create({
      content: "Loading..."
    });
 
    this.loader.present();
 
  }
}
