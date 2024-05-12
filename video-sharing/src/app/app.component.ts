import { Component } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from '../app/services/user.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'


})
export class AppComponent {
  title = 'video-sharing';
  isLoggedIn: Observable<boolean>;
  username: Observable<string | null>;

  constructor(private auth: AngularFireAuth, private userService: UserService, private router: Router) {
    
    this.isLoggedIn = this.auth.authState.pipe(map(user => !!user));
    this.username = this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.userService.getUserById(user.uid).pipe(
            map(userData => userData?.username || null)
          );
         
        } else {
          return of(null);
        }
      })
    );
  }

  logout() {
    this.auth.signOut()
      .then(() => {
        this.router.navigateByUrl('/login');
      })
      .catch(error => {
        console.error('Hiba történt a kijelentkezés során:', error);
      });
  }


  onToggleSidenav(sidenav: MatSidenav) {
    sidenav.toggle();
  }


  onClose(event: any, sidenav: MatSidenav){
      if(event===true){
        sidenav.close();
      }
  }
}

