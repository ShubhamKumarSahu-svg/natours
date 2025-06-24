/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alerts';

//type - 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url:
        type === 'data'
          ? 'http://localhost:3000/api/v1/users/updateMe'
          : 'http://localhost:3000/api/v1/users/updateMyPassword',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
