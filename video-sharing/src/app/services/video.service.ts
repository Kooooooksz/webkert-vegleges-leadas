import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Video {
    id: string;
    uploader: string;
    name: string;
    url: string;
    date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private firestore: AngularFirestore) { }

  // Videó létrehozása
  createVideo(video: Video): Promise<void> {
    // Ellenőrizzük, hogy az adott uploader és name páros már szerepel-e az adatbázisban
    return this.firestore.collection<Video>('Videos', ref =>
      ref.where('uploader', '==', video.uploader)
         .where('name', '==', video.name)
         .limit(1)
    ).get().toPromise().then(querySnapshot => {
      // Ellenőrizzük, hogy a querySnapshot változó nem undefined
      if (querySnapshot && !querySnapshot.empty) {
        console.log('Az adott uploader és name páros már szerepel az adatbázisban.');
        return;
      } else {
        // Ha nincs ilyen videó, akkor mentsük el az adatbázisba
        return this.firestore.collection<Video>('Videos').doc(video.id).set(video);
      }
    }).catch(error => {
      console.error('Hiba történt a videó létrehozása során:', error);
      throw error;
    });
  }
  
  

  // Videó olvasása azonosító alapján
  readVideo(id: string): Observable<Video | undefined> {
    return this.firestore.collection<Video>('Videos').doc<Video>(id).valueChanges();
  }

  // Videó frissítése
  updateVideo(id: string, videoData: Partial<Video>): Promise<void> {
    return this.firestore.collection<Video>('Videos').doc(id).update(videoData);
  }

  // Videó törlése
  deleteVideo(id: string): Promise<void> {
    return this.firestore.collection<Video>('Videos').doc(id).delete();
  }

  // Felhasználó UID keresése felhasználónév alapján
  findUidByUsername(username: string): Observable<string | undefined> {
    return this.firestore.collection<Video>('Videos', ref => ref.where('uploader', '==', username)).valueChanges()
      .pipe(
        map(users => {
          if (users.length > 0) {
            return users[0].id;
          } else {
            return undefined;
          }
        })
      );
  }

  // Videók lekérése felhasználónév alapján
  // Videók lekérése felhasználónév alapján
getVideosByUploader(username: string): Observable<Video[]> {
  return this.firestore.collection<Video>('Videos', ref => ref.where('uploader', '==', username)).snapshotChanges()
    .pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Video;
          const id = action.payload.doc.id;
          return { ...data, id }; // Módosítás itt
        });
      })
    );
}

getVideos(): Observable<any[]> {
  return this.firestore.collection('Videos').valueChanges();
}

}
