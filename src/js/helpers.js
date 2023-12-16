'use strict';
import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config';

///////////////////////////////////////

const timeout = function (s) {
  try {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  } catch (err) {
    throw err;
  }
};

///////////////////////////////////////

export const callJSON = async function (url, uploadData = null) {
  try {
    const fetchResponse = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    const res = await Promise.race([fetchResponse, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    else return data;
  } catch (err) {
    throw err;
  }
};
