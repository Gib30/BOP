import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import SubmitPage from './pages/SubmitPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/project/:id" element={<ProjectDetailPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
