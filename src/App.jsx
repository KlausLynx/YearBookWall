import { Routes, Route, BrowserRouter } from "react-router-dom";
import {Wallpage} from "./pages/wallpage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wallpage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
    
  );
}
