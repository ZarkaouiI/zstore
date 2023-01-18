import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthenticationService} from "../services/authentication.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userFormGroup! : FormGroup;
  errorMessage! : string;

  constructor(private formBuilder : FormBuilder,
              private authService : AuthenticationService,
              private router : Router) { }

  ngOnInit(): void {
    this.userFormGroup = this.formBuilder.group({
      email : this.formBuilder.control(""),
      password : this.formBuilder.control(""),
    });
  }

  loginHandler() {
    let email = this.userFormGroup.value.email;
    let password = this.userFormGroup.value.password;

    //Login the user :
    this.authService.login(email, password).subscribe({
      next : (user) => {
        this.authService.authenticateUser(user).subscribe({
          next: (data) => {
            this.router.navigateByUrl("/admin");
          }
        })
      },
      error : (error) => {
        this.errorMessage = error;
      }
    });

  }
}
