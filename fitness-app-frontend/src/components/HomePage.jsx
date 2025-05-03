import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { FaDumbbell, FaAppleAlt, FaChartLine, FaPlusCircle } from 'react-icons/fa';
import AddActivityModal from './AddActivityModal';
import ActivityCard from './ActivityCard';
import { showSuccessToast } from '../utils/toastUtils';
import useActivities from '../hooks/useActivities';

const initialFormData = {
  activityType: '',
  caloriesBurnt: '',
  startTime: '',
  duration: '',
  durationUnit: 'minutes',
  distance: '',
  distanceUnit: 'kilometers',
  averageSpeed: '',
  speedUnit: 'km/h',
  minHeartRate: '',
};

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const { activities, loading, error, setActivities } = useActivities();

  const handleAddActivity = useCallback(() => {
    setActivities((prev) => [formData, ...prev]);
    setFormData(initialFormData);
    setIsModalOpen(false);
    showSuccessToast('Activity added successfully!');
  }, [formData, setActivities]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to FitTrack</h1>
        <p className="mb-6 text-gray-600">Sign in to access your fitness dashboard.</p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow">
          Login Now
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to FitTrack</h1>
          <h2 className="text-xl text-gray-600">
            Hello, <span className="font-semibold">{user?.firstName || user?.username}</span> 👋
          </h2>
          <p className="text-gray-500 mt-2">Keep tracking, keep thriving!</p>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {sections.map(({ title, description, link, icon: Icon, bg }, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md hover:shadow-lg transition duration-200 ${bg}`}
            >
              <div className="flex items-center mb-4 text-blue-800">
                <Icon className="w-6 h-6 mr-2" />
                <h3 className="text-lg font-semibold">{title}</h3>
              </div>
              <p className="text-gray-700">{description}</p>
              <Link
                to={link}
                className="text-blue-600 hover:underline mt-3 inline-block font-medium"
              >
                View {title}
              </Link>
            </div>
          ))}
        </div>

        {/* Add Activity Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition"
          >
            <FaPlusCircle />
            Add Activity
          </button>
        </div>

        {/* Activity History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Activity History</h2>
          {loading ? (
            <p className="text-gray-500">Loading activities...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load activities. Please try again.</p>
          ) : activities.length > 0 ? (
            <ul className="space-y-4">
              {activities.map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No activities added yet.</p>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <AddActivityModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddActivity}
          userId={user.id}
        />
      )}
    </div>
  );
};

const sections = [
  {
    title: 'Workouts',
    description: 'Explore your personalized workout plans',
    link: '/workouts',
    icon: FaDumbbell,
    bg: 'bg-blue-50',
  },
  {
    title: 'Nutrition',
    description: 'Track your meals and nutritional intake',
    link: '/nutrition',
    icon: FaAppleAlt,
    bg: 'bg-green-50',
  },
  {
    title: 'Progress',
    description: "See how far you've come in your fitness journey",
    link: '/progress',
    icon: FaChartLine,
    bg: 'bg-purple-50',
  },
];

export default HomePage;
