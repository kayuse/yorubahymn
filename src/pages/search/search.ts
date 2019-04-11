import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HymnProvider } from '../../providers/hymn/hymn';
import { HymnDetailPage } from '../hymn-detail/hymn-detail';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  public searchText: string = "";
  public hymns: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams
    , public hymnService: HymnProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.searchText = this.navParams.get('text');
    this.search();
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
  search() {
    this.hymnService.search(this.searchText).then(data => {
      this.hymns = [];
      for (let i = 0; i < data.rows.length; i++) {
        let hymn = data.rows.item(i);
        this.hymns.push(hymn);

      }
    }).catch(error => {
      console.error('error data', error)
    })
  }
  back() {
    this.navCtrl.pop();
  }

}
