package com.app.Swork7;
 import android.os.Bundle;

 import com.getcapacitor.BridgeActivity;


public class MainActivity extends BridgeActivity {

    @Override
     public void onCreate(Bundle savedInstanceState) {
         super.onCreate(savedInstanceState);
         registerPlugin(com.getcapacitor.community.stripe.StripePlugin.class);

     }

}
