/* eslint-disable*/
import axios from 'axios';

import { showAlert } from './alerts';
export const signup = async data => {
  try {
    if (!data.name || !data.email || !data.password || !data.passwordConfirm) {
      return showAlert('error', 'All fields are required!');
    }

    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Signed in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};
