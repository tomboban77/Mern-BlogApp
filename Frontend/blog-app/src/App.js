import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";
import UpdateCategory from "./components/Categories/UpdateCategory";
import UpdateComment from "./components/Comments/UpdateComment";
import HomePage from "./components/Homepage/HomePage";
import Navbar from "./components/Navbar/Navbar";
import AdminRoute from "./components/Navbar/ProtectedRoutes/AdminRoute";
import PrivateRoute from "./components/Navbar/ProtectedRoutes/PrivateRoute";
import CreatePost from "./components/Posts/CreatePost";
import PostDetails from "./components/Posts/PostDetails";
import PostsList from "./components/Posts/PostsList";
import UpdatePost from "./components/Posts/UpdatePost";
import AccountVerified from "./components/Users/AccountVerified";
import Login from "./components/Users/Login";
import Profile from "./components/Users/Profile";
import Register from "./components/Users/Register";
import SendEmail from "./components/Users/SendEmail";
import UpdateProfileForm from "./components/Users/UpdateProfileForm";
import UploadProfilePhoto from "./components/Users/UploadProfilePhoto";
import UsersList from "./components/UsersList/UsersList";

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/posts" component={PostsList} />
        <Route exact path="/posts/:id" component={PostDetails} />

        <PrivateRoute exact path="/profile/:id" component={Profile} />
        <PrivateRoute
          exact
          path="/update-profile/:id"
          component={UpdateProfileForm}
        />
        <PrivateRoute
          exact
          path="/upload-photo"
          component={UploadProfilePhoto}
        />
        <PrivateRoute exact path="/update-post/:id" component={UpdatePost} />
        <PrivateRoute exact path="/create-post" component={CreatePost} />
        <PrivateRoute
          exact
          path="/update-comment/:id"
          component={UpdateComment}
        />
        <PrivateRoute
          exact
          path="/verify-account/:token"
          component={AccountVerified}
        />
        <AdminRoute exact path="/add-category" component={AddNewCategory} />
        <AdminRoute exact path="/category-list" component={CategoryList} />
        <AdminRoute
          exact
          path="/update-category-list/:id"
          component={UpdateCategory}
        />
        <AdminRoute exact path="/send-mail" component={SendEmail} />
        <AdminRoute exact path="/users" component={UsersList} />
      </Switch>
    </Router>
  );
}

export default App;
