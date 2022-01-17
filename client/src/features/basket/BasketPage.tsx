import { Add, Delete, Remove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Grid,
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
import BasketSummary from "./BasketSummary";

const BasketPage = () => {
  const { basket, setBasket, removeItem } = useStoreContext();
  const [status, setStatus] = useState({
    loading: false,
    name: "",
  });

  const handleAddItem = async (productId: number, name: string) => {
    setStatus({ ...status, loading: true, name });
    try {
      const basket = await agent.Basket.addItem(productId);
      setBasket(basket);
      setStatus({ ...status, loading: false, name: "" });
    } catch (error) {
      console.log(error);
      setStatus({ ...status, loading: false, name: "" });
    }
  };

  const handleRemoveItem = async (productId: number, quantity: number = 1, name: string) => {
    setStatus({ ...status, loading: true, name });
    try {
      await agent.Basket.removeItem(productId, quantity);
      removeItem(productId, quantity);
      setStatus({ ...status, loading: false, name: "" });
    } catch (error) {
      console.log(error);
      setStatus({ ...status, loading: false, name: "" });
    }
  };

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
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
                    loading={status.loading && status.name === "rem" + basketItem.productId}
                    color="error"
                    onClick={() =>
                      handleRemoveItem(basketItem.productId, 1, `rem${basketItem.productId}`)
                    }
                  >
                    <Remove />
                  </LoadingButton>
                  {basketItem.quantity}
                  <LoadingButton
                    color="success"
                    loading={status.loading && status.name === "add" + basketItem.productId}
                    onClick={() =>
                      handleAddItem(basketItem.productId, `add${basketItem.productId}`)
                    }
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
                    loading={status.loading && status.name === "del" + basketItem.productId}
                    onClick={() =>
                      handleRemoveItem(
                        basketItem.productId,
                        basketItem.quantity,
                        `del${basketItem.productId}`
                      )
                    }
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
    </>
  );
};

export default BasketPage;
