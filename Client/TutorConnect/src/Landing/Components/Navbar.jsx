import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import logoImg from "../media/logo.png";
import { Container } from "@mui/system";
import CustomButton from "./CustomButton";
import { styled } from "@mui/material";
import { useState } from "react";

export const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.type === "Tab" || event.type === "Shift")
    ) {
      return;
    }
    setMobileMenu({ ...mobileMenu, [anchor]: open });
  };

  const NavbarLinksBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  const CustomMenuIcon = styled(MenuIcon)(({ theme }) => ({
    cursor: "pointer",
    display: "none",
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  }));

  const NavbarContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(5),
    [theme.breakpoints.down("md")]: {
      padding: theme.spacing(2),
    },
  }));

  const NavbarLogo = styled("img")(({ theme }) => ({
    cursor: "pointer",
    width: "12rem",
    height : "8rem",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  }));

  return (
    <NavbarContainer sx={{}}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2.5rem",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CustomMenuIcon onClick={toggleDrawer("left", true)} />
          <NavbarLogo src={logoImg} alt="logo-TutorConnect" />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Link to="/login" style={{ textDecoration: "none" }}>
          <CustomButton
            backgroundColor="#fff"
            color="#4CAF50"
            buttonText="Login"
            borderColor="#4CAF50"
          />
        </Link>

        <Link to="/signup" style={{ textDecoration: "none" }}>
          <CustomButton
            backgroundColor="#4CAF50"
            color="#fff"
            buttonText="Get Started"
          />
        </Link>
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;