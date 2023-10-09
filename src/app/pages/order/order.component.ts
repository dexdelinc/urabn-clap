import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DetailService } from 'src/app/services/detail/detail.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
import { TokenStorageService } from 'src/app/services/token/token.service';
import { DetailPage } from '../detail/detail.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  orderData: any;
  itemData: any;
  search: any;
  filterKeys = ['name', 'statusbar'];
  orderItem: any;
  location: any;
  preUrl: any;
  updatedOrderData: any;
  deliveryValue: any;
  pickupValue: any;
  packingValue: any;
  message: any;
  deliveryBoy: any=[];
  constructor(
    private orderService: OrderService,
    private modalCtrl: ModalController,
    private detailService: DetailService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private loc: Location,
    private router:Router,
    private toastCtrl:ToastController

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.location = params.location;
      this.preUrl = params.preUrl
      console.log(params);

      if (this.preUrl == '/home') {
        this.orderService.getOrderForCustomer().subscribe({
          next: (data) => {
            this.orderData = data.getOrder;
            console.log(this.orderData);
          },
        });
      } else {
        this.orderService.getOrders().subscribe({
          next: (data) => {
            this.orderData = data.getOrder;
          },
        });
      }
    });
  }
  async presentToast(message:any,color:any) {
    let toast = await this.toastCtrl.create({
      message:message ,
      duration: 1500,
      position: 'top',
      color:color
      
    });

    toast.present();
  }
  onCancel(item: any) {
    this.orderService.updateOrder(item._id, item.status - 1).subscribe({
      next: (data) => {
        console.log(data);
        this.updatedOrderData = data;
        this.presentToast(data.message,'success')
        this.ngOnInit();
      },error:err=>{
        this.presentToast(err.message,'danger')
     
      }
    });
  }

  onConfirm(item: any) {
    this.orderService.updateOrder(item._id, item.status + 1).subscribe({
      next: (data) => {
        console.log(data);
        this.presentToast(data.message,'success')

        this.updatedOrderData = data;
        this.ngOnInit();
      },error:err=>{
        this.presentToast(err.message,'danger')
     
      }
    });
  }

  onCall(item: any) {}

  async onDetail(item: any) {
    console.log(item);

    this.detailService.addProduct(item);
    let modal = await this.modalCtrl.create({
      component: DetailPage,
      cssClass: 'cart-modal',
      componentProps: {
        preUrl: this.preUrl
      },
    });
    modal.onWillDismiss().then(() => {
      // this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft')
      // this.animateCSS('bounceInLeft');
    });
    modal.present();
  }

  async presentAlert(item: any) {
    console.log(item);
    if(item.deliveryStatus == 'Out for Delivery'){
      this.deliveryValue = 'Out for Delivery';
    } else if (item.deliveryStatus == 'Ready for Pickup'){
      this.pickupValue = 'Ready for Pickup';
    }else{
      this.packingValue = 'Ready for Packing';
    }
    const alert = await this.alertController.create({
      header: 'Track Order',
      message: 'Order Id:' + ' ' + item._id,
      inputs: [
        {
          label: 'Ready for Packing',
          type: 'radio',
          value: 'Ready for Packing',
          disabled: this.pickupValue || this.deliveryValue,
          checked: this.packingValue
        },
        {
          label: 'Ready for Pickup',
          type: 'radio',
          value: 'Ready for Pickup',
          disabled: this.deliveryValue,
          checked: this.pickupValue
        },
        {
          label: 'Out for Delivery',
          type: 'radio',
          value: 'Out for Delivery',
          disabled: this.deliveryValue,
          checked: this.deliveryValue
        }, 
      ],
      buttons: [
        {
          
            text: "OK",


          cssClass: 'alert-button-cancel',
          handler: (alertData) => {
            console.log(alertData);
            this.orderService.updateDeliveryStatus(item._id, alertData).subscribe({
              next: data => {
                console.log(data);
        this.presentToast(data.message,'success')

                this.ngOnInit();
              },error:err=>{
                this.presentToast(err.message,'danger')
             
              }
            })
            this.orderService
              .deliveryProviderUser(
                parseInt(this.location[0]),
                parseInt(this.location[1])
              )
              .subscribe({
                next: (data) => {
                  console.log(data);
                  for(item of data){
                  this.deliveryBoy.push(item._id).sort
                  }
                  this.deliveryBoy = this.deliveryBoy.filter((el:any, i:any, a:any) => i === a.indexOf(el))

                  console.log(this.deliveryBoy);
                  // this.sendRequest()
                  // this.orderService.addDeliveryBoy(this.deliveryBoy).subscribe({
                  //   next:  (data)=>{
                  //     console.log(data);
                      
                  //   }
                  // })
                  
                },error:err=>{
                  this.presentToast(err.message,'danger')
               
                }
              });
          },
        },
        
      ],
      
    });

    await alert.present();
  }

  orderStatus(item: any) {
    this.presentAlert(item);
  }
  markDeliver(item: any) {
     this.orderService.updateOrder(item._id, item.status + 1).subscribe({
       next: (data) => {
         console.log(data);
        this.presentToast(data.message,'success')

         this.updatedOrderData = data;
         this.ngOnInit();
       },error:err=>{
        this.presentToast(err.message,'danger')
     
      }
     });
  }
  goBack() {
    this.loc.back();
  }
  sendRequest(){
    this.orderService.addDeliveryBoy(this.deliveryBoy).subscribe({
      next:  (data)=>{
        console.log(data);
        this.presentToast(data.message,'success')

        
      },error:err=>{
        this.presentToast(err.message,'danger')
     
      }
    })
  }
  tracking(item:any) {
    console.log(item);
    
    const params: NavigationExtras = {
      queryParams: {
        customerAddress: item.address,
        shopAddress:item.shopAddress,
        deliveryBoy:item.acceptDeliveryBoy,
        shopUser:item.shopUser
      },
    }
    this.router.navigate(['/tracking'], params);


  }
}
