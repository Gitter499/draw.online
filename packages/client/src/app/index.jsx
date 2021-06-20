import Routes from "./routes";
import { useState } from "react";
import userContext from "./data/user.context";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  const [data, setData] = useState({
    username: "",
  });

  return (
    <Router>
      <ChakraProvider>
        <userContext.Provider value={{ data, setData }}>
          <Routes />
        </userContext.Provider>
      </ChakraProvider>
    </Router>
  );
};

export default App;
