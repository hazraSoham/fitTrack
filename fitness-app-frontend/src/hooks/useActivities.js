// src/hooks/useActivities.js
import { useState, useEffect } from 'react';
import { fetchActivities } from '../services/activityService';
import { useSelector } from 'react-redux';

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadActivities = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await fetchActivities(user.id); // assuming user.id is the keycloak ID
        setActivities(data);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [user]);

  return { activities, loading, error, setActivities };
};

export default useActivities;
