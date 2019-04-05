import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, LoadingController } from 'ionic-angular';
import { HymnProvider } from '../../providers/hymn/hymn';
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
  public hymn: Object = {};
  public verses: Array<Object> = [];
  @ViewChild(Navbar) navBar: Navbar; // add this line
  feed: any;
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public hymnService: HymnProvider, public loadingCtrl: LoadingController, ) {

  }
  ionViewWillEnter() {
    let hymn = this.navParams.get('hymn');
    this.hymn = hymn;

    this.hymnService.getVerse(this.hymn['id']).then(result => {
      let rows = result.rows;
      for (let i = 0; i < rows.length; i++) {
        this.verses.push(rows.item(i));
      }
    }).catch(error => {
      console.error(error);
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad HymnDetailPage');
    this.navBar.backButtonClick = (e: UIEvent) => {   /// add this event
      this.navCtrl.pop();
    };
  }
  back() {
    this.navCtrl.pop();
  }

}
