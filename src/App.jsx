import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  FileText, 
  Pill, 
  Map, 
  Menu, 
  X ,
  Icon
} from 'lucide-react';

export default function HealthDashboard() {
  useEffect(() => {
    document.title = "Dashboard - HealthFYI";
  }, []);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [loadingDietPlan, setLoadingDietPlan] = useState(false);

  const healthMetrics = {
    height: '156 cm',
    weight: '33 kg',
    waterIntake: '23 L',
    sleepHours: '23 hrs'
  };

  const navItems = [
    { name: 'Health Dashboard', icon: FileText, href: '/dashboard', active: true },
    { name: 'Medications', icon: Pill, href: '/medications' },
    { name: 'Nearby Hospitals', icon: Map, href: '/hospitals' },
  ];

  const demoNotifications = [
    { id: 1, message: 'Time to take your morning medication.', time: '8:00 AM' },
    { id: 2, message: 'Do Checkout the Nearby Hospital Locator', time: '1 day left' },
    { id: 3, message: 'Hydration reminder: Drink a glass of water.', time: '10:30 AM' },
  ];

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">{value}</h3>
          <h5 className={`text-sm font-medium mb-1 ${color}`}>{title}</h5>
        </div>
        <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const Sidebar = () => {
    const userName = "Rugved Kadu";
    const getInitials = (name) => {
      const words = name.trim().split(" ");
      return words.length >= 2 ? words[0][0] + words[1][0] : name[0];
    };

    return (
      <div className="flex flex-col h-full">
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
              <p className="text-xs text-gray-500">Healthfyier(Trial)</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-md hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Main Menu</div>
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href || '#'}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${item.active ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // New: fetch diet plan from backend
  const generateDietPlan = async () => {
    setDietPlan(null);
    setLoadingDietPlan(true);
    try {
      const response = await fetch("http://localhost:4000/diet-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          height: healthMetrics.height,
          weight: healthMetrics.weight,
          waterIntake: healthMetrics.waterIntake,
          sleepHours: healthMetrics.sleepHours,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch diet plan");
      }

      const data = await response.json();
      setDietPlan(data.dietPlan);
    } catch (error) {
      console.error(error);
      setDietPlan("Error generating diet plan. Please try again later.");
    } finally {
      setLoadingDietPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar />
      </div>
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-4 flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">HealthFYI Dashboard</h1>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                <span>Last Login: 2 weeks ago</span>
                <span>•</span>
                <span className="text-orange-600 font-medium">Next Appointment: Yet To Be Scheduled</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Height" value={healthMetrics.height} icon={Activity} color="text-red-600" />
            <MetricCard title="Weight" value={healthMetrics.weight} icon={Activity} color="text-blue-600" />
            <MetricCard title="Water Intake" value={healthMetrics.waterIntake} icon={Activity} color="text-green-600" />
            <MetricCard title="Sleep Hours" value={healthMetrics.sleepHours} icon={Activity} color="text-purple-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full flex-grow h-full">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 w-full flex flex-col justify-between flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Diet Plan</h3>
              <div
                className="w-full h-64 bg-gray-100 rounded-lg p-4 overflow-y-auto whitespace-pre-wrap mb-6 flex-grow font-mono text-gray-800"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {loadingDietPlan
                  ? "Generating diet plan..."
                  : dietPlan || "No diet plan generated yet."
                }
              </div>
              <button
                onClick={generateDietPlan}
                disabled={loadingDietPlan}
                className={`px-6 py-2 rounded-lg text-white transition-colors ${loadingDietPlan ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loadingDietPlan ? "Please wait..." : "Generate Diet Plan"}
              </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
              <ul className="space-y-3 flex-grow overflow-y-auto">
                {demoNotifications.map((notif) => (
                  <li key={notif.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Copyright HealthFYI © HaxHorizonDevs</span>
            <span className="text-red-600 font-medium">This is Just An AI Based Health Advisor and can be a bit inaccurate</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
