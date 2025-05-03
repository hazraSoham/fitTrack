import ActivityCard from './ActivityCard';

const ActivityList = ({ activities }) => {
  if (!activities.length) {
    return <p className="text-gray-500">No activities added yet.</p>;
  }

  return (
    <ul className="space-y-4">
      {activities.map((activity, index) => (
        <ActivityCard key={index} activity={activity} />
      ))}
    </ul>
  );
};

export default ActivityList;
