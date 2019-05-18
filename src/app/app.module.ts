import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import {IonicStorageModule} from '@ionic/storage';

import { MyApp } from './app.component';

import { HymnPage } from '../pages/hymn/hymn';
import { CollectionsPage } from '../pages/collections/collections';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import {CollectionHymnPage} from '../pages/collection-hymn/collection-hymn';
import {HymnDetailPage} from '../pages/hymn-detail/hymn-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//components
import { HttpClientModule } from '@angular/common/http';
import {Http, HttpModule} from '@angular/http';
import { SQLite} from '@ionic-native/sqlite/';
import { File } from '@ionic-native/file';

//providers
import {HymnProvider} from '../providers/hymn/hymn';
import { SearchPage } from '../pages/search/search';


@NgModule({
  declarations: [
    MyApp,
    HymnPage, 
    CollectionsPage,
    HomePage,
    IntroPage,
    TabsPage,
    CollectionHymnPage,
    SearchPage,
    HymnDetailPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages: true,
    }),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HymnPage,
    CollectionsPage,
    HomePage,
    IntroPage,
    TabsPage,
    CollectionHymnPage,
    
    SearchPage,
    HymnDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HymnProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler},
    SQLite,
    File
  ]
})
export class AppModule { }
