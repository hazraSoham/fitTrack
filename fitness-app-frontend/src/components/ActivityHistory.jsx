import ActivityCard from './ActivityCard';

const ActivityHistory = ({ activities }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Activity History</h2>
    {activities.length > 0 ? (
      <ul className="space-y-4">
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </ul>
    ) : (
      <p className="text-gray-500">No activities added yet.</p>
    )}
  </div>
);

export default ActivityHistory;
