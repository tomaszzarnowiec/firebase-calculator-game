import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loggedIn: boolean;
  userData: any;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService) {
    
  }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn;

    this.afAuth.onAuthStateChanged(user => {
      console.log('app state changed:', user, this.authService.isLoggedIn);
      
      this.loggedIn = this.authService.isLoggedIn;
      
      this.userData = user;
    })
  }

  logout() {
    this.authService.SignOut(this.userData);
  }
}
