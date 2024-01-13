import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FeedPostsResponseDto} from "../../dto/FeedPostsResponseDto";
import {Page} from "../../../core/model/page.model";
import {catchError, merge, Observable, startWith, Subscription, switchMap} from "rxjs";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatPaginator, MatPaginatorModule, PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Event, Router} from "@angular/router";
import {Location} from "@angular/common";
import {AdminService} from "../../services/admin.service";
import {map} from "rxjs/operators";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";


export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-post-management',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './post-management.component.html',
  styleUrl: './post-management.component.scss'
})
export class PostManagementComponent implements AfterViewInit {

  pageSize!: number;
  pageIndex!: number;
  filter = "ALL";
  search = "";
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'postType', 'title', 'commentsCount', 'likesCount', 'timePassed', 'action'];
  feedDataSource!: FeedPostsResponseDto[];


  constructor(private location: Location,
              private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService) {

    this.pageIndex = this.route.snapshot.queryParams["page"] || 0;

    this.pageSize = this.route.snapshot.queryParams["size"] || 10;


  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }


  getData(): void {
    this.location.replaceState(`/admin/posts?page=${this.pageIndex}&size=${this.pageSize}&filter=${this.filter}&search=${this.search}`);
    this.subscriptions.push(
      this.adminService.getFeedPost(this.pageIndex, this.pageSize, this.filter, this.search).subscribe(
        data => {
          this.feedDataSource = data.content;
        }));
  }

  ngAfterViewInit() {
    this.location.replaceState(`/admin/posts?page=${this.pageIndex}&size=${this.pageSize}&filter=${this.filter}&search=${this.search}`);
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminService.getFeedPost(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.filter,
            this.search
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
      .subscribe(data => (this.feedDataSource = data));
  }
}

