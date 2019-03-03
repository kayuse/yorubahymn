import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { HttpClient } from '@angular/common/http';
import { HymnProvider } from '../../providers/hymn/hymn';


/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  @ViewChild('slides') slides: Slides;
  loader: any;

  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public storage: Storage, public navParams: NavParams,
    public hymnService: HymnProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }
  goToHome() {
    //this.presentLoading();
  //  this.loadHymns();
    //this.loader.dismiss();
  }
  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Preparing Your Hymns..."
    });

    this.loader.present();

  }

  loadHymns() {
    let response = this.hymnService.loadHymns();
    response.then(data => {
      
      this.loader.dismiss();
      this.storage.set('appIntShown', true)
      this.navCtrl.push(TabsPage);

    }).catch(error => {

    })
    this.loader.dismiss();
    this.storage.set('appInitShown', true)
    this.navCtrl.push(TabsPage);

  }
}
