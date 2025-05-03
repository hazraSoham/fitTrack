import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { postActivity } from '../services/activityService';
import { showErrorToast } from '../utils/toastUtils';

const activityOptions = [
  "RUNNING", "WALKING", "CYCLING", "SWIMMING",
  "WEIGHT_TRAINING", "YOGA", "HIIT", "CARDIO", "STRETCHING", "OTHER"
];

const durationUnits = ["seconds", "minutes", "hours"];
const distanceUnits = ["m", "km"];
const speedUnits = ["m/s", "km/h"];

const AddActivityModal = ({ formData, setFormData, onClose, onSave, userId }) => {
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const newErrors = {};
  
    if (!formData.activityType) newErrors.activityType = "Activity Type is required.";
    if (!formData.caloriesBurnt) newErrors.caloriesBurnt = "Calories Burnt is required.";
    if (!formData.startTime) newErrors.startTime = "Start Time is required.";
    if (!formData.duration) newErrors.duration = "Duration is required.";
  
    setErrors(newErrors);
  
    console.log("UserID:", userId);
  
    if (Object.keys(newErrors).length === 0) {
      const payload = {
        activityType: formData.activityType,
        caloriesBurnt: parseFloat(formData.caloriesBurnt), //+ ' kcal',
        startTime: formData.startTime,
        duration: parseInt(formData.duration, 10)// + ' ' + formData.durationUnit,
      };
  
      const additionalMetrics = {};
      if (formData.distance) additionalMetrics.distance = parseFloat(formData.distance) + ' ' + formData.distanceUnit;
      if (formData.averageSpeed) additionalMetrics.averageSpeed = parseFloat(formData.averageSpeed) + ' ' + formData.speedUnit;
      if (formData.minHeartRate) additionalMetrics.maxHearRate = parseInt(formData.minHeartRate, 10) + ' bpm';
  
      if (Object.keys(additionalMetrics).length > 0) {
        payload.additionalMetrics = additionalMetrics;
      }
  
      console.log("Payload before posting:", payload);
  
      try {
        const response = await postActivity(payload, userId);
        console.log("Post response status:", response.status);

        if (response.status !== 200) {
          console.error('Bad Response', response);
          throw new Error('Bad Response');
        }
  
        onSave(); // Refresh or update
        onClose(); // Close modal
      } catch (error) {
        console.error('Failed to save activity', error);
        showErrorToast('Failed to save activity. Please try again.');
      }
    } else {
      console.warn('Validation errors:', newErrors);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Add New Activity</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Activity Type */}
          <div>
            <label className="block mb-1 font-semibold">Activity Type <span className="text-red-500">*</span></label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={formData.activityType}
              onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
            >
              <option value="">Select activity</option>
              {activityOptions.map((activity) => (
                <option key={activity} value={activity}>
                  {activity.replace("_", " ")}
                </option>
              ))}
            </select>
            {errors.activityType && <p className="text-red-500 text-sm mt-1">{errors.activityType}</p>}
          </div>

          {/* Calories Burnt */}
          <div>
            <label className="block mb-1 font-semibold">Calories Burnt <span className="text-red-500">*</span></label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded p-2"
              placeholder="e.g., 300"
              value={formData.caloriesBurnt}
              onChange={(e) => setFormData({ ...formData, caloriesBurnt: e.target.value })}
            />
            {errors.caloriesBurnt && <p className="text-red-500 text-sm mt-1">{errors.caloriesBurnt}</p>}
          </div>

          {/* Start Time */}
          <div>
            <label className="block mb-1 font-semibold">Start Time <span className="text-red-500">*</span></label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded p-2"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            />
            {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1 font-semibold">Duration <span className="text-red-500">*</span></label>
            <div className="flex">
              <input
                type="number"
                className="w-2/3 border border-gray-300 rounded-l p-2"
                placeholder="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
              <select
                className="w-1/3 border border-gray-300 rounded-r p-2"
                value={formData.durationUnit}
                onChange={(e) => setFormData({ ...formData, durationUnit: e.target.value })}
              >
                {durationUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>

          {/* Distance */}
          <div>
            <label className="block mb-1 font-semibold">Distance</label>
            <div className="flex">
              <input
                type="number"
                className="w-2/3 border border-gray-300 rounded-l p-2"
                placeholder="Distance"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
              <select
                className="w-1/3 border border-gray-300 rounded-r p-2"
                value={formData.distanceUnit}
                onChange={(e) => setFormData({ ...formData, distanceUnit: e.target.value })}
              >
                {distanceUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Average Speed */}
          <div>
            <label className="block mb-1 font-semibold">Average Speed</label>
            <div className="flex">
              <input
                type="number"
                className="w-2/3 border border-gray-300 rounded-l p-2"
                placeholder="Speed"
                value={formData.averageSpeed}
                onChange={(e) => setFormData({ ...formData, averageSpeed: e.target.value })}
              />
              <select
                className="w-1/3 border border-gray-300 rounded-r p-2"
                value={formData.speedUnit}
                onChange={(e) => setFormData({ ...formData, speedUnit: e.target.value })}
              >
                {speedUnits.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Min Heart Rate */}
          <div>
            <label className="block mb-1 font-semibold">Min Heart Rate (bpm)</label>
            <input
              type="number"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded p-2"
              placeholder="e.g., 70"
              value={formData.minHeartRate}
              onChange={(e) => setFormData({ ...formData, minHeartRate: e.target.value })}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded text-lg"
          >
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddActivityModal;
