import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { environment } from 'src/environments/environment';
import { Stripe ,PaymentSheetEventsEnum, ApplePayEventsEnum } from '@capacitor-community/stripe';
import { first,lastValueFrom } from 'rxjs';
const AUTH_API = environment.baseUrl;
// let publishableKey='pk_test_51Mc4HxSInjEP45qtz9nVO5tvHHnVHs2KBFU77HSSpf2EWy4eBbjiiwqZUlb4UwOSRdMPxzrmLFDP7wMBtvVO5prr00hHaG8FWn'
declare var Razorpay: any

@Component({
  selector: 'app-make-payment',
  templateUrl: './make-payment.page.html',
  styleUrls: ['./make-payment.page.scss'],
})
export class MakePaymentPage implements OnInit {
  paymentStatus: any;
  status: 2;
  usertype: string = "shop"
  price: any;
  totalAmt: any;
  tax = 10;
  serviceCharge = 10;
  deliveryCharge = 10;
  orderId: any;
  orderDistance: any;
  key: any;
  data:any= {
    name:"",
    email:"",
    amount:'',
    currency:'INR'
  }
  customerName: any;
  customerEmail: any;
  constructor(private location: Location, private http: HttpClient, private alertController: AlertController,
    private paymentHistory: PaymentService, private router: Router, private route: ActivatedRoute) {
      console.log(this.key);
      
     
     }

 async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params) {
        this.price = parseInt(params.totalValue);
        this.orderId = params.id;
        this.orderDistance=params.orderDistance
        this.customerName=params.customerName
        this.customerEmail=params.customerEmail
      }
    })
    this.paymentHistory.getChargesInformation().subscribe({
      next:(data)=>{
        console.log(data);
        this.key=data.publishableKey
        console.log(this.key);
        
        Stripe.initialize({
          publishableKey: this.key
        })
        this.tax=Math.ceil(this.price*data.taxInPercent/100)
        this.serviceCharge=data.serviceCharge
        this.deliveryCharge=Math.ceil(this.orderDistance*data.deliveryChargePerKm/1000)
        this.totalAmt = this.price + this.tax + this.serviceCharge + this.deliveryCharge
      }
    })
    
  }

  goBack() {
    this.location.back();
  }

  buy(plan:any) {
    let name:any, price:any, theme:any, param:any
    if (plan == 'basic') {
      name = "Order Payment";
      price = `${this.totalAmt}`
      theme = "#8F46EE"
      param = "orderPayment"
    }

    console.log(price);

    this.http.post(AUTH_API + param, { totalAmount: price * 100 }).subscribe((res) => {
      var options = {
        key: this.key,
        name: name,
        discription: 'Testing purpose',
        amount: price * 100,
        currency: 'INR',
        image: '/assets/img/s-work7-logo-11.png',
        order_id: res['id'],
        handler: (response: any) => {
          this.presentAlert();
          console.log(response);
          this.paymentStatus = response;
        },
        theme: {
          color: theme,
        },
      };
      this.initPay(options);
    });
  }

  initPay(options: any) {
    var rzp1 = new Razorpay(options);
    rzp1.open();
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
            this.paymentHistory.orderPaymentRecord(2, this.usertype, this.orderId, this.paymentStatus,).subscribe({
              next: data => {
                console.log(data)
                this.router.navigate(['home']);
              }
            })
          },
        },
      ],
    });

    await alert.present();
  }

  httpPost(body:any){
    return this.http.post<any>(environment.baseUrl + 'payment-sheet', body).pipe(first())
    }
    async paymentSheet() {
      // be able to get event of PaymentSheet
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });
      this.data={
         name:this.customerName,
         email:this.customerEmail,
         amount:this.totalAmt*100,
        currency:'INR'
      }
      // Connect to your backend endpoint, and get every key.
      const data$ =  this.httpPost(this.data)
      const { paymentIntent, ephemeralKey, customer }=await lastValueFrom(data$)
      // prepare PaymentSheet with CreatePaymentSheetOption.
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: "anything",
      });
    
      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      if (result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
        console.log(paymentIntent.split('_').slice(0,2).join('_'));

        this.presentAlert()
        
     
      }
    };

  


}
