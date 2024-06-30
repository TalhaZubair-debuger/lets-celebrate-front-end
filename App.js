import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Screens/Login/Login';
import SignUp from './Screens/SignUp/SignUp';
import UserHome from './Screens/UserHome/UserHome';
import ProductPage from './Screens/ProductPage/ProductPage';
import Search from './Screens/Search/Search';
import Cart from './Screens/Cart/Cart';
import { StripeProvider } from '@stripe/stripe-react-native';
import OrderNowPage from './Screens/OrderNow/OrderNow.js';
import SellerHome from './Screens/Seller/SellerHome.js';
import AddProduct from './Screens/Seller/AddProduct.js';
import CurrentBookings from './Screens/Seller/CurrentBookings.js';
import { useState } from 'react';
import UserBookings from './Screens/UserBookings/UserBookings.js';
import EditProduct from './Screens/Seller/EditProduct.js';


const SellerStack = createStackNavigator();
function SellerStackTabs() {
  return (
    <SellerStack.Navigator>
      <SellerStack.Screen
        name="Home"
        component={SellerHome}
        options={{
          headerShown: false,
        }}
      />
      <SellerStack.Screen
        name="Add Product"
        component={AddProduct}
        options={{
          headerShown: false,
        }}
      />
      <SellerStack.Screen
        name="Current Bookings"
        component={CurrentBookings}
        options={{
          headerShown: false,
        }}
      />
      <SellerStack.Screen
        name="Edit Product"
        component={EditProduct}
        options={{
          headerShown: false,
        }}
      />
    </SellerStack.Navigator>
  )
}

const RootStack = createStackNavigator();
export default function App() {
  const [stripeKey, setStripeKey] = useState("");
  return (
    <StripeProvider publishableKey={stripeKey ? stripeKey : null}>
      <NavigationContainer>
        <RootStack.Navigator>
          <RootStack.Screen
            name="Login"
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Home"
            component={UserHome}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Product"
            component={ProductPage}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Search"
            component={Search}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="Cart"
            component={Cart}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="OrderNow"
            component={OrderNowPage}
            initialParams={{ setStripeKey: setStripeKey }}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="User Bookings"
            component={UserBookings}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name="SellerHome"
            component={SellerStackTabs}
            options={{
              headerShown: false,
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
