import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  get username(): string {
    if (this._auth.token) {
      return this._jwt.decodeToken(this._auth.token)['name'];
    }
    return this._auth.name
  }
  constructor(private usersService: UsersService, private _auth: AuthenticationService, private _jwt: JwtHelperService) { }

  ngOnInit(): void {
    this._fetchUserData();
  }

  _fetchUserData(): void {
    if(this._auth.isLoggedIn) {
      this.usersService.fetchUser(this.username).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.error(err);
        }
      })
    }
  }
}
