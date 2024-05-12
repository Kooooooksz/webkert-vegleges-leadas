import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module'; // Importáljuk az AppRoutingModule-et

import { AppComponent } from './app.component';
import { LoginComponent } from '../app/pages/login/login.component';
import { RegistrationComponent } from '../app/pages/registration/registration.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { VideoComponent } from './pages/video/video.component';
import { ChannelComponent } from './pages/channel/channel.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import { UploaderFilterPipe } from './uploader.pipe';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {

  apiKey: "AIzaSyC81UArBeSDi7hIdNqzvQQ0F1DR5UY8dSY",

  authDomain: "video-megoszto-oldal.firebaseapp.com",

  projectId: "video-megoszto-oldal",

  storageBucket: "video-megoszto-oldal.appspot.com",

  messagingSenderId: "242783754122",

  appId: "1:242783754122:web:91de6e17d783b1f2a6da73",

  measurementId: "G-QWZ1ZRKDVM"

};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    NavbarComponent,
    VideoComponent,
    ChannelComponent,
    UploaderFilterPipe
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    provideFirebaseApp(() => initializeApp({
      "projectId": "video-megoszto-oldal",
      "appId": "1:242783754122:web:91de6e17d783b1f2a6da73",
      "storageBucket": "video-megoszto-oldal.appspot.com",
      "apiKey": "AIzaSyC81UArBeSDi7hIdNqzvQQ0F1DR5UY8dSY",
      "authDomain": "video-megoszto-oldal.firebaseapp.com",
      "messagingSenderId": "242783754122",
      "measurementId": "G-QWZ1ZRKDVM"
    })),
    
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


