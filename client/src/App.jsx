import './App.css'
import axios from 'axios';
import { Routes, Route } from "react-router-dom";
import Layout from './Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import { UserContextProvider } from './UserContext';

// axios.defaults.baseURL = "https://nxo-api-e2luutb6vq-ez.a.run.app"
// axios.defaults.baseURL = "https://nxo-project.web.app"
axios.defaults.baseURL = "http://localhost:8080"

axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/:subpage?" element={<AccountPage />} />
          <Route path="/account/:subpage/:action" element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
