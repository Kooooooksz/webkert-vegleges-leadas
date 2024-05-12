import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../pages/models/User';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null); // Felhasználó profiljának tárolása

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  // Regisztráció
  register(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  // Bejelentkezés
  login(email: string, password: string): Promise<firebase.default.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  // Kijelentkezés
  logout(): Promise<void> {
    this.currentUserProfile.next(null); // Felhasználó profiljának törlése
    return this.afAuth.signOut();
  }

  // Felhasználó profiljának betöltése és frissítése
  loadUserProfile(uid: string): void {
    this.firestore.collection('Users').doc(uid).valueChanges().subscribe(userProfile => {
      this.currentUserProfile.next(userProfile);
    });
  }

  // Felhasználó állapotának figyelése
  // Visszaadja a bejelentkezett felhasználó adatait, ha van ilyen
  get currentUser(): Observable<firebase.default.User | null> {
    return this.afAuth.authState;
  }


  getUserByUsername(username: string): Observable<User> {
    return this.firestore.collection<User>('Users', ref => ref.where('email', '==', username))
      .valueChanges().pipe(
        map(users => {
          if (users && users.length > 0) {
            return users[0];
          } else {
            throw new Error('Nem található felhasználó ezzel a felhasználónévvel.');
          }
        })
      );
  }
}
