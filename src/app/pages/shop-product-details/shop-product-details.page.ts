import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
import { CartComponent } from '../cart/cart.component';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
const URL = environment.baseUrl;
@Component({
  selector: 'app-shop-product-details',
  templateUrl: './shop-product-details.page.html',
  styleUrls: ['./shop-product-details.page.scss'],
})
export class ShopProductDetailsPage implements OnInit {
  productData: any;
  search: any;
  filterKeys = ['name','discription'];
  showFooter = false;
  showRemove = false;
  errorMessage: any;
  message: any;
  su_id: any;
  latlng: any;
  itemId: [];
  itemData = [];
  orderData: any;
  itemCount: any;
  phoneNo: any;
  count = 0;
  subscription: Subscription;
  number: any;
  cartItemCount: BehaviorSubject<number>;
  cart = [];
  newImage: any;
  imageData: any;
  thumbnail: any;
  url: any;
  shopLocation: any;
  constructor(private route: ActivatedRoute, private shopProduct: ShopProductService,
    private cartService: CartService, private modalCtrl: ModalController, private sanitizer: DomSanitizer) {
    }

  ngOnInit() {
    // this.cart = this.cartService.getCart();
    // console.log(this.cart);
    
    this.cartItemCount = this.cartService.getCartItemCount();
    this.itemCount = this.cartItemCount;
    
    this.route.queryParams.subscribe(params => {
      if (params) {
        console.log(params);
        console.log(params.latlng);
        this.su_id=params.shopUser_id;
        this.latlng=params.latlng;
        this.shopLocation=params.shopLocation
        console.log(this.shopLocation);
        

        this.shopProduct.getShopProductById(params.shopUser_id, params.shop_id,).subscribe({
          next: data => {
            this.url = URL;
            console.log(data);
            // this.imageData = data
            // for (let i = 0; i < data.length; i++) {
            //   this.newImage = this.imageData[i].image.data
            //   this.thumbnail = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + this.newImage);
           
            // }
            this.productData = data;
          }
        });
      }
    });
  }


  onAdd(item: any){
    console.log(item);
    this.itemId = item._id;
    this.itemData.push(this.itemId);
    // console.log(this.itemData);
    item.original_price = item.price
    this.showFooter= true;
    this.showRemove = true;
    this.cartService.addProduct(item);
    // this.animateCSS('tada');
  }

  // async presentAlert() {
  //   const alert = await this.alertController.create({
  //     header: 'Confirm Order',
  //     subHeader: this.errorMessage,
  //     message: this.errorMessage,
  //     buttons: [{
  //       text: 'Cancel',
  //       role: 'cancel',
  //       handler: () => {
  //       }
  //     },{
  //       text: 'Add',
  //       handler: (alertData) => { //takes the data
  //         let name = alertData.name; let phone = alertData.phone;
  //         this.phoneNo = alertData.phone;
  //         this.orderService.createOrder(name, phone, this.latlng, this.itemData, this.su_id).subscribe({
  //           next: data => {
  //             console.log(data);
  //             this.orderData = data;
  //             this.message = data.message;
  //             this.presentToast();
  //             this.showFooter = false;
  //           }
  //         })
  //       }
  //     }],
  //     inputs: [{
  //       name: 'name',
  //       placeholder: 'Enter your name',
  //     },
  //     {
  //       name: 'phone',
  //       type: 'number',
  //       placeholder: 'Enter your mobile no.',
  //     }
  //   ],
  //   });

  //   await alert.present();
  // }

  // async presentToast() {
  //   const toast = await this.toastCtrl.create({
  //     message: this.message,
  //     duration: 1500,
  //     position: 'top'
  //   });

  //   await toast.present();
  // }


  // onProceed(){
  //   this.presentAlert();
  // }

  async onGotoCart(){
    // const params: NavigationExtras = {
    //   queryParams: { id: this.itemData}
    // }
    // this.router.navigate(['/cart'], params);
    let modal = await this.modalCtrl.create({
      component: CartComponent,
      cssClass: 'cart-modal',
      componentProps: {
        itemData: this.itemData,
        latlng: this.latlng,
        su_id: this.su_id,
        itemCount: this.itemCount,
        shopLocation:this.shopLocation
      }
    });
    modal.onWillDismiss().then(() => {
      // this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      // this.animateCSS('bounceInLeft');
    });
    modal.present();
  }

  onCancel(){
    this.showFooter = false;
    this.count = 0;
    this.number = '';
    this.cartItemCount.next(0);
  }

  // animateCSS(animationName, keepAnimated = false) {
  //   const node = this.fab.nativeElement;
  //   node.classList.add('animated', animationName)

  //   //https://github.com/daneden/animate.css
  //   function handleAnimationEnd() {
  //     if (!keepAnimated) {
  //       node.classList.remove('animated', animationName);
  //     }
  //     node.removeEventListener('animationend', handleAnimationEnd)
  //   }
  //   node.addEventListener('animationend', handleAnimationEnd)
  // }

}
