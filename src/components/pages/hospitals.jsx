import React, { useState, useEffect, useRef } from "react";
import { Pill, FileText, X, Menu, Calendar ,Map } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import L from "leaflet"; // You need to install leaflet: npm i leaflet
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

export default function Hospitals() {
  useEffect(() => {
    document.title = "Nearby Hospitals - HealthFYI";
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { id: 1, name: "Health Dashboard", icon: FileText, href: "/dashboard" },
    { id: 2, name: "Medications", icon: Pill, href: "/medications" },
     { name: 'Nearby Hospitals', icon: Map , href: '/hospitals' },
  ];

  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  useEffect(() => {
    if (mapInitialized) return; // initialize only once

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Initialize map
        mapRef.current = L.map("map").setView([latitude, longitude], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // User marker
        L.marker([latitude, longitude])
          .addTo(mapRef.current)
          .bindPopup("You are here")
          .openPopup();

        // Fetch nearby hospitals
        fetchHospitals(latitude, longitude);
        setMapInitialized(true);
      },
      (err) => {
        alert("Failed to get your location: " + err.message);
      }
    );
  }, [mapInitialized]);

  const fetchHospitals = (lat, lon) => {
    const query = `
      [out:json];
      (
        node["amenity"="hospital"](around:5000,${lat},${lon});
        way["amenity"="hospital"](around:5000,${lat},${lon});
        relation["amenity"="hospital"](around:5000,${lat},${lon});
      );
      out center;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.elements || data.elements.length === 0) {
          alert("No hospitals found nearby.");
          return;
        }

        data.elements.forEach((element) => {
          let latlng;
          if (element.type === "node") {
            latlng = [element.lat, element.lon];
          } else if (element.type === "way" || element.type === "relation") {
            latlng = [element.center.lat, element.center.lon];
          }

          const name =
            element.tags && element.tags.name
              ? element.tags.name
              : "Unnamed Hospital";

          L.marker(latlng)
            .addTo(mapRef.current)
            .bindPopup(`<b>${name}</b>`);
        });
      })
      .catch((err) => {
        console.error("Error fetching hospitals:", err);
        alert("Failed to fetch nearby hospitals.");
      });
  };

  const Sidebar = () => {
    const userName = "Rugved Kadu";
    const getInitials = (name) => {
      const words = name.trim().split(" ");
      return words.length >= 2
        ? words[0][0] + words[1][0]
        : name[0];
    };

    return (
      <div className="flex flex-col h-full bg-white shadow-lg w-64">
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                {getInitials(userName)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">Healthfyier (Trial)</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Main Menu
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <Sidebar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    HealthFYI Dashboard
                  </h1>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>Last Login: 2 weeks ago</span>
                    <span>•</span>
                    <span className="text-orange-600 font-medium">
                      Next Appointment: Yet To Be Scheduled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Map */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 h-[80vh]">

            {/* Map container */}
            <div id="map" className="w-full h-full rounded-lg shadow-md" />
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Copyright HealthFYI © HaxHorizonDevs</span>
            <span className="text-red-600 font-medium">
              This is Just An AI Based Health Advisor and can be a bit innaccurate
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
