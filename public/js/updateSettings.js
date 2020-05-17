/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(url, res);
    if (res.data.status === 'success') {
      showAlert('success', `Data updated successfully!`);
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  } catch (err) {
    showAlert('error', 'Something wrong has happened');
  }
};
