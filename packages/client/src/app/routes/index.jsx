import Home from "../pages/Home";
import Draw from "../pages/Draw";
import { Switch, Route } from "react-router-dom";
import Canvas from "../components/Canvas";

const Routes = () => {
  return (
    <Switch>
      <Route exact path={"/"}>
        <Home />
      </Route>
      <Route exact path={"/draw"}>
        <Draw />
      </Route>
      <Route exact path={"/canvas"}>
        <Canvas />
      </Route>
    </Switch>
  );
};

export default Routes;
