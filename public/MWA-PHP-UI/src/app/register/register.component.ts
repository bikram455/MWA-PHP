import { Router } from '@angular/router';
import { UsersService } from '../users.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  formError!: string;
  get name(): string {return environment.name}
  get username(): string {return environment.username}
  get password(): string {return environment.password}
  get confirmPassword(): string {return environment.confirmPassword}
  get registertext(): string {return environment.register}
  constructor(private _formBuilder: FormBuilder, private _usersService: UsersService, private _router: Router, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      name: [environment.main, Validators.required],
      username: [environment.main, Validators.required],
      password: [environment.main, Validators.required],
      confirmPassword: [environment.main, Validators.required]
    });
  }

  register(): void {
    if(this.registerForm.invalid) {
      this.formError = environment.allFieldsRequired;
      return;
    }
    if(this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      this.formError = environment.passwordDontMatch;
      return;
    }
    this._usersService.register(this.registerForm.value).subscribe({
      next: (res)=> {
        this._auth.token = res.data.token;
        this._router.navigate([environment.gotogames]);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
