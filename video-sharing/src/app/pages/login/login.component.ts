import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailOrUsername: string = '';
  password: string = '';
  userData: Observable<any> | null = null; // Változó az aktuális felhasználó adatainak tárolására
  loading: boolean = false;

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // Ha be van jelentkezve a felhasználó, lekérdezzük az adatait
        this.getUserData(user.uid);
      } else {
        // Ha nincs bejelentkezve felhasználó, az aktuális felhasználó adatait null-ra állítjuk
        this.userData = null;
      }
    });
  }

  async login() {
    this.loading = true;
    // Bejelentkezési adatok
    const loginData = {
      emailOrUsername: this.emailOrUsername,  
      password: this.password
    };

    // Bejelentkezés az email és jelszó alapján
    this.auth.signInWithEmailAndPassword(loginData.emailOrUsername, loginData.password)
      .then(userCredential => {
        // Sikeres bejelentkezés
        console.log(userCredential);
        if (userCredential.user) {
          this.getUserData(userCredential.user.uid); // Felhasználó adatainak lekérése
        }
        this.loading=false;
      })
      .catch(error => {
        // Hiba kezelése
        console.error(error);
        this.loading = false;
      });
  }

  async getUserData(id: string) {
    try {
      this.userData = this.firestore.collection('Users').doc(id).valueChanges().pipe(first());
      this.userData.subscribe(data => {
        // Adatok sikeresen lekérve
        console.log('Felhasználói adatok lekérve:', data);
      }, error => {
        // Hiba a lekérdezés során
        console.error('Hiba történt a felhasználói adatok lekérésekor:', error);
      });
    } catch (error) {
      // Firestore lekérdezés hiba
      console.error('Hiba történt a Firestore lekérdezés során:', error);
    }
  }
  
}
