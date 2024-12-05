import { useNavigate } from "react-router-dom";
import { Button, Container, Typography, Box } from "@mui/material";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Container
      maxWidth="sm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        style={{
          width: "100%",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Car Selling Service
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          style={{ marginTop: "20px" }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
