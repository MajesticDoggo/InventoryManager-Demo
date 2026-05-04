import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./ProductList";
import ProductEdit from "./ProductEdit";

//What to show based on url
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductEdit />} />
      </Routes>
    </Router>
  );
}