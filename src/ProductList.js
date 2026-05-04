import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./ProductList.css"

export default function ProductList() {
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const handleDelete = (id) => {
        const updated = products.filter(p => p.id !== id);

        setProducts(updated);
        localStorage.setItem("products", JSON.stringify(updated));
    };
    
    // When the product list page was resetted, the local storage is set to empty. Products were fetched and put in a state, but not stored.
    // The Product that was editted was saved in an empty storage then the Product List Page would read just the one product in the local storage and display it.
    const handleReset = () => {
        localStorage.removeItem("products");

        fetch("https://fakestoreapi.com/products")
        .then(res => res.json())
        .then(data => {
        setProducts(data);
        localStorage.setItem("products", JSON.stringify(data)); // <-- Stores the data now
        });
    };

    const handleAdd = (product) => {
        setProducts(prev => {
        const updated = [...prev, product];
        localStorage.setItem("products", JSON.stringify(updated));
        return updated;
        });
    };
    

    // Stored Data for pop-up
    const [newProduct, setNewProduct] = useState({
        title: "",
        price: "",
        category: ""
    });

    // Pop-up add product
    const [showModal, setShowModal] = useState(false);

  //When page loads fetch data
    useEffect(() => {
    const stored = localStorage.getItem("products");

    if (stored) {
            setProducts(JSON.parse(stored));
        } 
    else {
            fetch("https://fakestoreapi.com/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                localStorage.setItem("products", JSON.stringify(data));
            });
        }
    }, []);
    console.log(products);


  return (
    <div>
        <h1 className="title"> Store Name </h1>
        <h2 className="store-name"> Inventory Manager </h2>
        
        {/*Add/Rest Buttons*/}
        <div className="button-container">
            <button className="reset-button" onClick={handleReset}>
                Reset
            </button>

            <button className="add-button" onClick={() => setShowModal(true)}>
                Add Product
            </button>
        </div>
        {/*Add/Rest Buttons END*/}
        
        {/* Pop-Up*/}
        {showModal && (
            <div className="modal-overlay">
                <div className="modal">
                    <button className="close-button" onClick={() => setShowModal(false)}>X</button>
                    <h2>Add Product</h2>

                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            value={newProduct.title}
                            onChange={(e) =>
                            setNewProduct({ ...newProduct, title: e.target.value })}/>
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            value={newProduct.price}
                            onChange={(e) =>setNewProduct({ ...newProduct, price: e.target.value })}/>
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}/>
                    </div>

                    <button className="addProduct-button" disabled={!newProduct.title || !newProduct.price} onClick={() => { handleAdd({ ...newProduct, id: Date.now(), price: Number(newProduct.price)}); setShowModal(false);
                    
                    // reset form
                        setNewProduct({
                        title: "",
                        price: "",
                        category: ""
                        });
                    }}>
                    ADD
                    </button>
                </div>
            </div>
        )}
        {/*Pop-Up END*/}

        {/* List of products*/}
        <div className="grid-container">
            {products.map(product => (
                <div key={product.id} onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: "pointer" }} className="grid-item"> 

                    <p>ID: {product.id}</p>
                    <p 
                        title={product.title} 
                        className="product-title">{product.title}
                    </p>
                    <p>Price: ${product.price}</p>
                    <p style={{textTransform: "capitalize"}}> {product.category}</p>

                    <button className="delete-button" onClick={(event) => { event.stopPropagation(); handleDelete(product.id);}}>
                        Delete
                    </button>
                    
                </div>
            ))}
        </div>
    </div>
  )
}