import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Subscriber {
  id?: string;
  subscriber: string;
  subscribedTo: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriberService {

  constructor(private firestore: AngularFirestore) { }

  addSubscriber(subscriber: Subscriber): Promise<DocumentReference<Subscriber>> {
    return this.firestore.collection<Subscriber>('Subscribers').add(subscriber);
  }

  getSubscriptionsBySubscriber(subscriber: string): Observable<Subscriber[]> {
    return this.firestore.collection<Subscriber>('Subscribers', ref => ref.where('subscriber', '==', subscriber)).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Subscriber;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getSubscriptionsBySubscriberAndSubscribedTo(subscriber: string, subscribedTo: string): Observable<Subscriber[]> {
    return this.firestore.collection<Subscriber>('Subscribers', ref => ref.where('subscriber', '==', subscriber).where('subscribedTo', '==', subscribedTo)).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Subscriber;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getSubscriptionsBySubscribedTo(subscribedTo: string): Observable<Subscriber[]> {
    return this.firestore.collection<Subscriber>('Subscribers', ref => ref.where('subscribedTo', '==', subscribedTo)).snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(action => {
            const data = action.payload.doc.data() as Subscriber;
            const id = action.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  countSubscriptionsBySubscribedTo(subscribedTo: string): Observable<number> {
    return this.getSubscriptionsBySubscribedTo(subscribedTo).pipe(
      map(subscribers => subscribers.length)
    );
  }

  deleteSubscriber(id: string): Promise<void> {
    return this.firestore.collection<Subscriber>('Subscribers').doc(id).delete();
  }
}
