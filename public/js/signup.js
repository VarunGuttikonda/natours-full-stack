/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (name, email, password, passwordConfirm) => {
  const res = await axios({
    method: 'POST',
    url: `/api/v1/users/signup`,
    data: { name, email, password, passwordConfirm },
  });

  console.log(res);
  if (res.data.status === 'success') {
    showAlert('success', 'Account has been created');
    setTimeout(() => {
      location.assign('/');
    }, 3000);
  } else {
    showAlert('error', 'There has been an error. Please try again later');
  }
};
