import React, { useState } from 'react';
import { fetchActivityRecommendation } from '../services/activityService';
import RecommendationModal from './RecommendationModal';

const ActivityCard = ({ activity }) => {
  const [recommendationData, setRecommendationData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchRecommendation = async () => {
    try {
      setLoading(true);
      const data = await fetchActivityRecommendation(activity.id);
      setRecommendationData(data);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      alert('Failed to fetch details analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="grid grid-cols-1 gap-2 text-gray-800">
        {activity.activityType && (
          <div><strong>Activity Type:</strong> {activity.activityType}</div>
        )}
        {activity.startTime && (
          <div><strong>Start Time:</strong> {new Date(activity.startTime).toLocaleString()}</div>
        )}
        {activity.duration && (
          <div><strong>Duration:</strong> {activity.duration} {activity.durationUnit || 'minutes'}</div>
        )}
        {activity.distance && (
          <div><strong>Distance:</strong> {activity.distance} {activity.distanceUnit || 'km'}</div>
        )}
        {activity.caloriesBurnt && (
          <div><strong>Calories Burned:</strong> {activity.caloriesBurnt}</div>
        )}
        {activity.averageSpeed && (
          <div><strong>Average Speed:</strong> {activity.averageSpeed} {activity.speedUnit || 'km/h'}</div>
        )}
        {activity.minHeartRate && (
          <div><strong>Min Heart Rate:</strong> {activity.minHeartRate} bpm</div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleFetchRecommendation}
          disabled={loading}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Details Analysis'}
        </button>
      </div>

      {/* Modal */}
      {recommendationData && (
        <RecommendationModal
          recommendationData={recommendationData}
          onClose={() => setRecommendationData(null)}
        />
      )}
    </div>
  );
};

export default ActivityCard;
