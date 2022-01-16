import { Delete } from "@mui/icons-material";
import {
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
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Basket } from "../../app/models/basket";

const BasketPage = () => {
  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState<Basket | null>(null);

  useEffect(() => {
    // if user have buyerId in cookies then only can get Basket
    const getBasket = async () => {
      try {
        const res = await agent.Basket.get();
        setBasket(res);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getBasket();
  }, []);

  if (loading) return <Loading message="Loading your Basket..." />;

  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
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
                {basketItem.name}
              </TableCell>
              <TableCell align="right">${(basketItem.price / 100).toFixed(2)}</TableCell>
              <TableCell align="right">{basketItem.quantity}</TableCell>
              <TableCell align="right">
                ${((basketItem.price * basketItem.quantity) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton color="error">
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasketPage;
