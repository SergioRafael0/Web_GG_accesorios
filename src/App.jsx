import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
//import Checkout from './pages/Checkout';
//import Success from './pages/Success';
//import Failure from './pages/Failure';
//import Admin from './pages/Admin';
//import Offers from './pages/Offers';
import Header from './components/Header';
import Footer from './components/Footer';

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";

/*<Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/failure" element={<Failure />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/offers" element={<Offers />} /> */

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}