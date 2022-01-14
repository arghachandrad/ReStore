import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Product } from "../../app/models/product";
import ProductList from "./ProductList";

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await agent.Catalog.list();
        setLoading(false);
        setProducts(res);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  if (loading) return <Loading message="Loading Products..." />;

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
