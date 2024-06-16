// This module file contains couple of Functions that we will reuse again and again.

import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJson = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // if fetch is taking long time coz of any reason(like slow internet), then timeout fn. will run after defined time and will reject the promise with Error defined above.
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}`);

    return data;
  } catch (err) {
    throw err; // If some error happens, this line of code is used to 'Rethrow' the error. That way if error do happen, getJson will provide rejected Promise. That rejected promise will then be handled in the Model.JS.
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        // Information about the request itself.
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}`);

    return data;
  } catch (err) {
    throw err;
  }
};

// We can refactor above two functions into one, coz they are almost the same..

// export const AJAX = async function (url, uploadData = undefined) {
//   try {
//     const fetchPro = uploadData
//       ? fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(uploadData),
//         })
//       : fetch(url);
//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); //
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message}`);

//     return data;
//   } catch (err) {}
// };
