const Card = ({ title, value, color }) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`mt-2 text-2xl font-bold ${color}`}>{value}</h3>
    </div>
  );
};

const FraudStatCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card title="Total Reviews" value={stats?.total || 0} color="text-gray-900" />
      <Card title="High Risk" value={stats?.high || 0} color="text-red-600" />
      <Card title="Medium Risk" value={stats?.medium || 0} color="text-yellow-600" />
      <Card
        title="Pending Review"
        value={stats?.pending_review || 0}
        color="text-blue-600"
      />
    </div>
  );
};

export default FraudStatCards;