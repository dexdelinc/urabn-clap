import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { OrderService } from 'src/app/services/order/order.service';
import { PaymentService } from 'src/app/services/payment/payment.service';

@Component({
  selector: 'app-earning',
  templateUrl: './earning.page.html',
  styleUrls: ['./earning.page.scss'],
})
export class EarningPage implements OnInit {
  withdrawl: any =  { id: 2, name: 'Withdraw', src: 'assets/icons/cash-withdrawal.png', background: 'rgba(106,100,255, 0.1)', page: '' }
  addBankInfo:any=  { id: 2, name: 'Add Bank', src: 'assets/icons/cash-withdrawal.png', background: 'rgba(106,100,255, 0.1)', page: '' }

  transactions: any[] = [
    { id: 1, vendor: 'Received from PhonePe', image: '', amount: 1500, time: '3:00PM' },
    { id: 2, vendor: 'Flaticons', image: '', amount: -1200, time: '4:00PM' }
  ];
  orderData: any;
  totalAmt: any;
  priceValues: any = [];
  bankId: any;
  payoutData:any;
  payoutValues: any = [];

  constructor(private toastCtrl:ToastController,private auth: AuthService,private router:Router,private orderService: OrderService,private alertController:AlertController,private payment:PaymentService) { }
  ngOnInit() {
    this.auth.getShopuser().subscribe({
      next: (data) => {
       
        console.log(data.getUser.bankDetails);
        this.bankId=data.getUser.bankDetails
      
    }})  
    this.orderService.getOrders().subscribe({
      next: (data) => {
        console.log(data);

        this.orderData = data.getOrder;
        for (let i = 0; i < this.orderData.length; i++) {
          console.log(this.orderData[i].totalPrice);
          this.priceValues.push(this.orderData[i].totalPrice)
        }
        var sum = 0;
        for (var i = 0; i < this.priceValues.length; i++) {

          sum += parseInt(this.priceValues[i]);

        }
        this.totalAmt=sum

        // console.log(this.totalAmt);

      },
    });
    this.payment.getpayoutRequest().subscribe({
      next: data=>{
        console.log(data);

      this.payoutData = data;
      for (let i = 0; i < this.payoutData.length; i++) {
        console.log(this.payoutData[i].amount);
        this.payoutValues.push(this.payoutData[i].amount)
      }
      var sum = 0;
      for (var i = 0; i < this.payoutValues.length; i++) {

        sum += this.payoutValues[i]
     console.log(typeof(sum));
     
      }
      this.totalAmt=this.totalAmt-sum
      // this.totalPayoutAmt=sum
      //   console.log(this.totalPayoutAmt);
        
      }
    })

    
  }
  async presentToast(message: any, color: any) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: color,
    });

    toast.present();
  }
  async addBank() {
    const alert = await this.alertController.create({
      header: 'Please enter Bank Details',
      buttons: [ {
        text: 'ADD BANK',
        role: 'submit',
        handler: (alertData) => {
          console.log(alertData);
          if(alertData!==''){
            let bank_account={
            "bankname":alertData.bankname,
            "ifsc":alertData.ifscCode,
            "name":alertData.name,
            "account_number":alertData.accountNo,
            "account_type":alertData.accountType
          }
          if(alertData.bankname==''||alertData.ifscCode==''||alertData.name==''||alertData.accountNo==''||alertData.accountType==''){
          this.presentToast("All input is required",'danger')
         return false
        }
          else {
           this.payment.addBank(alertData.name,bank_account).subscribe({
            next: (data) => {
              console.log(data)
              this.presentToast('Bank details add Successfully','success')
              // this.router.navigate(['']);
            },error: (err) => {
              this.presentToast(err.error.message,'danger')

            },
          })}
        }
        },
      },],
      inputs: [
        { 
        name: 'bankname',
         type: 'text',
          placeholder: 'Bank Name',
        },
        {
          name: 'name',
         type: 'text',
          placeholder: 'Account Holder Name ',
      
          attributes: {
          
            maxlength: 40,
          },
        },
        {
          name:'accountNo',
          type: 'number',
          placeholder: 'Account no',
          min: 5,
          max: 50,
        },
        {
          name:'ifscCode',
          placeholder: 'IFSC code',
          type: 'text',
          attributes: {
          
            maxlength: 20,
          },
        },
        {
          name:'accountType',
          placeholder: 'accountType',
          type: 'text',
          attributes: {
            minlength:3,
            maxlength: 20,
          },
        },
      ],
    });
   
    // {
    //   label: 'Green',
    //   type: 'radio',
    //   value: 'green',
    // },
    await alert.present();
  }
  async withdrawlAmt() {
    this.totalAmt=1000
    const alert = await this.alertController.create({
      header: 'Please enter withdrawl amt',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
        }
      },
         {
        text: 'Withdraw',
        role: 'submit',
        handler: (alertData) => {
          console.log(alertData);
          
          if(alertData.amt == ''||alertData.amt<100){
            if (!alert.getElementsByClassName("validation-errors").length) {
              const input = alert.getElementsByTagName("input")[0];

              const validationErrors = document.createElement("div");
              validationErrors.className = "validation-errors";

              const errorMessage = document.createElement("small");
              errorMessage.classList.add("error-message");
              console.log(alertData.amt);
              
              errorMessage.textContent = "*Invalid amount";
              validationErrors.appendChild(errorMessage);

              input.insertAdjacentElement("afterend", validationErrors);
            }

            return false;
          }
          if(alertData.amt > this.totalAmt){
            if (!alert.getElementsByClassName("validation-errors").length) {
              const input = alert.getElementsByTagName("input")[0];

              const validationErrors = document.createElement("div");
              validationErrors.className = "validation-errors";

              const errorMessage = document.createElement("small");
              errorMessage.classList.add("error-message");
              console.log(alertData.amt);
              
              if(this.totalAmt < alertData.amt){
                errorMessage.textContent = "*Amount greater than available balance."
              }else{
              errorMessage.textContent = "*Amount greater than available balance.";
            }
              validationErrors.appendChild(errorMessage);

              input.insertAdjacentElement("afterend", validationErrors);
            }
            return false
          }
          if (alertData.amt < this.totalAmt){
            // /^([2-9]{1}[0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(
            //   formData.mobilePhone{
              this.payment.payoutRequest(alertData.amt).subscribe({
                next: data => {
                  console.log(data);
                  
                  this.presentToast('Payout request send to Admin','success')

                },error: (err) => {
                  this.presentToast(err.error.message,'danger')
    
                }
              })
            return alertData;
          } 
        },
      },],
      inputs: [
        
        {
          name:'amt',
          type: 'number',
          placeholder: 'Amount',
          min: 1,
          max: 10,
        },
      ],
    });

    await alert.present();
  }
}
