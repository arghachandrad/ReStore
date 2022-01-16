import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/api/agent";
import { useStoreContext } from "../../app/context/StoreContext";
import { Product } from "../../app/models/product";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const { setBasket } = useStoreContext();
  const [loading, setLoading] = useState(false);

  const handleAddItem = async (productId: number) => {
    setLoading(true);
    try {
      const res = await agent.Basket.addItem(productId);
      setBasket(res);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "secondary.main" }}>{product.name.charAt(0).toUpperCase()}</Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: {
            fontWeight: "bold",
            color: "primary.main",
          },
        }}
      />
      <CardMedia
        component="img"
        // height="140"
        image={product.pictureUrl}
        alt={product.name}
        sx={{ backgroundSize: "contain", bgcolor: "primary.light" }}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={loading} size="small" onClick={() => handleAddItem(product.id)}>
          Add to Cart
        </LoadingButton>
        <Button size="small" component={Link} to={`/catalog/${product.id}`}>
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
