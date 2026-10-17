
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import ReasumeBuilder from './pages/ReasumeBuilder';
import Preview from './pages/Preview';
import Login from './pages/Login';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import api from './configs/api'
import {login, setloading} from './app/feature/authSlice';

const App = () => {
  const dispatch = useDispatch();

  const getUser = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) {
        const { data } = await api.get(`/api/user/getuser`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setloading(false));
      } else {
        dispatch(setloading(false));
      }
    } catch (error) {
      dispatch(setloading(false));
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* create route for the main application layout */}
        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resume_id" element={<ReasumeBuilder />} />
        </Route>

        {/* create route for the preview page */}
        <Route path="view/:resumeid" element={<Preview />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;