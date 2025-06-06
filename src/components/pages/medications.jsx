import React, { useState, useRef , useEffect} from "react";
import { Pill, FileText, X, Menu, Calendar ,Map } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";

export default function SidebarMedicationsOnly() {
    useEffect(() => {
    document.title = "Medications - HealthFYI";
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [medicineName, setMedicineName] = useState("");
  const [medicineData, setMedicineData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeout = useRef(null);

  const location = useLocation();
  const navItems = [
    { id: 1, name: "Health Dashboard", icon: FileText, href: "/dashboard" },
    { id: 2, name: "Medications", icon: Pill, href: "/medications" },
     { name: 'Nearby Hospitals', icon: Map , href: '/hospitals' },
  ];

  const fetchMedicineInfo = async () => {
    setError("");
    setMedicineData(null);

    if (!medicineName.trim()) {
      setError("Please enter a medicine name.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("hhttps://healthfyi-backendpy.onrender.com/ask-medicine/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Tell me about ${medicineName}` }),
      });

      if (!response.ok) throw new Error("Medicine info not found");

      const data = await response.json();
      setMedicineData(data.reply);
    } catch {
      setError("Failed to fetch medicine info. Please try again.");
    }
    setLoading(false);
  };

  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`https://healthfyi-backendpy.onrender.com/autocomplete/?q=${query}`);
      const data = await response.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const handleMedicineInputChange = (value) => {
    setMedicineName(value);
    setMedicineData(null);
    setError("");

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const Sidebar = () => {
    const userName = "Rugved Kadu";
    const getInitials = (name) => {
      const words = name.trim().split(" ");
      return words.length >= 2 ? words[0][0] + words[1][0] : name[0];
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

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 h-[80vh] overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">Medications</h1>

            <div
              className="relative w-full max-w-lg mx-auto mb-6"
              style={{ minHeight: "64px" }}
            >
              <input
                type="text"
                className="w-full px-4 py-3 outline-none bg-gray-50 text-gray-700 shadow-md rounded-xl transition-all duration-300 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Medicine Name..."
                value={medicineName}
                onChange={(e) => handleMedicineInputChange(e.target.value)}
              />
              <button
                onClick={fetchMedicineInfo}
                className="absolute right-3 top-2 bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center drop-shadow-lg transition-all duration-300 hover:bg-blue-700 disabled:opacity-60"
                disabled={loading}
              >
                <FaSearch className="mr-2" />
                {loading ? "Searching..." : "Search"}
              </button>

              {suggestions.length > 0 && (
                <ul className="absolute bg-white border rounded-xl w-full shadow-lg mt-2 z-10 max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-3 cursor-pointer hover:bg-blue-100 transition-all duration-200"
                      onClick={() => {
                        setMedicineName(suggestion);
                        setSuggestions([]);
                        setMedicineData(null);
                        setError("");
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p className="text-red-500 mt-2 font-semibold">{error}</p>}

            {medicineData && (
              <div className="bg-gray-50 p-6 mt-6 shadow rounded-2xl border border-gray-200 transition-transform transform hover:scale-[1.02]">
                <h3 className="text-xl font-semibold text-blue-700">{medicineName}</h3>
                <p className="text-gray-800 mt-3">
                  <strong>Description:</strong> {medicineData.medicine_desc || "N/A"}
                </p>
                <p className="text-gray-800 mt-3">
                  <strong>Composition:</strong> {medicineData.salt_composition || "N/A"}
                </p>
                <p className="text-gray-800 mt-3">
                  <strong>Side Effects:</strong> {medicineData.side_effects || "N/A"}
                </p>
              </div>
            )}
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Copyright HealthFYI © HaxHorizonDevs</span>
            <span className="text-red-600 font-medium">This is Just An AI Based Health Advisor and can be a bit innaccurate</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
