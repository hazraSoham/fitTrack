import axios from 'axios';
import { getValidToken } from '../keycloak/keycloakService';

const BASE_URL = 'http://localhost:8080/api';

export const fetchActivities = async (userId) => {
  const token = await getValidToken();
  console.log('Fetching user activity...');
  console.log('userID: ', userId);

  const response = await axios.get(`${BASE_URL}/activities`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-USER-ID': userId, //'13919bce-035e-429b-a20c-92747be0e11f' //userId,
    },
  })
    .catch(error => {
      console.log(error);
      throw new Error('Failed to fetch activities');
    })
  console.log("fetch activity response")
  return response.data;
};

export const fetchActivityRecommendation = async (activityId) => {
  const token = await getValidToken();
  console.log('Fetching recommendation...');

  const response = await axios.get(`${BASE_URL}/recommendations/activity/${activityId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  return response.data;
};


export const postActivity = async (payload, userId) => {
  const token = await getValidToken();
  console.log('Posting Activity...');
  // console.log('token ' + token);
  const response = await axios.post(`${BASE_URL}/activities`, payload, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-USER-ID': userId,
    },
  });
  return response;
};