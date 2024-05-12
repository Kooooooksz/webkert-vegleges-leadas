import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ChannelService } from '../../services/channel.service'; // Importáld a ChannelService-t
import { User } from '../models/User';
import { Channel } from '../models/Channel'; // Importáld a Channel interfészt

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  user: User = {
    uid: '', // Módosítva: 'id' helyett 'uid'
    email: '',
    username: '',
    name: {
      firstname: '',
      lastname: ''
    },
    phone: '',
    address: '',
    birth: new Date()
  };

  constructor(
    public authService: AuthService, 
    private userService: UserService,
    private channelService: ChannelService // Injektáld a ChannelService-t
  ) { }

  register() {
    // Firebase Authentication regisztráció
    console.log(this.email);
    this.authService.register(this.user.email, this.password)
      .then(userCredential => {
        // Sikeres regisztráció
        console.log('Sikeres regisztráció:', userCredential);

        // Felhasználó UID-jának ellenőrzése
        const userUID = userCredential.user?.uid;

        // Ha van UID, akkor mentjük az adatokat a Firestore-ba
        if (userUID) {
          this.user.uid = userUID; // Átírjuk az 'id' helyett az 'uid' mezőt
          this.saveUserDataToFirestore(this.user);
          this.createChannelForUser(this.user.username); // Csatorna létrehozása a felhasználóhoz
        } else {
          console.error('Nem sikerült meghatározni a felhasználó UID-ját.');
        }
      })
      .catch(error => {
        // Hiba kezelése
        console.error('Hiba történt a regisztráció során:', error);
      });
  }

  // Felhasználó adatainak mentése a Firestore-ba UserService segítségével
  saveUserDataToFirestore(user: User) {
    this.userService.createUser(user)
      .then(() => {
        console.log('Felhasználói adatok elmentve a Firestore-ba.');
      })
      .catch(error => {
        console.error('Hiba történt az adatok mentésekor:', error);
      });
  }

  // Csatorna létrehozása a felhasználóhoz
  createChannelForUser(username: string) {
    const channel: Channel = {
      username: username,
      subscribers: 0,
      profile: ''
    };

    this.channelService.createChannel(channel)
      .then(() => {
        console.log('Csatorna létrehozva a felhasználóhoz.');
      })
      .catch(error => {
        console.error('Hiba történt a csatorna létrehozásakor:', error);
      });
  }
}
