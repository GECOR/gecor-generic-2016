import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { HttpModule, Http } from '@angular/http';
import {Storage} from '@ionic/storage';

import { MyApp } from './app.component';

//Pages
import { GalleryModalPage } from '../pages/galleryModal/galleryModal';
import { LoginPage } from '../pages/login/login';
import { EntitiesModalPage } from '../pages/login/entitiesModal/entitiesModal';
import { SignInPage } from '../pages/signin/signin';
import { LegalTermsPage } from '../pages/signin/legalTerms/legalTerms';
import { SlidePage } from '../pages/slides/slide';
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/tabs/content/home/home';
import { IncidentsPage } from '../pages/tabs/content/incidents/incidents';
import { IncDetailPage } from '../pages/tabs/content/incidents/incDetail/incDetail';
import { ChatPage } from '../pages/tabs/content/incidents/incDetail/chat/chat';
import { CommentsPage } from '../pages/tabs/content/incidents/incDetail/comments/comments';
import { ReviewPage } from '../pages/tabs/content/incidents/incDetail/review/review';
import { NewIncPage } from '../pages/tabs/content/newInc/newInc';
import { FamiliesPage } from '../pages/tabs/content/newInc/families/families';
import { SurveyPage } from '../pages/tabs/content/newInc/survey/survey';
import { Step1Page } from '../pages/tabs/content/newInc/newIncStepByStep/step1/step1';
import { Step2Page } from '../pages/tabs/content/newInc/newIncStepByStep/step2/step2';
import { Step3Page } from '../pages/tabs/content/newInc/newIncStepByStep/step3/step3';
import { Step4Page } from '../pages/tabs/content/newInc/newIncStepByStep/step4/step4';
import { NewsPage } from '../pages/tabs/content/news/news';
import { NewsDetailPage } from '../pages/tabs/content/news/newsDetail/newsDetail';
import { SettingsPage } from '../pages/tabs/content/settings/settings';
import { EntitiesPage } from '../pages/tabs/content/settings/entities/entities';
import { NotificationsPage } from '../pages/tabs/content/settings/notifications/notifications';
import { TermsPage } from '../pages/tabs/content/settings/terms/terms';
import { UserPage } from '../pages/tabs/content/settings/user/user';

//Pipes
//import { EntitiesModalSearchPipe } from './../pages/login/entitiesModal/entitiesModalPipe';
//import { IncidentsSearchPipe } from '../pages/tabs/content/incidents/incidentsPipe';
//import { ArraySortPipe } from '../pages/tabs/content/incidents/incidentsArraySort'; //PIPE DEPRECATED
//import { Step1SearchPipe } from '../pages/tabs/content/newInc/newIncStepByStep/step1/step1Pipe';
//import { Step2SearchPipe } from '../pages/tabs/content/newInc/newIncStepByStep/step2/step2Pipe';

//Providers
import { ConferenceData } from './../providers/conference-data';
import { DBProvider } from './../providers/db';
import { GeolocationProvider } from './../providers/geolocation';
import { UserData } from './../providers/user-data';
import { UtilsProvider } from './../providers/utils';
import { IncidentsSort } from '../pages/tabs/content/incidents/incidentsArraySort';

//Components
import { SummaryComponent } from '../pages/tabs/content/newInc/newIncStepByStep/summary/summary';

//Directives
//import {NgClass} from '@angular/common';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, 'assets/i18n', '.json');
}

@NgModule({
  declarations: [
    MyApp,

    GalleryModalPage,
    LoginPage,
    EntitiesModalPage,
    SignInPage,
    LegalTermsPage,
    SlidePage,
    TabsPage,
    HomePage,
    IncidentsPage,
    IncDetailPage,
    ChatPage,
    CommentsPage,
    ReviewPage,
    NewIncPage,
    FamiliesPage,
    SurveyPage,
    Step1Page,
    Step2Page,
    Step3Page,
    Step4Page,
    NewsPage,
    NewsDetailPage,
    SettingsPage,
    EntitiesPage,
    NotificationsPage,
    TermsPage,
    UserPage,
    /*
    EntitiesModalSearchPipe,
    IncidentsSearchPipe,
    Step1SearchPipe,
    Step2SearchPipe,*/

    SummaryComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [Http] 
        })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    GalleryModalPage,
    LoginPage,
    EntitiesModalPage,
    SignInPage,
    LegalTermsPage,
    SlidePage,
    TabsPage,
    HomePage,
    IncidentsPage,
    IncDetailPage,
    ChatPage,
    CommentsPage,
    ReviewPage,
    NewIncPage,
    FamiliesPage,
    SurveyPage,
    Step1Page,
    Step2Page,
    Step3Page,
    Step4Page,
    NewsPage,
    NewsDetailPage,
    SettingsPage,
    EntitiesPage,
    NotificationsPage,
    TermsPage,
    UserPage
  ],
  providers: [
    ConferenceData,
    DBProvider,
    GeolocationProvider,
    UserData,
    UtilsProvider,
    Storage,
    IncidentsSort
  ]
})
export class AppModule {}
