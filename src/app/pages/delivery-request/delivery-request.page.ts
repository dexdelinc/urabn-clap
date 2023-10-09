import { Component, OnInit, Optional } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { App } from '@capacitor/app';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { OrderService } from 'src/app/services/order/order.service';
import { Geolocation } from '@capacitor/geolocation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delivery-request',
  templateUrl: './delivery-request.page.html',
  styleUrls: ['./delivery-request.page.scss'],
})
export class DeliveryRequestPage implements OnInit {
  order: any;

  constructor(private orderService:OrderService,private iab:InAppBrowser,private platform:Platform,private router:Router,
    @Optional() private routerOutlet?: IonRouterOutlet) { 
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (this.routerOutlet.canGoBack()) {
        this.router.navigateByUrl('/user-profile').then(() => {
          // window.location.reload();
        });
      }
    }); 
  }

  ngOnInit() {
this.orderService.getOrderForDeliveryBoy().subscribe({
  next:(data)=>{
    console.log(data);
    this.order=data
    
  }
  })
  }
  OnAccept(){
    this.orderService.acceptOrderByDeliveryBoy().subscribe({
      next:(data)=>{
console.log(data);

      }
    })
  }
  async launchApp(item:any){
    // var ret = await App.canOpenUrl({ url: 'com.google.android.apps.maps' })
    // var retx = await App.openUrl({ url:'com.facebook.katana' })
    if (item.location.coordinates=[]) {
      this.platform.ready().then(() => {
        Geolocation.getCurrentPosition().then((position) => {
          // ios
          if (this.platform.is('ios')) {
            window.open('maps://?q=' + item.address + '&saddr=' + position.coords.latitude + ',' + position.coords.longitude + '&daddr=' + item.location.coordinates[0]  + ',' + item.location.coordinates[1], '_system');
          };
          // android
          if (this.platform.is('android')) {
            window.open('geo://' + position.coords.latitude + ',' + position.coords.longitude + '?q=' + item.location.coordinates[0] + ',' + item.location.coordinates[1] + '(' + item.address + ')', '_system');
          };
        });
      });
    };
    
  }
}
