import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.page.html',
  styleUrls: ['./starter.page.scss'],
})
export class StarterPage implements OnInit {

  constructor(private router:Router) { 
    setTimeout(() => {
      console.log("helll");
      
      this.router.navigateByUrl('home')
      
    }, 1000);
  }

  ngOnInit() {
  }

}
