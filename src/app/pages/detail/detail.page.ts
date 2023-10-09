import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { CartService } from 'src/app/services/cart/cart.service';
import { DetailService } from 'src/app/services/detail/detail.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  @Input() preUrl: any;
  orderData: any;
  errorMessage: any;
  message: any;
  su_id: any;
  itemData = [];
  detailData = [];
  latlng: any;
  phoneNo: any;
  itemCount: any;
  itemName = [];
  item = [];
  totalValue: any;
  shopId: any;
  detail = [];
  amount: any;
  cartTotal: any;
  itemPrice: any;
  originalPrice: any;
  checkoutForm: any;
  o_id: any;
  updatedOrderData: any;

  constructor(private route: ActivatedRoute, private router: Router, private shopProduct: ShopProductService,
    private orderService: OrderService,private toastCtrl: ToastController,private cartService: CartService, 
    private modalCtrl: ModalController, private alertCtrl: AlertController,private detailService: DetailService) { }

  ngOnInit() {   
    this.detail = this.detailService.getCart();
    for(let i=0;i<this.detail.length;i++){
      this.detailData = this.detail[i].item;
      
      
    }
    console.log(this.detail);
    for(let i=0;i<this.detail.length;i++){
      this.shopId = this.detail[i].shopProduct 
    }
    
    
  }

 

  decreaseCartItem(product,i) {
    this.detailData[i].amount = (this.detailData[i].amount -1);
    this.detailData[i].price = (this.detailData[i].original_price * this.detailData[i].amount);
  }

  increaseCartItem(product,i) {
    this.detailData[i].amount = (this.detailData[i].amount +1);
    this.detailData[i].price = (this.detailData[i].original_price * this.detailData[i].amount);
   // this.itemPrice = this.detailData[i].price;
   // console.log(this.detailData[i].price);
    
  }

  removeCartItem(product,i) {
    this.detailData.splice(i,1);
    // this.detailService.removeProduct(product);
  }

  getTotal() {
    return this.totalValue= this.detailData.reduce((i, j) => i + j.basePrice * j.amount, 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async confirm() {
 
    for(let i=0;i<this.detail.length;i++){
      this.o_id = this.detail[i]._id
      
    }

    
    this.presentAlert();
  }

async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Order',
      subHeader: this.errorMessage,
      message: this.errorMessage,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },{
        text: 'Add',
        handler: () => { //takes the data
          this.orderService.UpdateOrderProducts(this.o_id,this.detailData,this.totalValue).subscribe({
            next: data => {
              console.log(data);
              this.updatedOrderData = data;
              this.message = data.message;
              this.presentToast();
              this.modalCtrl.dismiss();
              this.ngOnInit();
            }
          })
        }
      }],
    //   inputs: [{
    //     name: 'name',
    //     placeholder: 'Enter your name',
    //   },
    //   {
    //     name: 'email',
    //     placeholder: 'Enter your Email',
    //   },
    //   {
    //     name: 'phone',
    //     type: 'number',
    //     placeholder: 'Enter your mobile no.',
    //   },
    //   {
    //     name: 'address',
    //     type: 'text',
    //     placeholder: 'Enter your address',
    //   }
    // ],
    });

    await alert.present();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.message,
      duration: 1500,
      position: 'top'
    });

    await toast.present();
  }
}
