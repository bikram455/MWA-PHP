import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { NavigateComponent } from '../navigate/navigate.component';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(private _formBuilder: FormBuilder, private _usersService: UsersService, private _router: Router, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  register(): void {
    if(this.registerForm.invalid) {
      return;
    }
    this._usersService.register(this.registerForm.value).subscribe({
      next: (res)=> {
        this._auth.token = res['data']['token'];
        this._router.navigate(['/games']);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // getClassInput(): string{
  //   return 'has-danger' : 'has-success';
  // }

    // getClassValid(): string {
    //   return 'is-valid' : 'is-invalid';
    // }
}
