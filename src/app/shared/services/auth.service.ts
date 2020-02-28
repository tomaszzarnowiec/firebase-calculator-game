import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from "@angular/router";
import { ToastyService, ToastyConfig } from 'ng2-toasty';

import * as _ from 'underscore';

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    userData: any;

    facesWoman: any[];

    constructor(
        public db: AngularFireDatabase,
        public afAuth: AngularFireAuth,
        private toastyService: ToastyService,
        private toastyConfig: ToastyConfig,
        public router: Router,
        public ngZone: NgZone
    ) {
        this.toastyConfig.theme = 'default';
        this.toastyConfig.timeout = 5000;
        this.toastyConfig.position = "top-right";

        this.facesWoman = [
            'https://images.unsplash.com/photo-1498529605908-f357a9af7bf5?w=200',
            'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200',
            'https://images.unsplash.com/photo-1520810627419-35e362c5dc07?w=200',
            'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200',
            'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=200',

            'https://images.unsplash.com/photo-1495147334217-fcb3445babd5?w=200',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
            'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?w=200',
            'https://images.unsplash.com/photo-1513483460609-1c8a505ea990?w=200',
            'https://images.unsplash.com/photo-1570612861542-284f4c12e75f?w=200'
        ];

        this.afAuth.onAuthStateChanged(user => {
            
            if (user) {
                const userRef = this.db.object(`users/${user.uid}`);

                this.userData = user;

                userRef.update({
                    isActive: true
                })

                localStorage.setItem('user', JSON.stringify(this.userData));
            } else {
                localStorage.setItem('user', null);
            }
            
        })

    }

    private navigateToDashboard() {
        this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
        });
    }

    private throwErrorProviderLogin(error) {
        if (error.code === 'auth/account-exists-with-different-credential') {
            this.toastyService.error({
                title: 'There already exists an account with the email address asserted by the credential',
                msg: 'You are probably registered by different way. Try another login methood.'
            })
        }

        if (error.code === 'auth/user-disabled') {
            this.toastyService.error({
                title: 'User disabled',
                msg: 'User corresponding to the given email has been disabled.'
            })
        }

        if (error.code === 'auth/invalid-email') {
            this.toastyService.error({
                title: 'Email address is not valid',
                msg: "Please verify your credentials."
            })
        }

        if (error.code === 'auth/wrong-password') {
            this.toastyService.error({
                title: 'Wrong password',
                msg: 'Password is invalid for the given email.'
            })
        }

        if (error.code === 'auth/email-already-in-use') {
            this.toastyService.error({
                title: 'Email already in use',
                msg: 'You probably have an account already. Please verify your credentials.'
            })
        }

        if (error.code === 'auth/invalid-email') {
            this.toastyService.error({
                title: 'Email already in use',
                msg: "You don't have an account yet. Please verify your credentials or sign up."
            })
        }

        if (error.code === 'auth/operation-not-allowed') {
            this.toastyService.error({
                title: 'Operation is not allowed',
                msg: 'Try again soon.'
            })
        }

        if (error.code === 'auth/weak-password') {
            this.toastyService.error({
                title: 'Typed password is too weak',
                msg: 'Password should contain at least one number and uppercase letter.'
            })
        }
    }

    SignIn(email, password) {
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.ngZone.run(() => {
                    this.navigateToDashboard();
                });
                
                this.SetUserData(result.user);
            }).catch((error) => {
                if (error.code === 'auth/user-not-found') {
                    // if (confirm('There is no user corresponding to the given email. Would you like to create an account?')) {
                        this.SignUp(email, password);
                    // }
                }

                this.throwErrorProviderLogin(error);
            })
    }

    SignUp(email, password) {
        return this.afAuth.createUserWithEmailAndPassword(email, password)
            .then((result) => {
                this.SignIn(email, password);
                this.SetUserData(result.user);
            }).catch((error) => {
                this.throwErrorProviderLogin(error);
            })
    }

    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user'));
        return (!_.isUndefined(user) && !_.isNull(user)) ? true : false;
    }

    GoogleAuth() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
    }

    FacebookAuth() {
        return this.AuthLogin(new auth.FacebookAuthProvider());
    }

    AuthLogin(provider) {
        return this.afAuth.signInWithPopup(provider)
            .then((result) => {
                this.ngZone.run(() => {
                    this.navigateToDashboard();
                })
                this.SetUserData(result.user);
            }).catch((error) => {
                this.throwErrorProviderLogin(error);
            })
    }

    SetUserData(user) {
        const userRef = this.db.object(`users/${user.uid}`);
        const userData = {
            uid: user.uid,
            email: user.email,
            isActive: true,
            displayName: user.displayName,
            photoURL: user.photoURL ? user.photoURL : this.facesWoman[_.random(this.facesWoman.length)]
        }

        return userRef.set(userData)
    }

    SignOut(user) {
        localStorage.removeItem('user');

        const userRef = this.db.object(`users/${user.uid}`);

        userRef.update({
            isActive: false
        })

        return this.afAuth.signOut().then(() => {
            this.router.navigate(['login']);
        })
    }
}