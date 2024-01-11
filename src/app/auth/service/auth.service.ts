import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {Observable, Subject} from "rxjs";
import {User} from "../../core/model/user.model";
import {LoginRequestDto} from "../dto/login.request.dto";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private host = environment.apiUrl;
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private user!: User | null;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }


  getUser() {
    return this.user;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  public login2(response: { token: string; expiresIn: number; user: User }) {
    const token = response.token;
    this.token = token;
    if (token) {
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.user = response.user;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(
        now.getTime() + expiresInDuration * 1000
      );
      this.saveAuthData(token, expirationDate, this.user);
    }
  }

  public login(email: string, password: string) : Observable<{ token: string; expiresIn: number; user: User }> {
    const authData: LoginRequestDto = { email: email, password: password };
    return this.http.post<{ token: string; expiresIn: number; user: User }>(`${this.host}/auth/login`, authData);
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      // @ts-ignore
      this.user = JSON.parse(authInformation.user);
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }else {
      this.isAuthenticated = false;
    }
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.user = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, user: User) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("user", JSON.stringify(user));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("user");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const user = localStorage.getItem("user");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      user: user
    };
  }


  public getUserFromLocalCache(): User {
    // @ts-ignore
    return JSON.parse(localStorage.getItem('user'));
  }

  private getIsAuthenticated(): boolean {
    let result = localStorage.getItem("isAuthenticated")
    return result == "true";
  }

  public loadToken(): void {
    // @ts-ignore
    this.token = localStorage.getItem('token');
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

}
