import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DashboardResponseDto} from "../dto/DashboardResponseDto";
import {Page} from "../../core/model/page.model";
import {FeedPostsResponseDto} from "../dto/FeedPostsResponseDto";
import {UsersPageResponseDto} from "../dto/UsersPageResponseDto";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private host = environment.apiUrl ;
  constructor(private http: HttpClient) { }

  public getCountDashboardCharts(): Observable<DashboardResponseDto[]> {
    return this.http.get<DashboardResponseDto[]>(`${this.host}/back-offices/dashboard`);
  }

  public patchIsLockedByUserId(id: number): Observable<null> {
    return this.http.get<null>(`${this.host}/back-offices/users/lock/${id}`);
  }

  public patchIsValidByUserId(id: number): Observable<null> {
    return this.http.get<null>(`${this.host}/back-offices/users/active/${id}`);
  }

  public deleteUserByUserId(id: number): Observable<null> {
    return this.http.delete<null>(`${this.host}/back-offices/users/delete/${id}`);
  }
  public getFeedPost(page: number, size: number, filter: string, search: string): Observable<Page<FeedPostsResponseDto>> {
    return this.http.get<Page<FeedPostsResponseDto>>(`${this.host}/feeds?page=${page}&size=${size}&filter=${filter}&search=${search}`);
  }

  public getUsersPage(page: number, size: number): Observable<Page<UsersPageResponseDto>> {
    return this.http.get<Page<UsersPageResponseDto>>(`${this.host}/back-offices/users?page=${page}&size=${size}`);
  }
}
