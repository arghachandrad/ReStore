import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import agent from "../../app/api/agent";

const AboutPage = () => {
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
        <Button
          variant="contained"
          onClick={async () => await agent.TestErrors.getValidationError()}
        >
          Test Validation Error
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default AboutPage;
