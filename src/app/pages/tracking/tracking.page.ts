import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
declare const google;
import { Geolocation } from '@capacitor/geolocation';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  sourceLocation: any
  destinationLocation: any
  myLatLng :any
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  @ViewChild('mapElement', { static: false }) mapElement;
  preUrl: string;
  orderData: any;
  deliveryBoy: any;
  map: any;
  constructor(private orderService:OrderService,private route:ActivatedRoute,) { }

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.sourceLocation=params.shopAddress
      this.destinationLocation=params.customerAddress
      this.deliveryBoy=params.deliveryBoy
      
    })
  }
async  ngAfterViewInit() {
  this.loadMapWithDirection()

    this.calculateAndDisplayRoute()
    setInterval(async ()=> {
   this.orderService.getDeliveryBoyById(this.deliveryBoy).subscribe({
    next: (data)=>{
      
           console.log(data.getUser.tempLocation);
           this.myLatLng=data.getUser.tempLocation
           console.log(this.myLatLng);
          this.addMarker(this.map,this.myLatLng)
           this.loadMapWithDirection()
           
      
    }
   })
      
     
    },10000 );
  }

  async loadMapWithDirection() {

     this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        zoom: 12,
        center: this.myLatLng

      },
    );
 
    this.addMarker(this.map,this.myLatLng)
    this.directionsRenderer.setMap(this.map);
  }

  async addMarker(map: any,latlng:any) {
    new google.maps.Marker({
      position: latlng,
      map,
      label: {
        text: "\ue530",
        fontFamily: "Material Icons",
        color: "white",
        fontSize: "30px",
      },
      title: "Material Icon Font Marker",
    });
  }

  calculateAndDisplayRoute() {
    console.log(this.sourceLocation);
    console.log(this.destinationLocation);
    this.directionsService
      .route({
        origin: {
          query: this.sourceLocation,
        },
        destination: {
          query: this.destinationLocation,
        },
        travelMode: google.maps.TravelMode.DRIVING,
      },
        (response: any, status: any) => {
          console.log(response);
          console.log(status);

          if (status == "OK") {
            this.directionsRenderer.setDirections(response);

          } else {
            window.alert("Directions request failed due to" + status);
          }

        })

  }

  goBack() {
    // this.loc;
  }
}


