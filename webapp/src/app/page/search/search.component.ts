import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  type : any

  constructor(private route: ActivatedRoute,private router: Router) {
    const currentNavigation = this.router.getCurrentNavigation();
    if (currentNavigation && currentNavigation.extras.state) {
      const data = currentNavigation.extras.state;
      console.log(this.type = data['data'].key1); // Access the data passed during navigation
    }
  }

}
