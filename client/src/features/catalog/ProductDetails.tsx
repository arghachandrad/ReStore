import { LoadingButton } from "@mui/lab";
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeItem, setBasket } from "../basket/basketSlice";

const ProductDetails = () => {
  const { basket } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const item = basket?.items.find((i) => i.productId === product?.id); // checking whether item is in basket

  useEffect(() => {
    // if in basket this item is there then setting its quantity to this value
    if (item) setQuantity(item.quantity);
    const fetchProduct = async () => {
      try {
        const res = await agent.Catalog.details(Number(id));
        setLoading(false);
        setProduct(res);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, item]);

  const handleInputChange = (event: any) => {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  };

  const handleUpdateCart = async () => {
    setSubmitting(true);
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      try {
        const response = await agent.Basket.addItem(product?.id!, updatedQuantity);
        dispatch(setBasket(response));
        setSubmitting(false);
      } catch (error) {
        console.log(error);
        setSubmitting(false);
      }
    } else {
      try {
        const updatedQuantity = item.quantity - quantity;
        await agent.Basket.removeItem(product?.id!, updatedQuantity);
        dispatch(removeItem({ productId: product?.id!, quantity: updatedQuantity }));
        setSubmitting(false);
      } catch (error) {
        console.log(error);
        setSubmitting(false);
      }
    }
  };

  if (loading) return <Loading message="Loading Product Details..." />;

  if (!product) return <h3>Product Not Found</h3>;

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} sm={12} md={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%", objectFit: "cover" }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in Stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={item?.quantity === quantity || (!item && quantity === 0)}
              loading={submitting}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              onClick={handleUpdateCart}
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ProductDetails;
