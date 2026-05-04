import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./ProductEdit.css";


export default function ProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    title: "",
    price: "",
    category: ""
  });
  const navigate = useNavigate();
  

  // The product edit page
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];

    const localProduct = stored.find(p => p.id === Number(id));

    if (localProduct) {
    setProduct(localProduct);
    } else {
      fetch(`https://fakestoreapi.com/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
    }
  }, [id]);

  const handleChange = (event) => { setProduct (
      {...product,[event.target.name]: event.target.value}
    );
  };

  //saves data on when button is clicked
  const handleApply = (event) => {
    event.preventDefault();

    fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })
      .then(res => res.json())
      .then((updatedProduct) => {
        const stored = JSON.parse(localStorage.getItem("products")) || [];
        const updatedList = stored.map(p => p.id === updatedProduct.id ? updatedProduct : p );

        if (!stored.find(p => p.id === updatedProduct.id)) { updatedList.push(updatedProduct);}

      localStorage.setItem("products", JSON.stringify(updatedList));

      navigate("/");
    });
  }

  return (
    <div className="edit-overlay">
    <div className="edit-container">

      <h1 className="title"> Store Name </h1>
      <h2 className="store-name"> Inventory Manager </h2>
      <label style={{textAlign:"center"}}>Product ID: {product.id}</label>

      <form onSubmit={handleApply}>
        <label>Title</label>
        <div>
          <input name="title" value={product.title} onChange={handleChange}/>
        </div>

        <label>Price</label>
        <div>
          <input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
          />
        </div>

        <label>Category</label>
        <div>
          
          <input name="category"
            value={product.category}
            onChange={handleChange}
          />
        </div>
        <div className="button-container">
          <button className="apply-button" type="submit">Apply</button>
          <button className="back-button" type="button" onClick={() => navigate("/")}>
            Back
          </button>
        </div>
      </form>

    </div>
  </div>
  );
}