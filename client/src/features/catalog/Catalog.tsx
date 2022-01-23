import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchProductsAsync, productSelectors } from "./catalogSlice";
import ProductList from "./ProductList";

const Catalog = () => {
  const products = useAppSelector(productSelectors.selectAll); // fetching product using entity adaptor for normalization
  const { productsLoaded, status } = useAppSelector((state) => state.catalog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // check if products are already loaded
    if (!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch]);

  if (status.includes("pending")) return <Loading message="Loading Products..." />;

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default Catalog;
