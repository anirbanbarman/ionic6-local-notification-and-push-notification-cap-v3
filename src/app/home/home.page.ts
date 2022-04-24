/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { LocalNotifications, LocalNotificationSchema } from '@capacitor/local-notifications';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  notificationDelayInSeconds = '';
  constructor() {
    LocalNotifications.createChannel({
      id: 'CurrencyAlerts',
      name: 'CurrencyAlerts',
      importance: 5,
      description: 'Currency alerts',
      sound: 'notification.mp3',
      visibility: 1,
      vibration: true,
      });

  }
  ngOnInit(): void {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );

  }


  scheduleNotification() {
    const delay=window.prompt('enter delay in seconds');
    this.notificationDelayInSeconds=delay;
    const options: LocalNotificationSchema = {
      id: 12345,
      title: 'Join My company',
      body: 'this is body',
      smallIcon:'ic_stat_notifications',
      iconColor:'#03cffc',
      sound:'assets/sound/notification.mp3',
      summaryText: 'Hi Anirban Here ',
      largeBody: 'Hi Team ,Happy to see you thanks ',
      schedule: {
        // every: 'minute'

        // eslint-disable-next-line radix
         at: new Date(new Date().getTime() + parseInt(this.notificationDelayInSeconds) * 1000)

      },
      extra: 'extra'
    };
    LocalNotifications.schedule({ notifications: [options] })
      .then(() => {
        alert('Notification Will Appear after' +this.notificationDelayInSeconds +'seconds');
      });
  }
}
