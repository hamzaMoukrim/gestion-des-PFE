import logo from "./logo.svg";
import "./App.css";
import React, { useEffect } from "react";
import SignIn from "./components/signin/SignIn";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Student from "./components/student/Student";
import ChefDept from "./components/chefdept/ChefDept";
import { connect } from "react-redux";
import * as actionTypes from "./components/store/reducers/actions";
import CommentStage from "./components/enseignant/Commentaire/CommentStage";
import Enseignant from "./components/enseignant/Enseignant";
import Admin from "./components/admin/Admin";
import { useAuthContext } from "./providers/index";
function App(props) {
  const { isLoggedIn } = useAuthContext();

  return (
    <div className="App">
      <Router>
        {/* {isLoggedIn ? (
              user.role != null && user.role === "0" ? (
                <Redirect to="/student" />
              ) : user.role != null && user.role === "1" ? (
                <Redirect to="/enseignant" />
              ) : user.role != null && user.role === "2" ? (
                <Redirect to="/chefdept" />
              ) : user.role === "3" ? (
                <Redirect to="/admin" />
              ) : (
                <SignIn />
              )
            ) : (
              <SignIn />
            )} */}
        <Switch>
          <Route path="/" component={SignIn} exact></Route>

          <Route path="/student">
            {isLoggedIn ? <Student /> : <Redirect to="/" />}
          </Route>

          <Route exact path="/enseignant">
            {isLoggedIn ? <Enseignant /> : <Redirect to="/" />}
          </Route>

          <Route path="/chefdept">
            {isLoggedIn ? <ChefDept /> : <Redirect to="/" />}
          </Route>

          <Route path="/admin">
            {isLoggedIn ? <Admin /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSucceed: (userid, userinfo) =>
      dispatch({ type: actionTypes.LOGED, userid: userid, userinfo }),
  };
};

const mapStateToProps = (state) => {
  return {
    isLoged: state.isLoged,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
