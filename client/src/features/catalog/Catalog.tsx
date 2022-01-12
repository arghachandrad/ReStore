import { Product } from "../../app/models/product";

interface Props {
  products: Product[];
  // addProduct: () => void
}

const Catalog = ({ products }: Props) => {
  return (
    <>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </>
  );
};

export default Catalog;
