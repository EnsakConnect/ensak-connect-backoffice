import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTableModule} from "@angular/material/table";
import {merge, startWith, Subscription, switchMap} from "rxjs";
import {DatePipe, Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../services/admin.service";
import {map} from "rxjs/operators";
import {ReportsPageResponseDto} from "../../dto/ReportsPageResponseDto";

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    DatePipe
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements AfterViewInit {

  pageSize!: number;
  pageIndex!: number;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['id', 'postType', 'postId', 'flag', 'createdAt', 'action'];
  reportDataSource!: ReportsPageResponseDto[];


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
    this.location.replaceState(`/admin/reports?page=${this.pageIndex}&size=${this.pageSize}`);
    this.subscriptions.push(
      this.adminService.getReportsPage(this.pageIndex, this.pageSize).subscribe(
        data => {
          this.reportDataSource = data.content;
        }));
  }

  ngAfterViewInit() {
    this.location.replaceState(`/admin/reports?page=${this.pageIndex}&size=${this.pageSize}`);
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminService.getReportsPage(
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
      .subscribe(data => (this.reportDataSource = data));
  }

  deleteReport(id: number) {
    this.adminService.deleteReportById(id).subscribe();
    this.reportDataSource = this.reportDataSource.filter(report => report.id != id);
  }
}
