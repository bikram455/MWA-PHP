import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UsersService } from '../users.service';
import * as SystemUtils from '../utils/system.utils';

@Component({
  selector: 'app-navigate',
  templateUrl: './navigate.component.html',
  styleUrls: ['./navigate.component.css']
})
export class NavigateComponent implements OnInit {
  @ViewChild('loginForm')
  loginForm!: NgForm;
  user: User = new User('', '');
  loggedIn: boolean = false;
  constructor(private _usersService: UsersService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('in home page: ', this._router.url, this._route.snapshot);
  }

  
  login(login: NgForm) {
    if(login.invalid) {
      return;
    }
    this._usersService.login(login.value).subscribe(res => {
      console.log(res);
      this.loggedIn = true;
    }, err => {
      console.error(err);
    });
  }
}
