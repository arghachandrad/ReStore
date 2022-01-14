import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import agent from "../../app/api/agent";

const AboutPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const getValidationErrors = async () => {
    try {
      const res = await agent.TestErrors.getValidationError();
      console.log("should not see this:--", res);
    } catch (error) {
      const err = error as string[];
      console.log(err);
      setValidationErrors(err);
    }
  };
  return (
    <Container>
      <Typography gutterBottom variant="h2">
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth>
        <Button
          variant="contained"
          onClick={async () => {
            try {
              return await agent.TestErrors.get400Error();
            } catch (error) {
              console.log(error);
            }
          }}
        >
          Test 400 Error
        </Button>
        <Button variant="contained" onClick={async () => await agent.TestErrors.get401Error()}>
          Test 401 Error
        </Button>
        <Button variant="contained" onClick={async () => await agent.TestErrors.get404Error()}>
          Test 404 Error
        </Button>
        <Button variant="contained" onClick={async () => await agent.TestErrors.get500Error()}>
          Test 500 Error
        </Button>
        <Button variant="contained" onClick={getValidationErrors}>
          Test Validation Error
        </Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity="error">
          <AlertTitle>ValidationErrors</AlertTitle>
          <List>
            {validationErrors.map((error) => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  );
};

export default AboutPage;
