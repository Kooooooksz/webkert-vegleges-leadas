import { Component, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { EventEmitter } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{


  @Output() onCloseSidenav: EventEmitter<boolean>  = new EventEmitter();

  isLoggedIn: Observable<boolean>;
  username: Observable<string | null>;

  constructor(private auth: AngularFireAuth, private userService: UserService) {
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
    this.auth.signOut();
  }


  close(){
    this.onCloseSidenav.emit(true);
  }
}
