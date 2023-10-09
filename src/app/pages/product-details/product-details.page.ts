import { Component, OnInit, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { App } from '@capacitor/app';
import { AlertController, IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
import { environment } from 'src/environments/environment';
const URL = environment.baseUrl;
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  page = 1;
  product: any;
  message: any;
  add: false;
  delete: false;
  sausage: any;
  ischecked: boolean = true;
  imageData: any;
  thumbnail: any;
  newImage: any;
  url: any;
  constructor(private shopProduct: ShopProductService, private toastController: ToastController,private platform:Platform,private router: Router,
    private alertController: AlertController, private sanitizer: DomSanitizer,
    @Optional() private routerOutlet?: IonRouterOutlet,) { 
      this.platform.backButton.subscribeWithPriority(-1, () => {
        if (this.routerOutlet.canGoBack()) {
          this.router.navigateByUrl('/shop-user-profile').then(() => {
            // window.location.reload();
          });
        }
      }); 
    }

  ngOnInit() {
   this.getProducts();
  }

  getProducts(){
    this.shopProduct.getShopProduct().subscribe({
      next: data => {
        this.url = URL;
        console.log(data);
        this.product = data.getShopProduct
        console.log(this.imageData); 
      }
    });
  }
  async presentAlert() {

    const alert = await this.alertController.create({
      header: 'Please enter Product info',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: () => {
          // this.handlerMessage = 'Alert canceled';
        },
      }, {
        text: 'ADD',
        cssClass: 'alert-button-cancel',
        handler: (alertData) => { //takes the data 

          console.log(alertData.quantity);
console.log(alertData);

      
        }
      }],
      inputs: [
        {
          name: 'name',
          placeholder: 'Product-Name',
        },

        {
          name: 'price',
          type: 'number',
          placeholder: 'Price',

        },
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'Quantity',

        },
        {
          name: 'description',
          placeholder: 'description',

        }

      ],
    });

    await alert.present();
  }

  async presentToast(position: 'top') {
    const toast = await this.toastController.create({
      message: this.message,
      duration: 1500,
      position: position
    });

    await toast.present();
  }
  async deleteAlert(p_id: any) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Are you sure',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
        handler: () => {
          // this.handlerMessage = 'Alert canceled';
        },
      }, {
        text: 'yes',
        cssClass: 'alert-button-cancel',
        handler: () => {
          this.shopProduct.deleteShopProduct(p_id).subscribe({
            next: data => {
              this.message = data.message
              this.ngOnInit()
              this.presentToast('top')
            }
          })
        }
      }],
    });

    await alert.present();
  }

  statusUpdate(event: any, p_id: any,i: number) {
   
    this.product[i].status = !this.product[i].status;
    console.log("product------",this.product[i])

    this.shopProduct.updateShopProductStatus( this.product[i].status,p_id).subscribe({
      next: data => {
        this.message = data.message
        this.ngOnInit()
        this.presentToast('top')
      }

    })
    
    // if (this.ischecked == true) {
      // this.shopProduct.updateShopProductStatus( 0,p_id).subscribe({
      //   next: data => {
      //     console.log(data);
      //     this.ischecked = false
      //     this.message = data.message
      //     this.ngOnInit()
      //     this.presentToast('top')
      //   }

      // })
    // }
    // if (this.ischecked == false) {
    //   this.shopProduct.updateShopProductStatus(1,p_id).subscribe({
    //     next: data => {
    //       console.log(data);
    //       this.ischecked = true
    //       this.message = data.message
          
    //           this.ngOnInit()
    //           this.presentToast('top')

    //     }
    //   })
    // }

  }

  loadMore(event: any) {
  setTimeout(() => {
      this.page++;
      this.getProducts();
        event.target.complete();
    }, 1000);
  }
}
