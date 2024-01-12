import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {Observable, Subject} from "rxjs";
import {User} from "../../core/model/user.model";
import {LoginRequestDto} from "../dto/login.request.dto";
import {HttpClient} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public host = environment.apiUrl;
  private isAuthenticated = false;
  private token!: string | null;
  private tokenTimer: any;
  private userEmail!: string | null;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {
  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }


  getUserEmail() {
    return this.userEmail;
  }

  public login2(codedToken: string) {
    this.token = codedToken;
    const token: { exp: number; iat: number; sub: string; } = jwtDecode(codedToken);

    if (token) {
      console.log(token);
      const expiresInDuration: number = token.exp;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userEmail = token.sub;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(
        now.getTime() + expiresInDuration
      );
      this.saveAuthData(this.token, expirationDate, this.userEmail);
    }
  }

  public login(email: string, password: string): Observable<{ token: string; refreshToken: string; }> {
    const authData: LoginRequestDto = {email: email, password: password};
    return this.http.post<{ token: string; refreshToken: string; }>(`${this.host}auth/login`, authData);
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
      this.userEmail = authInformation.userEmail;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    } else {
      this.isAuthenticated = false;
    }
  }

  logOut() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userEmail = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userEmail: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", String(expirationDate));
    localStorage.setItem("userEmail", userEmail);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userEmail");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userEmail = localStorage.getItem("userEmail");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userEmail: userEmail
    };
  }

  public getUserFromLocalCache(): User {
    // @ts-ignore
    return localStorage.getItem('userEmail');
  }

  public loadToken(): void {
    // @ts-ignore
    this.token = localStorage.getItem('token');
  }

  public addUserToLocalCache(userEmail: string): void {
    localStorage.setItem('userEmail', userEmail);
  }

}
