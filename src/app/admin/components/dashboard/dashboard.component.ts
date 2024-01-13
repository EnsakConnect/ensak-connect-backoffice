import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Breakpoints, BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  NgApexchartsModule,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexPlotOptions,
  ApexYAxis,
  ApexFill,
  ApexLegend
} from "ng-apexcharts";
import {AdminService} from "../../services/admin.service";
import {DashboardResponseDto} from "../../dto/DashboardResponseDto";
import {Subscription} from "rxjs";


export type AreaOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

export type PieOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgApexchartsModule
  ]
})
export class DashboardComponent implements OnInit{
  @ViewChild("overviewChart") chart!: ChartComponent;
  public areaOptions: Partial<AreaOptions> | any;
  @ViewChild("usersChart") usersChart!: ChartComponent;
  public pieUsersOptions: Partial<PieOptions> | any;
  @ViewChild("postsChart") postsChart!: ChartComponent;
  public piePostsOptions: Partial<PieOptions> | any;
  subscriptions: Subscription[] = [];
  flag1 = false;
  flag2 = false;
  flag3 = false;

  private breakpointObserver = inject(BreakpointObserver);

  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => {
      if (matches) {
        return [
          {title: 'Overview', cols: 2, rows: 1, chartOptions: this.areaOptions},
          {title: 'Users', cols: 2, rows: 1, chartOptions: this.pieUsersOptions},
          {title: 'Posts', cols: 2, rows: 1, chartOptions: this.piePostsOptions}
        ];
      }

      return [
        {title: 'Overview', cols: 2, rows: 1, chartOptions: this.areaOptions},
        {title: 'Users', cols: 1, rows: 1, chartOptions: this.pieUsersOptions},
        {title: 'Posts', cols: 1, rows: 1, chartOptions: this.piePostsOptions}
      ];
    })
  );

  constructor(private adminService: AdminService) {
    this.areaOptions = {
      series: [
        {
          name: "JOBS",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: "BLOGS",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        {
          name: "QUESTIONS",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ],
      chart: {
        type: "bar",
        height: 265
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ]
      },
      fill: {
        opacity: 1
      }
    };

    this.pieUsersOptions = {
      series: [44, 55, 13],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["STUDENT", "LAUREATE", "PROFESSOR"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.piePostsOptions = {
      series: [44, 55, 13],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: ["JOB", "BLOG", "Q&A"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.subscriptions.push(this.adminService.getCountDashboardCharts().subscribe(
      (response) => {
        this.dataDispatcher(response);
      }
    ));

  }

  dataDispatcher(data: DashboardResponseDto[]) {
    data.forEach((e) => {
      switch (e.chart) {
        case "POSTS": {
          this.piePostsOptions.labels = e.data.field;
          this.piePostsOptions.series = e.data.count;
          break;
        }
        case "USERS": {
          this.pieUsersOptions.labels = e.data.field;
          this.pieUsersOptions.series = e.data.count;
          break;
        }
        case "JOB": {
          e.data.field.forEach(month =>{
            this.areaOptions.series[0].data[+month-1] = e.data.count[+month-1];
          })
          this.flag1 = true;
          break;
        }
        case "BLOG": {
          e.data.field.forEach(month =>{
            this.areaOptions.series[1].data[+month-1] = e.data.count[+month-1];
          })
          this.flag2 = true;
          break;
        }
        case "QUESTION": {
          e.data.field.forEach(month =>{
            this.areaOptions.series[2].data[+month-1] = e.data.count[+month-1];
          })
          this.flag3 = true;
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
