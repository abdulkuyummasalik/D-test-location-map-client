import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart, Users, LogOut, ChevronDown, ChevronUp, Menu, X } from 'lucide-react';
import { useAuth } from "../../contexts/AuthContext";

const ButtonBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false); // Untuk memperluas menu utama
  const [isReportExpanded, setIsReportExpanded] = useState(false); // Untuk memperluas submenu Laporan

  // Daftar item navigasi
  const navigationItems = [
    { path: '/', icon: Home, label: 'Beranda' },
    { path: '/users', icon: Users, label: 'Pengguna' },
    {
      label: 'Laporan',
      icon: BarChart,
      subItems: [
        { path: '/report/pa', label: 'Laporan PA' },
        { path: '/report/kpi/pa', label: 'Laporan KPI' },
      ],
    },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-9999">
      {/* Tombol untuk memperluas/menutup menu utama */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600 text-white shadow-lg hover:bg-slate-700 transition-all duration-150"
      >
        {isExpanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Menu Navigasi */}
      {isExpanded && (
        <div className="absolute bottom-12 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-2 w-48">
          {navigationItems.map((item) => (
            <div key={item.label} className="relative">
              {/* Tombol Menu Utama */}
              <button
                onClick={() => {
                  if (item.subItems) {
                    setIsReportExpanded(!isReportExpanded); // Toggle submenu Laporan
                  } else {
                    navigate(item.path); // Navigasi ke halaman yang sesuai
                    setIsExpanded(false); // Tutup menu setelah navigasi
                  }
                }}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg
                  transition-all duration-150 hover:bg-indigo-50 group
                  ${location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:text-indigo-500'}`}
              >
                <div className="flex items-center space-x-2">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
                {item.subItems && (
                  <span>
                    {isReportExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                )}
              </button>

              {/* Submenu Laporan */}
              {item.subItems && isReportExpanded && (
                <div className="ml-4 pl-2 border-l-2 border-gray-100">
                  {item.subItems.map((subItem) => (
                    <button
                      key={subItem.path}
                      onClick={() => {
                        navigate(subItem.path);
                        setIsExpanded(false); // Tutup menu setelah navigasi
                      }}
                      className={`flex items-center w-full px-3 py-2 rounded-lg
                        transition-all duration-150 hover:bg-indigo-50 group
                        ${location.pathname === subItem.path
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-500 hover:text-indigo-500'}`}
                    >
                      <span className="text-sm font-medium whitespace-nowrap">
                        {subItem.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Tombol Logout */}
          <button
            onClick={() => {
              logout();
              setIsExpanded(false); // Tutup menu setelah logout
            }}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg
              transition-all duration-150 hover:bg-red-50 group text-gray-500 hover:text-red-500"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">
              Keluar
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ButtonBar;