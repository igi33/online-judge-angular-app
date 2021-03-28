import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {
  currentUser: User;

  constructor(
    private authenticationService: AuthenticationService,
    public loadingService: LoadingService) {}

  ngOnInit(): void {
    this.currentUser = this.authenticationService.getCurrentUser();
  }

}
