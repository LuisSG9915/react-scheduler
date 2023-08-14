import React, { useEffect, useState } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText,
  Container,
  CardHeader,
  Card,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";
import Swal from "sweetalert2";
// import "../../css/sidebar.css";
// import "../../css/reportes.css";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";

const SidebarHorizontal = () => {
  // const [isOpen, setIsOpen] = useState(false);
  // const [form, setForm] = useState<any[]>([]);
  // const [isIdle, setIsIdle] = useState(false);
  // const [lastActivity, setLastActivity] = useState(Date.now());
  // const [isDataLoaded, setIsDataLoaded] = useState(false);
  const navigate = useNavigate();
  // const toggle = () => {
  //   setIsOpen(!isOpen);
  // };

  // useEffect(() => {
  //   const item = localStorage.getItem("userLoggedv2");
  //   if (item !== null) {
  //     try {
  //       const parsedItem = JSON.parse(item);
  //       setForm(parsedItem);
  //       console.log(form);
  //       const formattedJSON = JSON.stringify(parsedItem, null, 2);
  //       const alertMessage = formattedJSON.replace(/\\n/g, "\n");

  //       console.log(alertMessage);
  //       setIsDataLoaded(true);
  //     } catch (error) {
  //       console.error("Error parsing JSON:", error);
  //       // Mostrar un alert en caso de error
  //       // alert("Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.");
  //       // Otra opción es usar una librería de notificaciones como "sweetalert2" para mostrar un mensaje más estilizado

  //       Swal.fire({
  //         icon: "error",
  //         title: "Error",
  //         text: "Error al cargar los datos de sesión. Por favor, vuelve a iniciar sesión.",
  //       });
  //       redireccion();
  //     }
  //   } else {
  //     redireccion();
  //   }
  // }, []);

  // const handleTimerExpiration = () => {
  //   localStorage.removeItem("timerExpiration");
  // };

  // const handleTimerUpdate = (timeLeft: number, userLogged: any[]) => {
  //   const expirationTime = Date.now() + timeLeft;
  //   localStorage.setItem("timerExpiration", String(expirationTime));
  //   localStorage.setItem("userLoggedv2", JSON.stringify(userLogged));
  // };

  // const isTimerExpired = () => {
  //   const timerExpiration = localStorage.getItem("timerExpiration");
  //   if (timerExpiration) {
  //     return Date.now() >= Number(timerExpiration);
  //   }
  //   return false;
  // };

  // const handleUserActivity = () => {
  //   setIsIdle(false);
  //   setLastActivity(Date.now());
  // };

  // const checkUserActivity = () => {
  //   const inactivityPeriod = 30000; // 30 segundos de inactividad

  //   if (Date.now() - lastActivity > inactivityPeriod) {
  //     setIsIdle(true);
  //   }
  // };

  // // quitamos la veriabla de session del usuario logeado

  // const clearUserData = () => {
  //   localStorage.removeItem("userLoggedv2");
  // };

  // const handleLogout = () => {
  //   Swal.fire({
  //     title: "Sesión cerrada por inactividad",
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  //   clearUserData();
  //   navigate("/");
  // };

  // const redireccion = () => {
  //   Swal.fire({
  //     title: "Debe iniciar sesion",
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  //   clearUserData();
  //   navigate("/");
  // };

  const cierraSesion = () => {
    Swal.fire({
      title: "Se cerrará la sesión. ¿Deseas continuar?",
      showDenyButton: true,
      confirmButtonText: "Cerrar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: "Sesión terminada",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    });
  };
  // const [currentDateTime, setCurrentDateTime] = useState("");
  // useEffect(() => {
  //   // Función para obtener la fecha y hora actual en el formato deseado
  //   const getCurrentDateTime = () => {
  //     const now = new Date();
  //     const dateOptions = {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     };
  //     const timeOptions = {
  //       hour: "numeric",
  //       minute: "numeric",
  //       second: "numeric",
  //       hour12: false, // Para mostrar la hora en formato de 24 horas
  //     };
  //     return;
  //     // const currentDate = now.toLocaleDateString(undefined, dateOptions);
  //     // const currentTime = now.toLocaleTimeString(undefined, timeOptions);
  //     // return `${currentDate}, ${currentTime}`;
  //   };

  //   // Actualizar el estado con la fecha y hora actual
  //   // const interval = setInterval(() => {
  //   //   const dateTime = getCurrentDateTime();
  //   //   setCurrentDateTime(dateTime);
  //   // }, 1000); // Actualizar cada segundo (o ajusta el intervalo según lo desees)

  //   // Limpiar el intervalo cuando el componente se desmonte
  //   // return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <>
        <div>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={null}
              ></IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={false}
              >
                {/* Replace the items below with your menu items */}
                <MenuItem onClick={() => navigate("/Cias")}>Empresas</MenuItem>
                <MenuItem onClick={() => navigate("/Sucursales")}>Sucursales</MenuItem>
                {/* Add more menu items as needed */}
              </Menu>
              {/* Add more buttons or components here */}
              <Button color="inherit" onClick={cierraSesion}>
                Cerrar sesión
              </Button>
            </Toolbar>
          </AppBar>
        </div>
        {/* <div className="">
            {isTimerExpired() ? (
              <Timer
                limitInMinutes={60}
                onExpiration={handleLogout}
                redirectPath={undefined}
                onUpdate={undefined}
              />
            ) : (
              <Timer
                limitInMinutes={60}
                onExpiration={handleLogout}
                onUpdate={handleTimerUpdate}
                redirectPath={undefined}
              />
            )}
          </div> */}
      </>
    </>
  );
};

export default SidebarHorizontal;
