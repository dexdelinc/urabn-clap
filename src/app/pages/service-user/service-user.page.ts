import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, IonSearchbar, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ConsumerService } from 'src/app/services/consumer/consumer.service';
import { ServiceService } from 'src/app/services/service/service.service';
import { ShopService } from 'src/app/services/shop/shop.service';
import { ShopProductDetailsPage } from '../shop-product-details/shop-product-details.page';
import { environment } from 'src/environments/environment';
declare var google
const URL = environment.baseUrl;
@Component({
  selector: 'app-service-user',
  templateUrl: './service-user.page.html',
  styleUrls: ['./service-user.page.scss'],
})
export class ServiceUserPage implements OnInit {

  @ViewChild('autocomplete')
  autocomplete: IonSearchbar
  @Input()
  user: any;
  user1: any;
  serviceData: any;
  form: any = {
    service: '',
    location: ''
  }
  errorMessage: any;
  selectedService: any;
  clickId: any;
  selected: any;
  latlng: any
  lat: any;
  lng: any;
  url: any

  constructor(public navCtrl:NavController,private shop: ShopService, private service: ServiceService, private consumer: ConsumerService, private auth: AuthService, private alertController: AlertController, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log("###################", this.latlng);
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params)
        this.selectedService = params.serviceValue;
        this.selected = params.selected,
          this.latlng = [params.lat, params.lng];
        this.lat = params.lat,
          this.lng = params.lng

      }
    });

    //for shop and service user
    console.log(this.selected);

    if (this.selected == 1) {
      this.auth.getservice(this.selectedService, this.lat, this.lng).subscribe({
        next: data => {
          this.url = URL;
          this.user = data
          console.log(this.user);
          this.form.location=this.latlng
 console.log(this.latlng);
 
        }
      })
      this.service.services().subscribe({
        next: (data) => {
          this.serviceData = data.data
          console.log(this.serviceData);

          // console.log(this.serviceData)
          this.form.service = this.selectedService;
        }
      })
    }

    if (this.selected == 2) {
      console.log("seleted ---", this.selected);
      this.auth.getshop(this.selectedService, this.lat, this.lng).subscribe({
        next: data => {
          this.url = URL;
          this.user = data
          console.log("this user-----", this.user);
          this.form.location=this.user.geo_address
          console.log(this.latlng);
          
        }

      })

      this.shop.shops().subscribe({
        next: (data) => {
          this.serviceData = data.data
          console.log(this.serviceData);

          // console.log(this.serviceData)
          this.form.service = this.selectedService;
        }
      })



    }

  }

  ionViewDidEnter() {


    this.autocomplete.getInputElement().then((ref => {
      const autocomplete = new google.maps.places.Autocomplete(ref);
      autocomplete.addListener('place_changed', () => {
        let response = autocomplete.getPlace();
        this.form.location = response.formatted_address;
        this.lat = response.geometry['location'].lat(),
        this.lng=response.geometry['location'].lng()
      })
    }))
  }
  onSubmit() {

    const { service } = this.form;
    console.log(this.form)

    this.auth.getservice(service, this.lat, this.lng).subscribe({
      next: data => {
        this.user = data.getUser
        console.log(data.getUser)
        // console.log(data.service)


      },
      error: err => {
        this.errorMessage = err.error.message;

      }
    });
  }
  async presentAlert(id: any) {
    console.log(id)
    let user = id
    const alert = await this.alertController.create({
      header: 'Please enter basic info',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'call',
          handler: (alertData) => { //takes the data 
            console.log(alertData.name, alertData.phone);
            let name = alertData.name; let phone = alertData.phone
            this.consumer.consumer(name, phone, user).subscribe({
              next: data => {
                console.log(data)
              }
            })
          }
        }
      ],
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          min: 3,
          max: 20,
          value: '',

        },

        {
          name: 'phone',
          type: 'number',
          placeholder: 'Mobile No.',
          min: 10,
          max: 10,
          value: ''
        },

      ],
    });

    await alert.present();
  }

  onClick(id: any) {
    console.log(id);
    this.clickId = id
    console.log(this.clickId);
    if (this.selected == 1) {
      this.selectedService = id
      this.auth.getservice(id, this.lat, this.lng).subscribe({
        next: data => {
          this.user = data
          // console.log(data.getUser)
          // console.log(data.service)


        },
        error: err => {
          this.errorMessage = err.error.message;

        }
      });
    }
    if (this.selected == 2) {
      this.selectedService = id
      this.auth.getshop(id, this.lat, this.lng).subscribe({
        next: data => {
          this.user = data
          // console.log(data.getUser)
          // console.log(data.service)
          console.log(this.user);
          


        },
        error: err => {
          this.errorMessage = err.error.message;

        }
      });
    }

    

  }
  launchPage(shopUser_id:any,shop_id:any,shopLocation:any){
    console.log(shopLocation);
    
    console.log(shopUser_id);
    console.log(shop_id);
    

    
    if(this.selected==2){
    const params: NavigationExtras = {
      queryParams: { shopUser_id:shopUser_id,shop_id:shop_id,latlng: this.latlng,shopLocation:shopLocation.coordinates}
    }
    this.router.navigate(['shop-product-details'], params)
  }
  }

}
