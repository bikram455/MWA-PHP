import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MWA-PHP-UI';
  constructor(private _router: Router, private _route: ActivatedRoute) {
    console.log('in home page: ', this._router.url, this._route.snapshot);
  }
  
  hideFooter() {
    return this._router.url === '/';
  }
}
