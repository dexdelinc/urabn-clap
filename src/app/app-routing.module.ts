import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'starter',
    pathMatch: 'full'
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'product-details',
    loadChildren: () => import('./pages/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'service-user',
    loadChildren: () => import('./pages/service-user/service-user.module').then( m => m.ServiceUserPageModule)
  },
  {
    path: 'shop-login',
    loadChildren: () => import('./pages/shop-login/shop-login.module').then( m => m.ShopLoginPageModule)
  },
  {
    path: 'shop-product-details',
    loadChildren: () => import('./pages/shop-product-details/shop-product-details.module').then( m => m.ShopProductDetailsPageModule)
  },
  {
    path: 'shop-user-profile',
    loadChildren: () => import('./pages/shop-user-profile/shop-user-profile.module').then( m => m.ShopUserProfilePageModule)
  },
  {
    path: 'user-profile',
    loadChildren: () => import('./pages/user-profile/user-profile.module').then( m => m.UserProfilePageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./pages/order/order.module').then( m => m.OrderModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then( m => m.CartModule)
  },
  {
    path: 'detail',
    loadChildren: () => import('./pages/detail/detail.module').then( m => m.DetailPageModule)
  },
  {
    path: 'customer-login',
    loadChildren: () => import('./pages/customer-login/customer-login.module').then( m => m.CustomerLoginPageModule)
  },
  {
    path: 'customer-register',
    loadChildren: () => import('./pages/customer-register/customer-register.module').then( m => m.CustomerRegisterPageModule)
  },
  {
    path: 'image',
    loadChildren: () => import('./pages/image/image.module').then( m => m.ImagePageModule)
  },
  {
    path: 'ionic-image',
    loadChildren: () => import('./pages/ionic-image/ionic-image.module').then( m => m.IonicImagePageModule)
  },
  {
    path: 'upload-documents',
    loadChildren: () => import('./pages/upload-documents/upload-documents.module').then( m => m.UploadDocumentsPageModule)
  },
  {
    path: 'view-documents',
    loadChildren: () => import('./pages/view-documents/view-documents.module').then( m => m.ViewDocumentsPageModule)
  },
  {
    path: 'make-payment',
    loadChildren: () => import('./pages/make-payment/make-payment.module').then( m => m.MakePaymentPageModule)
  },
  {
    path: 'earning',
    loadChildren: () => import('./pages/earning/earning.module').then( m => m.EarningPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./pages/tracking/tracking.module').then( m => m.TrackingPageModule)
  },
  {
    path: 'delivery-request',
    loadChildren: () => import('./pages/delivery-request/delivery-request.module').then( m => m.DeliveryRequestPageModule)
  },
 
  {
    path: 'employee-profile',
    loadChildren: () => import('./pages/employee/employee-profile/employee-profile.module').then( m => m.EmployeeProfilePageModule)
  },
  {
    path: 'employee-login',
    loadChildren: () => import('./pages/employee/employee-login/employee-login.module').then( m => m.EmployeeLoginPageModule)
  }, 
  {
    path: 'employee-register',
    loadChildren: () => import('./pages/employee/employee-register/employee-register.module').then( m => m.EmployeeRegisterPageModule)
  },
  {
    path: 'starter',
    loadChildren: () => import('./starter/starter.module').then( m => m.StarterPageModule)
  },

  


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
