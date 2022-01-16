import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";

const BasketPage = () => {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [loading, setLoading] = useState(false);

  const handleAddItem = async (productId: number) => {
    setLoading(true);
    try {
      const basket = await agent.Basket.addItem(productId);
      setBasket(basket);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    try {
      await agent.Basket.removeItem(productId, quantity);
      removeItem(productId, quantity);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="right">Subtotal</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {basket.items.map((basketItem) => (
            <TableRow
              key={basketItem.productId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {
                  <Box display="flex" alignItems="center">
                    <img
                      src={basketItem.pictureUrl}
                      alt={basketItem.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{basketItem.name}</span>
                  </Box>
                }
              </TableCell>
              <TableCell align="right">${(basketItem.price / 100).toFixed(2)}</TableCell>
              <TableCell align="center">
                <LoadingButton
                  loading={loading}
                  color="error"
                  onClick={() => handleRemoveItem(basketItem.productId)}
                >
                  <Remove />
                </LoadingButton>
                {basketItem.quantity}
                <LoadingButton
                  color="success"
                  loading={loading}
                  onClick={() => handleAddItem(basketItem.productId)}
                >
                  <Add />
                </LoadingButton>
              </TableCell>
              <TableCell align="right">
                ${((basketItem.price * basketItem.quantity) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <LoadingButton
                  color="error"
                  loading={loading}
                  onClick={() => handleRemoveItem(basketItem.productId, basketItem.quantity)}
                >
                  <Delete />
                </LoadingButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasketPage;
