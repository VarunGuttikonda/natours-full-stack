/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_IrdhUuZqWXILxrYYLGcrmDv700nFhQgd7U');

export const bookTour = async (tourId) => {
  try {
    // 1) Get session information from endpoint
    // const session = await axios(
    //   `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    // );
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log('The session is:', session);

    // 2) Charge the user
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
    document.getElementById('book-tour').textContent = 'Book Tour Now';
  }
};
