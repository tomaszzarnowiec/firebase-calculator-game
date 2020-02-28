import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  user: any;
  gameInProgress: boolean;

  startTime: moment.Moment;
  endTime: moment.Moment;

  durationTime: number;
  duration: string;
  startTimeLabel: string;
  endTimeLabel: string;
  questions: any;
  currentStep: number = 0;
  currentQuestion: any;
  userRef: any;
  currentTime: string;
  interval: any;

  constructor(private afService: AuthService, private router: Router, private db: AngularFireDatabase) {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.userRef = this.db.object(`users/${this.user.uid}`);
  }

  ngOnInit(): void {
    
    this.questions = [
      {
        questionId: 1,
        question: "2 + 2",
        answer: 4
      },
      {
        questionId: 2,
        question: "2 + 15",
        answer: 17
      },
      {
        questionId: 3,
        question: "16 + 12",
        answer: 28
      },
      {
        questionId: 4,
        question: "73 + 27",
        answer: 100
      },
      {
        questionId: 5,
        question: "89 - 14",
        answer: 75
      },
      {
        questionId: 6,
        question: "250 - 25",
        answer: 225
      },
      {
        questionId: 7,
        question: "5 x 6",
        answer: 30
      },
      {
        questionId: 8,
        question: "4 x 64",
        answer: 256
      },
      {
        questionId: 9,
        question: "100 / 5",
        answer: 20
      },
      {
        questionId: 10,
        question: "8 * 0,125",
        answer: 1
      }
    ]
  }

  startGame(){
    this.gameInProgress = true;
    this.startTime = moment();
    this.startTimeLabel = this.startTime.format("HH:mm:ss");
    this.currentStep = 0;
    this.getStep();

    this.interval = setInterval(e => {
      let dif = moment().diff(this.startTime);
      this.currentTime = moment(dif).format("mm:ss:SSS");

      this.userRef.update({
        gameInProgress: true,
        currentGameTime: this.currentTime
      })
    }, 100);
  }

  getStep(){
    this.currentQuestion = this.questions[this.currentStep];
  }

  answerInputCheck($event, question) {
    const answer = $event.target.valueAsNumber;
    question.correctAnswer = answer === question.answer;    
  }

  nextStep() {
    this.currentStep += 1;
  }

  endGame(){
    this.gameInProgress = false;
    this.endTime = moment();
    this.endTimeLabel = this.endTime.format("HH:mm:ss");
    this.durationTime = this.endTime.diff(this.startTime);

    this.duration = moment(this.durationTime).format('mm:ss:SSS');

    this.userRef.update({
      gameTime: this.duration,
      gameInProgress: false
    })

    clearInterval(this.interval);

    setTimeout(e => {
      this.router.navigate(['dashboard']);
    }, 4000)
  }

}
