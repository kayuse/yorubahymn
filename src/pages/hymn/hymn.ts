import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HymnDetailPage } from '../hymn-detail/hymn-detail';
import { HymnProvider } from '../../providers/hymn/hymn';
import { SearchPage } from '../search/search'
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-hymn',
  templateUrl: 'hymn.html'
})
export class HymnPage {
  public hymns: Array<any> = [];
  public page: number = 0;
  public availableHeaders = {};
  public headerShiftIndex: Array<number> = [];
  public searchText: String = "";
  public currentHeader: string = "";
  constructor(public navCtrl: NavController,
    public hymnService: HymnProvider, public storage: Storage) {
    this.loadHymns(null);
    this.setTotalHymns();
  }

  loadHymns(infiniteScroll) {
    console.log('this page is', this.page);
    this.hymnService.getHymns(this.page).then(result => {
      this.page++;
      let rows = result.rows;
      //this.headerShiftIndex = [];
      for (let i = 0; i < rows.length; i++) {
        rows.item(i);
        this.hymns.push(rows.item(i));

      }
      if (infiniteScroll != null) {
        console.log('called')
        infiniteScroll.complete();
      }

    })
  }
  editTitle(title: string) {
    if (title.length >= 30) {
      return title.substring(0, 29) + "....."
    }
    return title
  }
  loadNext(infiniteScroll) {
    this.storage.get('totalHymns').then(result => {
      if (this.page * this.hymnService.hymnPageSize >= parseInt(result)) {
        infiniteScroll.complete();
      } else {
        this.loadHymns(infiniteScroll);
      }
    })

  }

  setTotalHymns() {
    this.hymnService.getTotalHymn().then(result => {
      let count = result.rows.item(0);
      this.storage.set('totalHymns', count.c);
    })
  }

  openHymnDetail(hymn) {
    this.navCtrl.push(HymnDetailPage, {
      hymn: hymn
    });
  }
  openSearchPage(event) {
    
    if (this.searchText.length > 3 && event.type == "input") {
      this.navCtrl.push(SearchPage, {
        'text': this.searchText
      })
    }else if(event.type == "keyup"){
      this.navCtrl.push(SearchPage, {
        'text': this.searchText
      })
    }
  }
}
