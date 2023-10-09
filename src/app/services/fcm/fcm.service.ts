import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private newToken = new BehaviorSubject<any>({
    deviceToken: undefined,
  });

  constructor() { }
  
 fcm(){ 
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === 'granted') {
      PushNotifications.register();
    } else {
      // Show some error
    }
  });

  PushNotifications.addListener('registration', (token: Token) => {
    console.log("token",JSON.stringify(token));
    this.setNewUserInfo(token.value)
    // Push Notifications registered successfully.
    // Send token details to API to keep in DB.
  });

  PushNotifications.addListener('registrationError', (error: any) => {
    // Handle push notification registration error here.
  });

  PushNotifications.addListener(
    'pushNotificationReceived',
    (notification: PushNotificationSchema) => {
      // Show the notification payload if the app is open on the device.
    }
  );

  PushNotifications.addListener(
    'pushNotificationActionPerformed',
    (notification: ActionPerformed) => {
      // Implement the needed action to take when user tap on a notification.
    }
  );
}

  
  setNewUserInfo(token: any) {
    this.newToken.next(token);
  }

  getNewUserInfo() {
    return this.newToken.asObservable();
  }


}
