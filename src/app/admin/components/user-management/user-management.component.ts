import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {merge, startWith, Subscription, switchMap} from "rxjs";
import {FeedPostsResponseDto} from "../../dto/FeedPostsResponseDto";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../services/admin.service";
import {map} from "rxjs/operators";
import {UsersPageResponseDto} from "../../dto/UsersPageResponseDto";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    DatePipe,
    MatButtonModule
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements AfterViewInit {

  pageSize!: number;
  pageIndex!: number;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'email', 'fullName', 'profileType', 'isActive', 'isNotLocked', 'activatedAt', 'action'];
  userDataSource!: UsersPageResponseDto[];


  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService) {

    this.pageIndex = this.route.snapshot.queryParams["page"] || 0;

    this.pageSize = this.route.snapshot.queryParams["size"] || 10;

  }

  patchIsLocked(id: number) {
    this.adminService.patchIsLockedByUserId(id).subscribe();
    let user = this.userDataSource.find(user=> user.id == id);
    if (user) {
      user.isNotLocked = !user.isNotLocked;
    }
  }

  patchIsValid(id: number) {
    this.adminService.patchIsValidByUserId(id).subscribe();
    let user = this.userDataSource.find(user=> user.id == id);
    if (user) {
      user.isActive = !user.isActive;
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  getData(): void {
    this.location.replaceState(`/admin/users?page=${this.pageIndex}&size=${this.pageSize}`);
    this.subscriptions.push(
      this.adminService.getUsersPage(this.pageIndex, this.pageSize).subscribe(
        data => {
          this.userDataSource = data.content;
        }));
  }

  ngAfterViewInit() {
    this.location.replaceState(`/admin/users?page=${this.pageIndex}&size=${this.pageSize}`);
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminService.getUsersPage(
            this.paginator.pageIndex,
            this.paginator.pageSize
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.totalElements;
          return data.content;
        }),
      )
      .subscribe(data => (this.userDataSource = data));
  }

  deleteUser(id: number) {
    this.adminService.deleteUserByUserId(id).subscribe();
    this.userDataSource = this.userDataSource.filter(user => user.id != id);
  }

}
