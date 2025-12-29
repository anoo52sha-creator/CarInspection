import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import CarService from "./pages/CarService";
import BookingForm from "./pages/BookingForm";
import ThankYou from "./pages/ThankYou";
import WhatsAppButton from "./components/WhatsAppButton";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_60%)]" />

        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result" element={<Result />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/book-inspection" element={<BookingForm />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/car-service" element={<CarService />} />

          
          </Routes>
          <WhatsAppButton />
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
    //Test
}
