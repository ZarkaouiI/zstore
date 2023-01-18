import { Injectable } from '@angular/core';
import {UserModel} from "../model/user.model";
import {UUID} from "angular2-uuid";
import {Observable, of, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticatedUser : UserModel | undefined;
  users! : UserModel[];

  constructor() {
    this.users = [
      {userId : UUID.UUID(), username : "Admin",email : "admin@gmail.com", password : "password", roles : ["ADMIN", "USER"]},
      {userId : UUID.UUID(), username : "User1", email : "user1@gmail.com", password : "password", roles : ["USER"]},
      {userId : UUID.UUID(), username : "User2", email : "user2@gmail.com", password : "password", roles : ["USER"]}
    ];
  }

  public login(email : string, password : string) : Observable<UserModel> {
    let user = this.users.find(u => u.email === email);
    if(!user) {
      return throwError(() => new Error("No user found!"));
    }
    if(user.password !== password) {
      return throwError(() => new Error("Invalid login credentials!"));
    }
    return of(user);
  }

  public authenticateUser(user : UserModel) : Observable<boolean> {
    this.authenticatedUser = user;
    localStorage.setItem("authUser", JSON.stringify({
      email : user.email,
      roles : user.roles,
      jwt : "JWT_TOKEN"
    }));
    return of(true);
  }

  // public isAdmin() : Observable<boolean> {
  //   //USE "includes" a l7mar :
  //   let roles = this.authenticatedUser?.roles;
  //   if(roles && roles.length>1) {
  //     //Since an admin will always have at least two roles : ADMIN and USER :
  //     if(roles[0]==="ADMIN" || roles[1] === "ADMIN") {
  //       return of(true);
  //     }
  //   }
  //   return of(false);
  // }

  public hasRole(role : string) : boolean {
    if(!this.authenticatedUser) {
      return false;
    }
    return this.authenticatedUser?.roles.includes(role);
    // return this.authenticatedUser!.roles.includes(role);
  }

  public isAuthenticated() : boolean {
    return this.authenticatedUser != undefined;
  }

  public logout() : Observable<boolean> {
    this.authenticatedUser = undefined;
    localStorage.removeItem("authUser");
    return of(true);
  }
}
