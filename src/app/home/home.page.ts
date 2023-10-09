import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@awesome-cordova-plugins/in-app-browser/ngx';
import { App } from '@capacitor/app';
import {
  AlertController,
  IonRouterOutlet,
  IonSearchbar,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth/auth.service';
import { ServiceService } from '../services/service/service.service';
import { ShopService } from '../services/shop/shop.service';
import { TokenStorageService } from '../services/token/token.service';
import { App as CapacitorApp } from '@capacitor/app';
import { __await } from 'tslib';
import { DomSanitizer } from '@angular/platform-browser';
import { FcmService } from '../services/fcm/fcm.service';
import { OrderService } from '../services/order/order.service';
import { BackgroundTask } from '@capawesome/capacitor-background-task';
import { Geolocation } from '@capacitor/geolocation';
import { Dialog } from '@capacitor/dialog';
declare var google;
const mapKey = environment.mapsKey;
const URL = environment.baseUrl;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  filterKeys = ['name'];
  @ViewChild('autocomplete')
  autocomplete: IonSearchbar;

  @ViewChild('map')
  mapRef: ElementRef<HTMLElement>;

  @Input()
  newMap: any;

  map_image = `https://maps.googleapis.com/maps/api/staticmap?center=&zoom=15&scale=1&size=600x300&maptype=roadmap&key=AIzaSyCPRH8Ypc1zpY8NLsRG9__jFr6a1aadObU&q=&format=png&visual_refresh=true&markers=icon:https://eatura.de/upload/driver/locationpin.png%7Cshadow:true%7C30.7333148,76.7794179}`;
  markerId: string;

  form: any = {
    service: '',
    location: '',
  };
  latlng: any;
  search: string;
  errorMessage: any;
  serviceData: any;

  selected = 1;
  current: any;
  lat: any;
  empty = [];
  canter: any = {
    lat: 30.6998327,
    lng: 76.7295102,
  };
  customerData: any;
  token: string;
  label: any;
  imageData: any;
  newImage: any;
  thumbnail: any;
  url: any;
  orderData: any;
  progressBar: boolean=true
  constructor(
    private fcmService: FcmService,
    private alertController: AlertController,
    private auth: AuthService,
    private router: Router,
    private browser: InAppBrowser,
    private service: ServiceService,
    private shop: ShopService,
    private tokenService: TokenStorageService,
    private toastCtrl: ToastController,
    private loader: LoadingController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private orderService: OrderService,
    private loadingCtrl: LoadingController,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
    const printCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      this.canter = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      };

      console.log('Current position:', coordinates.coords.latitude);
    };
    // setInterval(function () { printCurrentPosition() }, 3000);
  }

  printCurrentPosition = async () => {
    const coordinates = await Geolocation.getCurrentPosition();
    this.canter = {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };

    console.log('Current position:', coordinates.coords.latitude);
  };
  async ionViewDidEnter() {
    App.addListener('appStateChange', async ({ isActive }) => {
      console.log(1, '!!!!!!!!!!!!!!!');

      if (isActive) {
        console.log('hello');

        return;
      }
      // The app state has been changed to inactive.
      // Start the background task by calling `beforeExit`.
      const taskId = await BackgroundTask.beforeExit(async () => {
        // Run your code...
        // Finish the background task as soon as everything is done.
        BackgroundTask.finish({ taskId });
      });
    });
    // Auto completed place api
    console.log(this.canter);

    this.placeApi();
    this.printCurrentPosition();
    this.createMap();
  }
  async showLoading(sec: any) {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 1000 * sec,
      cssClass: 'custom-loading',
      showBackdrop: true,
    });

    loading.present();
  }
  ngOnInit() {
    this.fcmService.fcm();
    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      }
    });

    this.token = this.tokenService.getToken();

    this.latlng = JSON.parse(window.localStorage.getItem('latlng')) || null;

    this.service.services(this.search).subscribe({
      next: (data) => {
        setTimeout(()=>{
          this.progressBar=false
        },2000)
        this.serviceData = data.data;
        console.log(this.serviceData);
      },
    });
    if (this.token !== null) {
      this.auth.getCustomer().subscribe({
        next: (data) => {
          console.log(data);
          this.customerData = data.getCustomer;
          if (this.customerData !== null) {
            return (this.label = 'Customer');
          }
        },
      });
      this.auth.getEmployee().subscribe({
        next: (data) => {
          this.url = URL;
          this.imageData = data.getEmployee.imagePath;
          console.log(this.imageData);

          console.log(URL + data.getEmployee.imagePath);
          this.customerData = data.getEmployee;
          if (this.customerData !== null) {
            return (this.label = 'Employee');
          }
        },
      });

      this.auth.getuser().subscribe({
        next: (data) => {
          this.url = URL;
          this.imageData = data.getUser.imagePath;
          this.customerData = data.getUser;
          for (let item of this.customerData.service) {
            if (item == '634d13301ff749682b279f4b') {
              setInterval(async () => {
                const printCurrentPosition = async () => {
                  const coordinates = await Geolocation.getCurrentPosition();
                  console.log(coordinates.coords);

                  this.auth
                    .updateTempLocation(
                      coordinates.coords.latitude,
                      coordinates.coords.longitude
                    )
                    .subscribe({
                      next: (data) => {
                        console.log('*******************************', data);
                      },
                    });
                  // console.log('Current position:', coordinates.coords.latitude);
                };
                printCurrentPosition();
                // console.log(this.cord);
              }, 3000);
            }
          }
          if (this.customerData !== null) {
            return (this.label = 'Service User');
          }
        },
      });

      this.auth.getShopuser().subscribe({
        next: (data) => {
          this.url = URL;
          this.imageData = data.getUser.imagePath;
          this.customerData = data.getUser;
          if(this.customerData.status==1){
            setInterval(()=>{
            this.showAlert('Please choose your plan from profile to activate your shop account')

            },120000)
          }
          if (this.customerData !== null) {
            this.label = 'Shop User';
          }
        },
      });
    } else {
      return;
    }
    console.log(this.customerData);
  }
  placeApi = async () => {
    // await this.createMap(this.canter)

    this.autocomplete.getInputElement().then((ref) => {
      const autocomplete = new google.maps.places.Autocomplete(ref);
      autocomplete.addListener('place_changed', () => {
        // console.log(autocomplete.getPlace());
        let response = autocomplete.getPlace();
        // this.createMap();

        this.form.location = response.formatted_address;
        this.latlng = [
          response.geometry['location'].lat(),
          response.geometry['location'].lng(),
        ];
        console.log(this.canter);

        this.canter = {
          lat: this.latlng[0],
          lng: this.latlng[1],
        };
        console.log(this.canter);
        this.createMap().then((value) => {
          console.log(value);
        });
        window.localStorage.setItem(
          'latlng',
          JSON.stringify(this.latlng) || null
        );
      });
    });
  };
  ngAfterViewInit() {}
  doRefresh(refresher: any) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.ngOnInit();
      refresher.target.complete();
    }, 700);
  }
  async createMap() {
    // this.showLoading(0.5);
    this.newMap = new google.maps.Map(this.mapRef.nativeElement, {
      zoom: 14,
      center: this.canter,
    });
    // if (Capacitor.getPlatform() !== 'web') {
    //   await this.newMap.enableIndoorMaps(true);
    //   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1map');
    // }

    this.addMarker(this.newMap, this.canter);

    // this.addListeners();
  }

  async addMarker(map: any, latlng: any) {
    const icon = {
      url: 'assets/icons/4.png', // url
      scaledSize: new google.maps.Size(25, 25), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0), // anchor
    };

    new google.maps.Marker({
      position: latlng,
      map,
      // label: {
      //   text: "\ue530",
      //   fontFamily: "Material Icons",
      //   color: "white",
      //   fontSize: "30px",
      // },
      icon: icon,
      title: 'Swork7',
    });
  }
  async removeMarker(id?: any) {
    await this.newMap.removeMarker(id ? id : this.markerId);
  }

  async onSearch(event: any) {
    console.log(event);

    this.placeApi();
    console.log(this.latlng);
    this.createMap();
    console.log('!!!!!!!!!!!!!!!1');
    console.log('!!!!!!!!!!!!!!!2');
  }
  // submit value
  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }
  onSubmit(): void {
    const { service } = this.form;
    this.auth.getservice(service, this.latlng[0], this.latlng[1]).subscribe({
      next: (data) => {
        console.log(data);
        console.log(data.service);
        const params: NavigationExtras = {
          queryParams: { serviceValue: this.form.service },
        };

        this.router.navigate(['service-user'], params);
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      },
    });
  }
  changeSelected(flag: any) {
    this.selected = flag;
    if (this.selected === 1) {
      this.service.services(this.search).subscribe({
        next: (data) => {
          this.serviceData = data.data;
          console.log(this.serviceData);
        },
      });
    }
    if (this.selected === 2) {
      this.shop.shops(this.search).subscribe({
        next: (data) => {
          this.serviceData = data.data;
          console.log(this.serviceData);
        },
      });
    }
  }
  reloadPage(): void {
    window.location.reload();
  }
   showAlert = async (meassage:any) => {
    await Dialog.alert({
      title: 'Wait',
      message: meassage,
    });
  };
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Wait',
      subHeader: 'Select Your Location`s',
      message: 'Select Your Location!',
      // cssClass:'color=danger',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async customerAlert() {
    const alert = await this.alertController.create({
      header: '',
      subHeader:
        'You need to Register/LogIn as customer to see search results!',
      // message: '',
      // cssClass:'color=danger',
      buttons: [
        {
          text: 'Register',
          role: 'submit',
          // icon: 'trash',
          handler: () => {
            this.router.navigate(['/customer-register']);
          },
        },
        {
          text: 'Login',
          role: 'submit',
          // icon: 'trash',
          handler: () => {
            this.router.navigate(['/customer-login']);
          },
        },
      ],
    });

    await alert.present();
  }
  async onClick(id: any) {
    console.log(this.empty);
    console.log(this.latlng);

    console.log(id);
    if (this.latlng == undefined) {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!');

      // return await this.presentAlert();
      return this.showAlert('Select Your Location!')
    }

    if (this.selected === 1) {
      if (this.token !== null) {
        this.auth.getservice(id, this.latlng[0], this.latlng[1]).subscribe({
          next: (data) => {
            const params: NavigationExtras = {
              queryParams: {
                serviceValue: id,
                selected: this.selected,
                lat: this.latlng[0],
                lng: this.latlng[1],
              },
            };

            this.router.navigate(['service-user'], params);
          },
          error: (err) => {
            this.errorMessage = err.error.message;
          },
        });
      } else {
        return await this.customerAlert();
      }
    }
    if (this.selected === 2) {
      if (this.token !== null) {
        this.auth.getshop(id, this.latlng[0], this.latlng[1]).subscribe({
          next: (data) => {
            const params: NavigationExtras = {
              queryParams: {
                serviceValue: id,
                selected: this.selected,
                lat: this.latlng[0],
                lng: this.latlng[1],
              },
            };

            this.router.navigate(['service-user'], params);
          },
          error: (err) => {
            this.errorMessage = err.error.message;
          },
        });
      } else {
        return await this.customerAlert();
      }
    }
  }
  searchService() {
    if (this.selected == 1) {
      this.service.services(this.search).subscribe({
        next: (data) => {
          this.serviceData = data.data;
          console.log(this.serviceData);
        },
      });
    }
    if (this.selected == 2) {
      this.shop.shops(this.search).subscribe({
        next: (data) => {
          this.serviceData = data.data;
          console.log(this.serviceData);
        },
      });
    }
  }
  searchClick() {
    this.router.navigate(['/map']);
  }

  signOut() {
    this.tokenService.signOut();
    this.token = null;
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
    this.presentToast('Logged Out successfully', 'success');
  }

  goToProfile() {
    if (this.label == 'Shop User') {
      this.router.navigate(['/shop-user-profile']);
    }
    if (this.label == 'Service User') {
      this.router.navigate(['/user-profile']);
    }
    if (this.label == 'Customer') {
      this.router.navigate(['/customer-login']);
    }
    if (this.label == 'Employee') {
      this.router.navigate(['/employee-profile']);
    }
  }
  myOrder() {
    const params: NavigationExtras = {
      queryParams: {
        preUrl: this.router.url,
      },
    };
    this.router.navigate(['/order'], params);
  }
  tracking() {
    const params: NavigationExtras = {
      queryParams: {
        preUrl: this.customerData,
      },
    };
    this.router.navigate(['/tracking'], params);
  }

  employeeLogin() {
    const params: NavigationExtras = {
      queryParams: { url: 'employee' },
    };

    this.router.navigate(['/employee-login'], params);
  }
  // onSearch(event: any) {
  //   event.target.blur();
  // }
}
