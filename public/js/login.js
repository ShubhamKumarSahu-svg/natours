/* eslint-disable*/
import axios from 'axios';

import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }

    // console.log(res);
  } catch (e) {
    showAlert('error', e.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged Out successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
      // location.reload(true);
    }
  } catch (err) {
    showAlert('error', 'Error logging out try again!');
  }
};
// document.querySelector(
//   '.form',
//   addEventListener('submit', e => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     login(email, password);
//   })
// );
