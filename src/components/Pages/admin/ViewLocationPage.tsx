import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { fetchWithAuth } from "../../../utils/api";

interface Location {
  _id: string;
  name: string;
}

const ViewLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetchWithAuth("/auth/location");
        const data = res
        setLocations(data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <MapPin className="text-green-500" /> All Locations
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">Failed to load locations.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {locations.map((location) => (
          <div
            key={location._id}
            className="p-5 border rounded-2xl shadow hover:shadow-md transition bg-white flex items-center gap-3"
          >
            <MapPin className="text-blue-500" />
            <span className="text-lg font-medium">{location.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewLocationsPage;
