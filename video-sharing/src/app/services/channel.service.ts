import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app'; // Firebase importálása

export interface Channel {
  username: string;
  subscribers: number;
  profile: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private firestore: AngularFirestore) { }

  // Új csatorna létrehozása
  createChannel(channel: Channel): Promise<void> {
    return this.firestore.collection<Channel>('Channels').doc(channel.username).set(channel);
  }

  // Csatorna olvasása felhasználónév alapján
  readChannel(username: string): Observable<Channel | undefined> {
    return this.firestore.collection<Channel>('Channels').doc<Channel>(username).valueChanges();
  }

  // Csatorna frissítése
  updateChannel(username: string, channelData: Partial<Channel>): Promise<void> {
    return this.firestore.collection<Channel>('Channels').doc(username).update(channelData);
  }

  // Csatorna törlése
  deleteChannel(username: string): Promise<void> {
    return this.firestore.collection<Channel>('Channels').doc(username).delete();
  }

  // Felhasználók lekérése felhasználónév alapján
  getChannelsByUsername(username: string): Observable<Channel[]> {
    return this.firestore.collection<Channel>('Channels', ref => ref.where('username', '==', username)).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Channel;
            const id = action.payload.doc.id;
            return { ...data, id };
          });
        })
      );
  }

  // Feliratkozók számának növelése
  incrementSubscribers(username: string): Promise<void> {
    const channelRef = this.firestore.collection('Channels').doc(username);
    return channelRef.update({
      subscribers: firebase.firestore.FieldValue.increment(1) // Firestore FieldValue használata
    });
  }

  decrementSubscribers(username: string): Promise<void> {
    const channelRef = this.firestore.collection('Channels').doc(username);
    return channelRef.update({
      subscribers: firebase.firestore.FieldValue.increment(-1) // Az előjelváltás csökkenti a feliratkozók számát
    });
  }
  
}
