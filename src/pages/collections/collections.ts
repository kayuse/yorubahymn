import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { HymnDetailPage } from '../hymn-detail/hymn-detail';
import { HymnProvider } from '../../providers/hymn/hymn';

/**
 * Generated class for the CollectionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collections',
  templateUrl: 'collections.html',
})
export class CollectionsPage {
  public item : Object = {
    title : '',
    range : '',
    type : '',
  }
  private from : Number  = 0;
  private to : Number = 0;
  public hymns : Array<any> = [];
  @ViewChild(Navbar) navBar: Navbar; // add this line
  public imageUrl : String = ""
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public hymnService : HymnProvider
    ) {
  }
  ionViewWillEnter() {
    this.item = this.navParams.get('item');
    this.imageUrl = this.navParams.get('image');
    let range = this.item['range'].split('-');
    this.from = range[0];
    this.to = range[1];
    this.getHymns();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CollectionsPage');
    this.navBar.backButtonClick = (e: UIEvent) => {   /// add this event
      this.navCtrl.pop();
    };
  }
  getImageUrl(){
    return this.imageUrl;
  }
  editTitle(title: string) {
    if (title.length >= 30) {
      return title.substring(0, 29) + "....."
    }
    return title
  }

  openHymnDetail(hymn) {
    this.navCtrl.push(HymnDetailPage, {
      hymn: hymn
    });
  }

  getHymns(){
      let collectionRange = {
        from : this.from,
        to : this.to
      }
      this.hymnService.getCollectionHymns(collectionRange).then(result => {
        let rows = result.rows;
        for (let i = 0; i < rows.length; i++) {

          this.hymns.push(rows.item(i));
        }
      });
  }
  
  back() {
    this.navCtrl.pop();
  }
}
