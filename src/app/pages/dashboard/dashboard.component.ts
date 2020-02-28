import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loggedInUsers: any;
  ranking: any;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.loggedInUsers = this.db.list('users', ref => ref.orderByChild('isActive').equalTo(true)).valueChanges();
    this.ranking = this.db.list('users', ref => ref.orderByChild('gameTime')).valueChanges();
  }

}
