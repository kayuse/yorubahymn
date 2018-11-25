import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollectionHymnPage } from './collection-hymn';

@NgModule({
  declarations: [
    CollectionHymnPage,
  ],
  imports: [
    IonicPageModule.forChild(CollectionHymnPage),
  ],
})
export class CollectionHymnPageModule {}
