import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.app.Swork7',
  appName: 'Swork7',
  webDir: 'www',
  bundledWebRuntime: false,
  server: {
    "hostname": "smartworkindia7.com",
    "androidScheme": "https"
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      "launchAutoHide": false,
      "androidScaleType": "CENTER_CROP",
      "splashFullScreen": true,
      "splashImmersive": false,
      "backgroundColor": "#ffffff" 
      // launchShowDuration: 3000,
      // launchAutoHide: true,
      // backgroundColor: "#000000",
      // androidSplashResourceName: "splash",
      // androidScaleType: "CENTER_CROP",
      // showSpinner: true,
      // androidSpinnerStyle: "large",
      // iosSpinnerStyle: "small",
      // spinnerColor: "#999999",
      // splashFullScreen: true,
      // splashImmersive: true,
      // layoutName: "launch_screen",
      // useDialog: true,
    },
  },
};

export default config;
