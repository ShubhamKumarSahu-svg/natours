/* eslint-disable */
import axios from 'axios';
import catchAsync from '../../utils/catchAsync';
import { showAlert } from './alerts';
// const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY); // must be replaced manually or injected at build time
const stripe = Stripe(
  'pk_test_51RdD7H2cR8crihaiDXttaXneVlr8Cpn6BR01toggMcqMS28ckTuZ4gQwA7RYPEbuGSaNGJibWgO7o8ECn4WkxgVl00l2UbeppA'
); // must be replaced manually or injected at build time

export const bookTour = catchAsync(async tourId => {
  try {
    // 1) Get checkout session from the API
    const session = await axios.get(
      `api/v1/bookings/checkout-session/${tourId}`
    );

    // console.log('✅ Session fetched:', session.data);

    // 2) Redirect to Stripe Checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.error('❌ Stripe booking failed:', err);
    showAlert('error', err);
  }
});
