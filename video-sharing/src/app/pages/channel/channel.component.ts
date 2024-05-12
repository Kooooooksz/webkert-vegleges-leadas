import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../models/Video';
import { Subscriber } from '../models/Subscriber';
import { VideoService } from '../../services/video.service';
import { ChannelService } from '../../services/channel.service';
import { AuthService } from '../../services/auth.service';
import { SubscriberService } from '../../services/subscriber.service';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';




@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
  // Adjuk hozzá a MatIconModule-ot a komponens moduljához
 
})
export class ChannelComponent implements OnInit {
  uploader: string = '';
  videos: Video[] = [];
  subscribers: number = 0;
  loggedInUsername: string = '';
  isSubscribed: boolean = false;
  subscriptionId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private channelService: ChannelService,
    private authService: AuthService,
    private subscriberService: SubscriberService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => {
        this.uploader = params['uploader'];
        return this.loadUploaderVideos(this.uploader);
      })
    ).subscribe();
    this.loadLoggedInUser();
  }

  loadUploaderVideos(uploader: string): Observable<any> {
    return this.channelService.getChannelsByUsername(uploader).pipe(
      switchMap(channels => {
        if (channels.length > 0) {
          const channel = channels[0];
          this.subscribers = channel.subscribers;
        }
        return this.videoService.getVideosByUploader(uploader).pipe(
          switchMap(videos => {
            this.videos = videos;
            return this.subscriberService.countSubscriptionsBySubscribedTo(uploader);
          })
        );
      })
    );
  }
  
  loadLoggedInUser(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        const userEmail = user.email;
        if (userEmail) {
          this.authService.getUserByUsername(userEmail).subscribe((userData: User) => {
            this.loggedInUsername = userData.username;
            if (this.uploader) {
              this.subscriberService.getSubscriptionsBySubscriberAndSubscribedTo(this.loggedInUsername, this.uploader)
                .subscribe(subscriptions => {
                  this.isSubscribed = subscriptions.length > 0;
                  if (subscriptions.length > 0) {
                    this.subscriptionId = subscriptions[0]?.id;
                  }
                });
            }
          });
        }
      }
    });
  }

  toggleSubscription(): void {
    if (!this.isSubscribed) {
      this.doSubscribe();
    } else {
      this.doUnsubscribe(this.subscriptionId);
    }
  }

  private doSubscribe(): void {
    const newSubscription: Subscriber = {
      subscriber: this.loggedInUsername,
      subscribedTo: this.uploader
    };
    this.subscriberService.addSubscriber(newSubscription)
      .then(() => {
        console.log('Feliratkozás hozzáadva sikeresen!');
        this.isSubscribed = true;
        this.subscribers++;
        this.channelService.incrementSubscribers(this.uploader).then(() => {
          console.log('Feliratkozók száma frissítve.');
        }).catch(error => {
          console.error('Hiba történt a feliratkozók számának frissítésekor:', error);
        });
      })
      .catch(error => {
        console.error('Hiba történt a feliratkozás hozzáadásakor:', error);
      });
  }
  
  private doUnsubscribe(subscriptionId: string | undefined): void {
    if (subscriptionId) {
      this.subscriberService.deleteSubscriber(subscriptionId)
        .then(() => {
          console.log('Feliratkozás sikeresen törölve!');
          this.isSubscribed = false;
          this.subscribers--;
          this.channelService.decrementSubscribers(this.uploader).then(() => {
            console.log('Feliratkozók száma frissítve.');
          }).catch(error => {
            console.error('Hiba történt a feliratkozók számának frissítésekor:', error);
          });
        })
        .catch(error => {
          console.error('Hiba történt a feliratkozás törlésekor:', error);
        });
    } else {
      console.log('Ez a feliratkozás már megtörtént.');
    }
  }
}
