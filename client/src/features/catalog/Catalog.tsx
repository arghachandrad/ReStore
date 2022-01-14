import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await agent.Catalog.list();
        setProducts(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCatalog();
  }, []);

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
