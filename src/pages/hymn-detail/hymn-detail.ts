import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';

/**
 * Generated class for the HymnDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-hymn-detail',
  templateUrl: 'hymn-detail.html',
})
export class HymnDetailPage {
  @ViewChild(Navbar) navBar: Navbar; // add this line
  feed: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HymnDetailPage');
    this.navBar.backButtonClick = (e: UIEvent) => {   /// add this event
      this.navCtrl.pop();
    };
  }
  back(){
    this.navCtrl.pop();
  }

}
