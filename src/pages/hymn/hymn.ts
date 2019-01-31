import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HymnDetailPage } from '../hymn-detail/hymn-detail';

@Component({
  selector: 'page-hymn',
  templateUrl: 'hymn.html'
})
export class HymnPage {
  data : object[] = [
    {
      "title":"E fi iyin fun Oluwa",
      "reference":"H. C. 564",
      "number" : "7"
    },
    {
      "title":"Woo. iwo Ii ewa",
      "reference":"G. H. 95",
      "number" : "8"
    },
    {
      "title":"E fi lyin fun OJuwa",
      "reference":"S.S. & S. 208",
      "number" : "9"
    },
    {
      "title":"Awa feran Re nitori On ii o ko feran Wa",
      "reference":"H. of P. 430",
      "number" : "10"
    },
    {
      "title":"E fi iyin fun Oluwa",
      "reference":"H. C. 564",
      "number" : "98"
    },{
      "title":"E fi iyin fun Oluwa",
      "reference":"H. C. 564",
      "number" : "78"
    }
  ];
  constructor(public navCtrl: NavController) {

  }

  openHymnDetail(){
    this.navCtrl.push(HymnDetailPage);
  }

}
