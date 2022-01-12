import { useEffect, useState } from "react";

function App() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => setProducts(data));
    }, []);

    return (
        <div>
            <h1>Re-Store</h1>
            <p>{products.length}</p>
            {/* <ul>
              {
                products.map((product, index) => (
                  <li key={index}>{product.}</li>
                ))
              }
            </ul> */}
        </div>
    );
}

export default App;
