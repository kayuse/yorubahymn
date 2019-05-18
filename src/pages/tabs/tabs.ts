import { Component } from '@angular/core';

import { HymnPage } from '../hymn/hymn';
import {CollectionHymnPage} from '../collection-hymn/collection-hymn';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = HymnPage;
  tab3Root = CollectionHymnPage;

  constructor() {

  }
}
