import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HymnProvider } from '../../providers/hymn/hymn';
import { HymnDetailPage } from '../hymn-detail/hymn-detail';
import { CollectionsPage } from '../collections/collections';
/**
 * Generated class for the CollectionHymnPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-collection-hymn',
  templateUrl: 'collection-hymn.html',
})
export class CollectionHymnPage {
  public akopos : Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public hymnService : HymnProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CollectionHymnPage');
    this.listAkopo();
  }
  openHymnDetail(hymn) {
    this.navCtrl.push(HymnDetailPage, {
      hymn: hymn
    });
  }
  openCollection(index){
    let collection = this.akopos[index];
    this.navCtrl.push(
      CollectionsPage , {
        'item' : collection,
        'image' : this.getImageUrl(index)
      }
    )
  }
  getImageUrl(i) {
    let imageId = (i % 10) + 1;
    return "assets/imgs/" + imageId + ".jpeg";
  }
  listAkopo() {
    this.hymnService.listAkopo().then(result => {

      let rows = result.rows;
      for (let i = 0; i < rows.length; i++) {
        
        this.akopos.push(rows.item(i));
      }

    });
  }

}
