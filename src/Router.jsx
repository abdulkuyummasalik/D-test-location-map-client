import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Halaman
import MapPage from './pages/maps/MapPage';
import AddLocationPage from './pages/maps/AddLocationPage';
import EditLocationPage from './pages/maps/EditLocationPage';
import ReportPA from './pages/reports/PA';
import ReportPareto from './pages/reports/Pareto';
import ReportMOM from './pages/reports/MOM';
import ReportKPIPA from './pages/reports/KPIPA';
import ReportKPIMTTR from './pages/reports/KPIMTTR';
import ReportKPIMTBS from './pages/reports/KPIMTBS';
import ReportKPIBreakdown from './pages/reports/KPIBreakdown';
import ReportService from './pages/reports/Service';
import ReportPart from './pages/reports/PartRecomendation';
import UserCards from './pages/users/getUsers';

// Komponen autentikasi
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Komponen lainnya
import ButtonBar from './components/ui/ButtonBar';
import ScrollToTop from './components/shared/ScrollToTop';

// Data
import LocationJSON from './data/data_dummy_peta.json';

function App() {
  const [locations, setLocations] = useState(LocationJSON);

  const reportRoutes = [
    { path: 'pa', element: <ReportPA /> },
    { path: 'pareto', element: <ReportPareto /> },
    { path: 'mom', element: <ReportMOM /> },
    { path: 'kpi/pa', element: <ReportKPIPA /> },
    { path: 'kpi/mtbs', element: <ReportKPIMTBS /> },
    { path: 'kpi/mttr', element: <ReportKPIMTTR /> },
    { path: 'kpi/breakdown', element: <ReportKPIBreakdown /> },
    { path: 'service', element: <ReportService /> },
    { path: 'part-recommendation', element: <ReportPart /> },
  ];

  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Route untuk autentikasi (tanpa ButtonBar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route yang diproteksi dengan ButtonBar */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MapPage locations={locations} />
              <ButtonBar />
            </ProtectedRoute>
          }
        />

        {/* loop map */}
        <Route path="/report">
          {reportRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute>
                  {route.element}
                  <ButtonBar />
                </ProtectedRoute>
              }
            />
          ))}
        </Route>

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserCards />
            </ProtectedRoute>
          }
        />

        {/* Route yang tidak diproteksi dengan ButtonBar */}
        <Route
          path="/add-location"
          element={
            <ProtectedRoute>
              <AddLocationPage setLocations={setLocations} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-location/:id"
          element={
            <ProtectedRoute>
              <EditLocationPage locations={locations} setLocations={setLocations} />
            </ProtectedRoute>
          }
        />

        {/* Redirect ke /login jika URL tidak ditemukan */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;