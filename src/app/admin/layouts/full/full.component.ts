import {ChangeDetectorRef, Component, inject, OnDestroy} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {NgClass} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MediaMatcher} from "@angular/cdk/layout";
import {AuthService} from "../../../auth/service/auth.service";
import {NotificationService} from "../../../core/service/notification.service";

@Component({
  selector: 'app-full',
  standalone: true,
  imports: [
    RouterOutlet,
    NgClass,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
  ],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss'
})
export class FullComponent implements OnDestroy {
  mobileQuery: MediaQueryList;

  fillerNav = [
    {
      name: "Dashboard",
      link: "dashboard"
    },
    {
      name: "Report",
      link: "report"
    },
    {
      name: "User management",
      link: "users"
    },
    {
      name: "Post management",
      link: "posts"
    }
  ];

  private authenticationService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  public onLogOut(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/auth/login']);
    this.notificationService.notify( `You've been successfully logged out`);
  }

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
