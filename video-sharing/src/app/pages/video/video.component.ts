import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, combineLatest } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Video, VideoService } from '../../services/video.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';


export interface VideoItem {
  name: string;
  url: string;
  uploader: string; // Hozzáadva: Videó feltöltője
  date: Date; // Hozzáadva: Videó feltöltésének dátuma
}

@Component({
  selector: 'app-video-uploader',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  providers: [VideoService, UserService]
})



export class VideoComponent implements OnInit {
  videoFile: File | null = null;
  videoURL: string | null = null;
  videoName: string = ''; // Videó nevének változója
  videos: Observable<VideoItem[]>;
  filteredVideos: Observable<VideoItem[]> = of([]); // Mező hozzáadása
  selectedUploader: string = '';
  uploaders: string[] = [];

  constructor(
    private storage: AngularFireStorage,
    private firestore: AngularFirestore,
    private videoService: VideoService,
    private auth: AngularFireAuth,
    private userService: UserService
  ) {
    this.videos = this.getVideos();
    this.filteredVideos = this.videos; // Mező inicializálása
  }

  ngOnInit(): void {
    this.videos = this.videoService.getVideos();

    this.videos.subscribe(videos => {
      this.uploaders = Array.from(new Set(videos.map(video => video.uploader)));
    });
  }

  uploadVideo() {
    if (this.videoFile) {
      const filePath = `videos/${Date.now()}_${this.videoFile.name}`;
      const fileName = this.videoFile.name;
      const fileRef = this.storage.ref(filePath);
      const uploadTask: AngularFireUploadTask = this.storage.upload(filePath, this.videoFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe({
            next: (getvideoURL) => {
              if (getvideoURL !== null) {
                const videoURL: string = getvideoURL;
                this.auth.currentUser.then(user => {
                  if (user) {
                    const id = user.uid;
                    this.userService.getUserById(id).subscribe({
                      next: (userData: any) => {
                        if (userData && userData.username) {
                          const uploader = userData.username;
                          const date = new Date();
                          this.saveVideoToDatabase(filePath, this.videoName, videoURL, uploader, date);
                        } else {
                          console.error('Nem található felhasználónév a felhasználó adataiban.');
                        }
                      },
                      error: (error) => {
                        console.error('Hiba történt a felhasználói adatok lekérésében:', error);
                      }
                    });
                  } else {
                    console.error('Nem található bejelentkezett felhasználó vagy nevük.');
                  }
                }).catch(error => {
                  console.error('Hiba történt a felhasználó lekérésekor:', error);
                });
              } else {
                console.error('Nem sikerült lekérni a videó URL-jét.');
              }
            },
            error: (error) => {
              console.error('Hiba történt a videó URL lekérésében:', error);
            }
          });
        })
      ).subscribe();
    }
  }

  handleFileInput(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.videoFile = files[0];
    }
  }

  getVideos(): Observable<VideoItem[]> {
    // Lekérjük az adatbázisban tárolt videókat
    return this.firestore.collection('Videos').valueChanges().pipe(
      map((videos: any[]) => {
        return videos.map(video => {
          // A dátum átalakítása sztring formátumba
          const date = new Date(video.date.seconds * 1000); // Konvertálás milliomodpercbe
          return {
            name: String(video.name),
            url: String(video.url),
            uploader: String(video.uploader),
            date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` // Év-Hónap-Nap formátum
          } as unknown as VideoItem;
        });
      })
    );
  }
  
  

  saveVideoToDatabase(filePath: string, videoName: string, videoURL: string, uploader: string, date: Date) {
    const newVideo: Video = {
      id: this.firestore.createId(), // Firebase egyedi azonosító generálása
      name: videoName,
      url: videoURL,
      uploader: uploader,
      date: date
    };

    this.videoService.createVideo(newVideo)
      .then(() => {
        console.log('Videó sikeresen mentve az adatbázisba.');
      })
      .catch(error => {
        console.error('Hiba történt a videó mentésekor:', error);
      });
  }

  getVideoURL(videoPath: string): string {
    return videoPath;
  }
  



  reload() {
    if (this.selectedUploader === 'All') {
      this.filteredVideos = this.videos;
    } else {
      this.filteredVideos = this.videos.pipe(
        map(videos => videos.filter(video => video.uploader === this.selectedUploader))
      );
    }
  }
  




}
