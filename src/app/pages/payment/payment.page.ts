import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { Location } from "@angular/common";
import { environment } from 'src/environments/environment';
import { Stripe ,PaymentSheetEventsEnum, ApplePayEventsEnum } from '@capacitor-community/stripe';
import { first,lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
const AUTH_API = environment.baseUrl;
declare var Razorpay: any

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  paymentStatus: any;
  status: 2;
  usertype: string
  data:any= {
    name:"",
    email:"",
    amount:'',
    currency:''
  }
  key: any;
  text: any;
  planFee: any;
  planTime: any;
  constructor(private toastCtrl: ToastController, private http: HttpClient, private alertController: AlertController,
    private paymentHistory: PaymentService, private router: Router, private location: Location,private auth:AuthService) {
     
     }

  ngOnInit() {
    this.paymentHistory.getChargesInformation().subscribe({
      next:(data)=>{
        console.log("#####################################3",data);
        this.key=data.publishableKey,
        this.text=data.text,
        this.planFee=data.planFee,
        this.planTime=data.planTime
        Stripe.initialize({
          publishableKey: this.key,
        });
       
      }


    })
     this.auth.getShopuser().subscribe({
      next: (data) => {
        console.log(data);
        this.usertype="shop"
        this.data= {
          name:data.getUser.firstname+" "+ data.getUser.lastname,
          email:data.email,
          amount:this.planFee,
          currency:'INR'
        }
      },
    });

    this.auth.getuser().subscribe({
      next: data => {
        console.log(data);
        this.usertype="service"
        this.data= {
          name:data.getUser.firstname+" "+ data.getUser.lastname,
          email:data.email,
          amount:this.planFee,
          currency:'INR'
        }

      }
    })
    // this.paymentHistory.getChargesInformation().subscribe({
    //   next:(data)=>{
    //     console.log("#####################################3",data);
    //     this.key=data.publishableKey
    //     Stripe.initialize({
    //       publishableKey: this.key,
    //     });
       
    //   }


    // })
  }
  buy(plan) {
    let name, price, theme, param

    if (plan == 'basic') {

      name = "Base_Plan";
      price = "73000"
      theme = "#8F46EE"
      param = "payment"
    }
    this.http.get(AUTH_API + param).subscribe(res => {
      var options = {
        "key": 'rzp_test_nWQ8aWt5I8GrCt',
        "name": name,
        "discription": "Testing puspose",
        "amount": price,
        "currency": "INR",
        "image": "/assets/img/",
        "order_id": res["id"],
        "handler": (response: any) => {
          this.presentAlert()
          console.log(response);
          this.paymentStatus = response
      
        },
        "theme": {
          "color": theme
        }

      }
      this.initPay(options);
    

    })
  }
  initPay(options: any) {
    var rzp1 = new Razorpay(options);
    rzp1.open();
  }
  async presentToast() {
  
    const toast = await this.toastCtrl.create({
      message: "payment Successful",
      color:"success",
      buttons: [
        {
          text: 'save',
          handler: () => { //takes the data 
            this.paymentHistory.userPayment(this.status, this.usertype, this.paymentStatus).subscribe({
              next: data => {
                console.log(data)
                if(this.usertype=="shop"){
                  this.router.navigate(['shop-user-profile']);
                }
                if(this.usertype=="service"){
                  this.router.navigate(['user-profile']);

                }
              }
            })
              }
            }
      
            
      ]
    })
    toast.present()
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Payment Successfull!!!',
      cssClass: 'custom-alert',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          role: 'submit',
          handler: () => {
            this.paymentHistory.userPayment(this.status, this.usertype, this.paymentStatus).subscribe({
              next: data => {
                console.log(data)
                if(this.usertype=="shop"){
                  this.router.navigate(['shop-user-profile']);
                }
                if(this.usertype=="service"){
                  this.router.navigate(['user-profile']);

                }
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }
  goBack(){
    this.location.back();
  }
  httpPost(body:any){
    return this.http.post<any>(environment.baseUrl + 'payment-sheet', body).pipe(first())
    }
    async paymentSheet() {
      console.log(this.data);
      
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });
     
      // Connect to your backend endpoint, and get every key.
      const data$ =  this.httpPost(this.data)
      const { paymentIntent, ephemeralKey, customer }=await lastValueFrom(data$)
      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: "Swork7",
      });
    
      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      console.log(result);
      
      if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
        console.log("happay");
        this.paymentStatus = {
          paymentIntent:paymentIntent,
          ephemeralKey:ephemeralKey,
          customer:customer
        }
        this.presentAlert()
        // this.presentToast()
        // return paymentIntent.split('_').slice(0,2).join('_')
     
      }
    };
}
