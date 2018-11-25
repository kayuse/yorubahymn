import { Component ,ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { Content } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public showNavbar: boolean;
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController) {

  }

  public hideNavbar(): void {
    this.showNavbar = false;

    // You should resize the content to use the space left by the navbar
    this.content.resize();
  }

}
