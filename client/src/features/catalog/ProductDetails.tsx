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
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

const ProductDetails = () => {
  const { basket, status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  // using entity adaptor to get product By ID from out state(but need this to happen when we donot have product)
  const product = useAppSelector((state) => productSelectors.selectById(state, id));
  const { status: productStatus } = useAppSelector((state) => state.catalog);
  const [quantity, setQuantity] = useState(0);
  const item = basket?.items.find((i) => i.productId === product?.id); // checking whether item is in basket

  useEffect(() => {
    // if in basket this item is there then setting its quantity to this value
    if (item) setQuantity(item.quantity);

    // if fetching product from state, then also if we donot have product, then call API(eg, reloading from productDetails page)
    if (!product) dispatch(fetchProductAsync(parseInt(id)));
  }, [id, item, dispatch, product]);

  const handleInputChange = (event: any) => {
    if (event.target.value >= 0) {
      setQuantity(parseInt(event.target.value));
    }
  };

  const handleUpdateCart = async () => {
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      dispatch(addBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }));
    } else {
      const updatedQuantity = item.quantity - quantity;
      dispatch(removeBasketItemAsync({ productId: product?.id!, quantity: updatedQuantity }));
    }
  };

  if (productStatus.includes("pending")) return <Loading message="Loading Product Details..." />;

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
              loading={status.includes("pending" + item?.productId)}
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
