import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  autoAuthUser() {

  }

  getIsAuth() {
    return false;
  }
}
