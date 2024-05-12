import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  uid?: string; // UID opcionális, mert a Firestore egyedi azonosítót generál
  username: string;
  // További mezők itt...
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  // Felhasználó létrehozása
  createUser(user: User){
    return this.firestore.collection<User>('Users').doc(user.uid).set(user);
  }

  // Felhasználó olvasása UID alapján
  readUser(uid: string): Observable<User | undefined> {
    return this.firestore.collection<User>('users').doc<User>(uid).valueChanges();
  }

  // Felhasználó frissítése
  updateUser(uid: string, userData: Partial<User>): Promise<void> {
    return this.firestore.collection<User>('users').doc(uid).update(userData);
  }

  // Felhasználó törlése
  deleteUser(uid: string): Promise<void> {
    return this.firestore.collection<User>('users').doc(uid).delete();
  }

  // Felhasználó lekérdezése ID alapján
  getUserById(uid: string): Observable<User | undefined> {
    return this.firestore.collection<User>('Users').doc<User>(uid).valueChanges();
  }
  

  // Felhasználó lekérése az email alapján
readUserByEmail(email: string): Observable<User | undefined> {
  return this.firestore.collection<User>('Users', ref => ref.where('email', '==', email))
    .valueChanges({ idField: 'uid' })
    .pipe(
      map(users => {
        if (users && users.length > 0) {
          return users[0];
        } else {
          return undefined;
        }
      })
    );
}

}
