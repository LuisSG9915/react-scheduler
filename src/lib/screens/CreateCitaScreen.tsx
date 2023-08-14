import {
  Select,
  MenuItem,
  CardContent,
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  Modal,
  FormGroup,
  ButtonGroup,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfToday, setHours, parse } from "date-fns";
import React, { useEffect, useState } from "react";

import { useClientes } from "../hooks/useClientes";
import { Eventos } from "../models/Events";
import axios from "axios";
import { Servicio, ServicioPost } from "../models/Servicio";
import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import { jezaApi } from "../api/jezaApi";
import { useProductosFiltradoExistenciaProducto } from "../hooks/useProductosFiltradoExistenciaProducto";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Swal from "sweetalert2";

function CreateCitaScreen() {
  const { dataClientes } = useClientes();
  const [modalCliente, setmodalCliente] = useState(false);
  const [datasServicios, setDatasServicios] = useState<[]>([]);

  const minDateTime = setHours(startOfToday(), 8);
  const [modalServiciosAgregar, setModalServiciosAgregar] = useState(false);
  const [modalProductoSelect, setModalProductoSelect] = useState(false);

  const maxDateTime = setHours(startOfToday(), 20);
  const [dataEvent, setDataEvent] = useState<Eventos>({
    id: 0,
    event_id: "",
    title: "",
    description: "",
    start: new Date("20230713"),
    end: new Date("20230713"),
    admin_id: 0,
    color: "",
    horaFin: new Date("20230713"),
    fechaCita: new Date("20230713"),
    idUsuario: 0,
    cia: 0,
    sucursal: 0,
    d_sucursal: "",
    idCliente: 0,
    nombreCliente: "",
    tiempo: 0,
    idEstilista: 0,
    nombreEstilista: "",
    nombreRecepcionista: "",
    fechaAlta: "",
    estatus: 0,
    descripcionEstatus: "",
    fechaCambio: "",
    idcolor: 0,
    idEstatus: 0,
  });
  const idUser = new URLSearchParams(window.location.search).get("idUser");
  const fecha = new URLSearchParams(window.location.search).get("fecha");
  const idRec = new URLSearchParams(window.location.search).get("idRec");
  const idSuc = new URLSearchParams(window.location.search).get("idSuc");
  const [datosParametros, setDatosParametros] = useState({
    idUser: 0,
    fecha: new Date(),
    idRec: 0,
    idSuc: 0,
  });
  useEffect(() => {
    setDatosParametros({
      idUser: Number(idUser),
      fecha: new Date(fecha),
      idRec: Number(idRec),
      idSuc: Number(idSuc),
    });

    if (!datosParametros.idSuc) {
      alert("Favor de ingresar en la página principal");
    }
  }, []);

  const postCita = () => {
    const fechaTemporal = new Date(datosParametros.fecha);
    const formattedDate = format(fechaTemporal, "yyyy-MM-dd HH:mm");
    if (!dataEvent.idCliente) {
      alert("No puede ingresar datos vacios");
    } else {
      axios
        .post(
          `http://cbinfo.no-ip.info:9089/Cita?cia=26&sucursal=${datosParametros.idSuc}&fechaCita=${formattedDate}&idCliente=${dataEvent.idCliente}&tiempo=0&idEstilista=${datosParametros.idUser}&idUsuario=${datosParametros.idRec}&estatus=1`
        )
        .then((response) => {
          // peticiones();
          setFormServicio({ ...formServicio, id_Cita: response.data[0].mensaje2 });
          setTimeout(() => {
            setModalServiciosAgregar(true);
          }, 1111);
        });
    }
  };
  const [formServicio, setFormServicio] = useState<ServicioPost>({
    id_Cita: 0,
    idServicio: 0,
    cantidad: 0,
    precio: 0,
    observaciones: "",
    usuario: 0,
    d_servicio: "",
    id: 0,
  });
  const limpiarFormServicios = () => {
    setFormServicio({
      cantidad: 0,
      id_Cita: 0,
      idServicio: 0,
      observaciones: "",
      precio: 0,
      usuario: 0,
      d_servicio: "",
      id: 0,
    });
    setDatasServicios([]);
  };
  const deleteServicio = (id: number) => {
    jezaApi.delete(`/CitaServicio?idServicio=${id}`).then(() => {
      alert("Eliminación exitosa");
      getCitaServicios(formServicio.id_Cita);
    });
  };
  const getCitaServicios = async (id: number) => {
    const temporal = new Date(datosParametros.fecha);
    const fechaFormateada = format(temporal, "yyyyMMdd");
    try {
      const response = await axios.get(
        `http://cbinfo.no-ip.info:9089/Citaservicio?id=${id}&fecha=${fechaFormateada}&sucursal=${datosParametros.idSuc}`
      );
      setDatasServicios(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [modalServicioEdit, setModalServicioEdit] = useState(false);
  const { dataProductos4 } = useProductosFiltradoExistenciaProducto({
    descripcion: "%",
    insumo: 0,
    inventariable: 0,
    obsoleto: 0,
    servicio: 1,
    sucursal: datosParametros.idSuc,
  });
  const columnsProductos4: GridColDef[] = [
    { field: "descripcion", headerName: "Descripcion", width: 200 },
    { field: "precio", headerName: "Precio", width: 100 },
    { field: "tiempo", headerName: "Tiempo", width: 80 },
    {
      field: "action",
      headerName: "Acciones",
      width: 200,
      // renderCell: (params) => <span>{params.row.precio}</span>,
      renderCell: (params) => (
        <Button
          variant={"contained"}
          onClick={() => {
            setFormServicio({
              ...formServicio,
              idServicio: params.row.id,
              precio: params.row.precio,
              d_servicio: params.row.descripcion,
            });
            setModalProductoSelect(false);
          }}
        >
          Agregar
        </Button>
      ),
    },
  ];
  const postServicio = () => {
    if (formServicio.cantidad !== 0 && formServicio.idServicio > 0) {
      jezaApi
        .post(
          `/CitaServicio?id_Cita=${formServicio.id_Cita}&idServicio=${formServicio.idServicio}&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${formServicio.observaciones}&usuario=${datosParametros.idUser}`
        )
        .then((response) => {
          getCitaServicios(formServicio.id_Cita);
          setFormServicio({ ...formServicio, d_servicio: "", cantidad: 0, observaciones: "" });
          Swal.fire({
            icon: "success",
            text: `Realizado`,
            confirmButtonColor: "#3085d6",
          });
        });
    } else {
      alert("Datos vacíos, intente de nuevo");
    }
  };

  const dataClientesWithIds = dataClientes.map((cliente, index) => ({
    ...cliente,
    id: index + 1, // O utiliza algún valor único de tu elección
  }));

  return (
    <>
      <FormGroup style={{ marginRight: 20, marginLeft: 20 }}>
        <h2>Ingresar cita</h2>
        <p>Fecha de cita</p>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            value={new Date(datosParametros.fecha)}
            timeSteps={{ minutes: 15 }}
            minTime={minDateTime}
            maxTime={maxDateTime}
            sx={{ width: "100%", ml: 0.3 }}
            timezone={"America/Mexico_City"}
            ampm={false}
            format="dd/MM/yyyy HH:mm" // Formato DDMMAAAA HH:mm (hora en formato 24 horas)
            onChange={(fecha) => {
              setDatosParametros({
                ...datosParametros,
                fecha: fecha,
              });
            }}
          />
        </LocalizationProvider>
        <br />
        <p>Cliente</p>
        <Select name="nombreCliente" value={dataEvent.idCliente} disabled>
          <MenuItem value={0}> Seleccione un cliente </MenuItem>
          {dataClientes.map((cte) => (
            <MenuItem key={cte.id_cliente} value={cte.id_cliente}>
              {cte.nombre}
            </MenuItem>
          ))}
        </Select>
        <ButtonGroup style={{ marginTop: 15, direction: "rtl" }}>
          <Button variant="contained" color="primary" onClick={() => setmodalCliente(true)}>
            Buscar
          </Button>
        </ButtonGroup>
      </FormGroup>
      <br />
      <br />
      <br />
      <ButtonGroup style={{ marginRight: 20, marginLeft: 20, direction: "rtl" }}>
        {/* <Button
          color="error"
          variant="outlined"
          onClick={() => {
            setDataEvent({
              ...dataEvent,
              description: "",
              nombreCliente: "",
              idCliente: 0,
            });
          }}
        >
          Salir
        </Button> */}
        <Button color="success" variant="contained" onClick={() => postCita()}>
          Guardar cita
        </Button>
      </ButtonGroup>
      <br />
      <br />
      <Modal open={modalCliente} onClose={() => setmodalCliente(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            maxHeight: "80%", // Cambiar height a maxHeight
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Búsqueda de clientes </h2>
          <DataGrid
            rows={dataClientesWithIds}
            columns={[
              {
                field: "nombre",
                headerName: "Nombre",
                width: 200,
              },
              {
                field: "id",
                headerName: "Seleccionar",
                width: 130,
                renderCell: (params) => (
                  <Button
                    variant="contained"
                    onClick={() => {
                      setmodalCliente(false);
                      setDataEvent({
                        ...dataEvent,
                        idCliente: params.row.id_cliente,
                      });
                    }}
                  >
                    Seleccionar
                  </Button>
                ),
              },
            ]}
            autoHeight // Asegura que el DataGrid tenga una altura adecuada
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          />
        </div>
      </Modal>

      <Modal
        open={modalServiciosAgregar}
        onClose={() => {
          setModalServiciosAgregar(false);
          limpiarFormServicios();
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "75%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <hr />
          <h3>Servicios...</h3>

          {datasServicios.length > 0 ? (
            datasServicios.map((servicio: Servicio, index: number) => (
              <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                <Grid container>
                  <Grid item xs={12}>
                    <Card sx={{ width: "100%" }}>
                      <CardContent>
                        <Grid container alignItems="center" justifyContent="space-between">
                          <Grid item>
                            <Typography variant="body1">
                              Servicio: {servicio.descripcion}
                            </Typography>
                            <Typography variant="caption">
                              Cantidad: {servicio.cantidad + "   "}
                            </Typography>
                            <Typography variant="caption">
                              {servicio.observaciones
                                ? `Obseración: ${servicio.observaciones} `
                                : ""}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <DeleteIcon
                              onClick={() => deleteServicio(Number(servicio.id))}
                              style={{ marginLeft: "auto" }}
                            />
                            <EditIcon
                              onClick={() => {
                                setFormServicio({
                                  cantidad: servicio.cantidad,
                                  id_Cita: servicio.id_Cita,
                                  idServicio: servicio.idServicio,
                                  observaciones: servicio.observaciones,
                                  precio: servicio.precio,
                                  usuario: 1,
                                  d_servicio: servicio.descripcion,
                                  id: servicio.id,
                                });
                                setModalServicioEdit(true);
                                console.log(servicio);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            ))
          ) : (
            <p>No hay servicios en proceso</p>
          )}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <h3>Agregar servicios</h3>
            <AddCircleIcon
              fontSize="large"
              onClick={() => {
                setModalProductoSelect(true);
              }}
            />
          </div>
          <p> Servicio: {formServicio.d_servicio}</p>
          <TextField
            label={"Cantidad"}
            name="cantidad"
            value={formServicio.cantidad}
            // onChange={handleChangeServicios}
            onChange={(valor) => {
              setFormServicio({ ...formServicio, cantidad: Number(valor.target.value) });
            }}
            fullWidth
            size="small"
            sx={{ marginBottom: "16px" }}
          ></TextField>
          <br />
          <br />
          <TextField
            label={"Observaciones"}
            name="observaciones"
            value={formServicio.observaciones}
            onChange={(valor) => {
              setFormServicio({ ...formServicio, observaciones: valor.target.value });
            }}
            // onChange={handleChangeServicios}
            fullWidth
            size="small"
            sx={{ marginBottom: "16px" }}
          ></TextField>

          <Button
            variant="contained"
            color="success"
            onClick={() => {
              postServicio();
              limpiarFormServicios();
            }}
          >
            Guardar
          </Button>
          <br />
          <br />
          <hr />
          <br />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setModalServiciosAgregar(false);
                limpiarFormServicios();
              }}
            >
              Salir
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={modalProductoSelect}
        onClose={() => {
          setModalProductoSelect(false);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60%",
            maxHeight: "90%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Selección de servicio </h2>
          <DataGrid
            rows={dataProductos4}
            columns={columnsProductos4}
            autoHeight
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 8,
                },
              },
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          ></DataGrid>
          <br />
          <br />
          <br />

          {/* <Button onClick={() => edit()}> Guardar </Button> */}
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <Button
              color="error"
              variant={"contained"}
              onClick={() => {
                setModalProductoSelect(false);
              }}
            >
              Salir
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateCitaScreen;
