import React, { useState } from "react";
import { MapPin, PlusCircle } from "lucide-react";
import ViewLocationsPage from "./ViewLocationPage";
import { fetchWithAuth } from "../../../utils/api";

const AddLocationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    region: "",
  });

  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);

  const getBrowserLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      setFormData((prev) => ({
        ...prev,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }));
    },
    (error) => {
      console.error("Error getting location:", error);
      alert("Unable to retrieve your location.");
    }
  );
};


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetchWithAuth("/admin/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          region: formData.region,
        }),
      });

      if (res) {
        setStatus("success");
        setFormData({ name: "", latitude: "", longitude: "", region: "" });
      } else {
        throw new Error("Failed to add location");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <><ViewLocationsPage/>
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow rounded-2xl border">
        
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
        <MapPin className="text-blue-500" /> Add New Location
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="any"
              name="latitude"
              required
              value={formData.latitude}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="any"
              name="longitude"
              required
              value={formData.longitude}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded-xl"
            />
          </div>

          <button
  type="button"
  onClick={getBrowserLocation}
  className="text-sm text-blue-600 hover:underline"
>
  📍 Use My Current Location
</button>

        </div>

        <div>
          <label className="block font-medium text-gray-700">Region</label>
          <input
            type="text"
            name="region"
            required
            value={formData.region}
            onChange={handleChange}
            className="mt-1 w-full border p-2 rounded-xl"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          {loading ? "Submitting..." : "Add Location"}
        </button>

        {status === "success" && (
          <p className="text-green-600 mt-2">✅ Location added successfully!</p>
        )}
        {status === "error" && (
          <p className="text-red-600 mt-2">❌ Failed to add location.</p>
        )}
      </form>
    </div>
    </>
  );
};

export default AddLocationPage;
