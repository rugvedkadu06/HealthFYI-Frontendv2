import React, { useState } from "react";
export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white dark:bg-gray-900 p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="mt-2">{children}</div>;
}

// Button Component
export function Button({ children, onClick, className = "", variant = "default" }) {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Tabs Component
export const Tabs = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <div>
      {/* Render tab list and tab triggers */}
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "TabsList") {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return null;
      })}

      {/* Render tab content */}
      {React.Children.map(children, (child) => {
        if (child.type.displayName === "TabsContent") {
          return React.cloneElement(child, { activeTab });
        }
        return null;
      })}
    </div>
  );
};

export const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex gap-2 border-b pb-2 mb-4">
    {React.Children.map(children, (child) =>
      React.cloneElement(child, { activeTab, setActiveTab })
    )}
  </div>
);
TabsList.displayName = "TabsList";

export const TabsTrigger = ({ value, children, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`px-4 py-2 rounded-t-md ${
      activeTab === value ? "bg-blue-500 text-white" : "bg-gray-200"
    }`}
  >
    {children}
  </button>
);
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = ({ value, children, activeTab }) => {
  if (activeTab !== value) return null;
  return <div>{children}</div>;
};
TabsContent.displayName = "TabsContent";