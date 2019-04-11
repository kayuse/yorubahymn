import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { HymnProvider } from '../../providers/hymn/hymn';
import { SearchPage } from '../search/search'
import { text } from '@angular/core/src/render3/instructions';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public showNavbar: boolean;
  public akopos: Array<any> = [];
  public akopoCounts: Array<Number> = [];
  public searchText: String = "";
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, public hymnService: HymnProvider) {
    this.listAkopo();
  }

  public hideNavbar(): void {
    this.showNavbar = false;

    // You should resize the content to use the space left by the navbar
    this.content.resize();
  }

  listAkopo() {
    this.hymnService.listAkopo().then(result => {

      let rows = result.rows;
      for (let i = 0; i < rows.length; i++) {

        this.akopos.push(rows.item(i));
      }

    });
  }
  getImageUrl(i) {
    let imageId = (i % 5) + 1;
    //console.log(imageId);
    return "assets/imgs/" + imageId + ".jpg";
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
