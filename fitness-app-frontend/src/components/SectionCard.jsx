import { Link } from 'react-router-dom';

const SectionCard = ({ title, description, link, color }) => (
  <div className={`p-6 rounded-xl shadow-md ${color}`}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p>{description}</p>
    <Link to={link} className="text-blue-600 hover:underline block mt-2">
      View {title}
    </Link>
  </div>
);

export default SectionCard;
