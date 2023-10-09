import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { ShopProductService } from 'src/app/services/shop-product/shop-product.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare const google 

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  orderData: any;
  errorMessage: any;
  message: any;
  su_id: any;
  itemData = [];
  latlng: any;
  phoneNo: any;
  itemCount: any;
  itemName = [];
  item = [];
  totalValue: any;
  original_price: any;
  orderItemPrice: any;
  customerData: any;
  shopLocation:any
  OrderDistance: any;

  constructor(private http:HttpClient,private auth: AuthService, private router: Router, private shopProduct: ShopProductService,
    private orderService: OrderService,private toastCtrl: ToastController,private cartService: CartService, 
    private modalCtrl: ModalController, private alertCtrl: AlertController) {
     
     }

cart = [];

  ngOnInit() {
    
    console.log(this.latlng);
    console.log(this.su_id);
    console.log(this.itemData);    
    console.log(this.itemCount._value);  
    console.log(this.shopLocation)  
    
    this.cart = this.cartService.getCart();
    console.log(this.cart);
    for(let i=0;i<this.cart.length;i++){
      this.itemName = this.cart[i];
      this.item.push(this.itemName);
    }
    
    console.log(this.item);
    this.auth.getCustomer().subscribe({
      next: (data) => {
        console.log(data);
        this.customerData = data.getCustomer;
      },
    });

    this.auth.getuser().subscribe({
      next: (data) => {
        console.log(data);
        this.customerData = data.getUser;
      },
    });
    this.auth.getShopuser().subscribe({
      next: (data) => {
        console.log(data);
        this.customerData = data.getUser;
      },
    });
    
   
  }

 getDistance(shopLocation:any, customerLocation:any) {
    const matrix = new google.maps.DistanceMatrixService();
    return new Promise((resolve, reject)=>{
      matrix.getDistanceMatrix({
      origins: [new google.maps.LatLng(shopLocation[0], shopLocation[1])],
      destinations: [new google.maps.LatLng(customerLocation[0],customerLocation[1])],
      travelMode: google.maps.TravelMode.DRIVING,
      }, (response:any, status:any)=> {
        if(status === 'OK'){
    this.OrderDistance=response.rows[0].elements[0].distance.value
      
          resolve(response)
      
        }else{
          reject(response);
        }
      });
    })
  }
  decreaseCartItem(product:any,i:any) {
    this.cart[i].amount = (this.cart[i].amount -1);
    this.cart[i].price = (this.cart[i].basePrice * this.cart[i].amount);
  }

  increaseCartItem(product:any,i:any) {

    this.cart[i].amount = (this.cart[i].amount +1);
    this.cart[i].price = (this.cart[i].basePrice * this.cart[i].amount);
    this.orderItemPrice = this.cart[i].price;
    console.log(this.orderItemPrice);
    
  }

  removeCartItem(product:any) {
    this.cartService.removeProduct(product);
  }

  getTotal() {
    return this.totalValue= this.cart.reduce((i, j) => i + j.basePrice * j.amount, 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async checkout() {
    this.getDistance(this.shopLocation,this.customerData.location.coordinates)

    // Perfom PayPal or Stripe checkout process

    // let alert = await this.alertCtrl.create({
    //   header: 'Thanks for your Order!',
    //   message: 'We will deliver your product as soon as possible',
    //   buttons: ['OK']
    // });
    // alert.present().then(() => {
    //   this.modalCtrl.dismiss();
    // });
    console.log(this.cartService.getCart());
    
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
        text: 'Make Payment',
        handler: (alertData) => { //takes the data

          console.log(this.item);
          for(let i=0;i<this.item.length;i++){
             delete this.item[i].image
          }
          
          let name = alertData.name; let phone = alertData.phone; let address = alertData.address; let email= alertData.email;
          this.orderService.createOrder(name, phone, email,this.item, this.orderItemPrice,this.totalValue, this.itemCount._value, address,
            this.latlng, this.itemData, this.su_id).subscribe({
            next: data => {
              console.log(data.productOrder._id);
              this.orderData = data;
              this.message = data.message;
              this.presentToast();  
              this.modalCtrl.dismiss();
                const params: NavigationExtras = {
                  queryParams: { totalValue: this.totalValue,id: data.productOrder._id,orderDistance:this.OrderDistance ,customerName:this.customerData.firstname + " " + this.customerData.lastname,customerEmail:this.customerData.email},
                };

                this.router.navigate(['/make-payment'],params)
            }
          })
        }
      }],
      inputs: [{
        name: 'name',
        placeholder: 'Enter your name',
        value: this.customerData.firstname + " " + this.customerData.lastname
      },
      {
        name: 'email',
        placeholder: 'Enter your Email',
        value: this.customerData.email
      },
      {
        name: 'phone',
        type: 'number',
        placeholder: 'Enter your mobile no.',
        value: this.customerData.phone
      },
      {
        name: 'address',
        type: 'text',
        placeholder: 'Enter your address',
        value: this.customerData.geo_address
      }
    ],
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