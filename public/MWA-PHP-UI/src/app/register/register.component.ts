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
  constructor(private _formBuilder: FormBuilder, private _usersService: UsersService, private _router: Router, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
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
