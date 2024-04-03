import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./components/Home"
import Signin from "./components/SignIn"
import SignUp from "./components/SignUp"
import About from "./components/About"
import Profile from "./components/Profile"
import Header from "./components/Header"
import HeaderAuth from "./components/HeaderAuth"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./components/CreateListing"

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}



function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/sign-in" || location.pathname === "/sign-up";

  return (
    <>
      {isAuthPage ? <HeaderAuth /> : <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing/>}/>
        </Route>
      </Routes>
    </>
  );
}

export default App
