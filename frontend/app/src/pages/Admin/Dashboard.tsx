import { useParams } from "react-router-dom";

const AdminDashboard = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Dashboard Item: {id}</h1>
    </div>
  );
};

export default AdminDashboard;
