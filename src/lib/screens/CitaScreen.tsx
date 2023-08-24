import {
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  SelectChangeEvent,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState } from "react";
import { format, startOfToday, setHours } from "date-fns";
import { useClientes } from "../hooks/useClientes";
import axios from "axios";
import { Eventos } from "../models/Events";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ServicioPost, Servicio } from "../models/Servicio";
import { EstilistaResponse } from "../models/Estilista";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import DeleteIcon from "@mui/icons-material/Delete";
import { jezaApi } from "../api/jezaApi";
import { useProductosFiltradoExistenciaProducto } from "../hooks/useProductosFiltradoExistenciaProducto";
import { DATA_GRID_PROPS_DEFAULT_VALUES, DataGrid, GridColDef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { Cliente } from "../models/Cliente";

function CitaScreen() {
  const [modalCliente, setmodalCliente] = useState(false);
  const [datosParametros, setDatosParametros] = useState({
    idCita: 0,
    idUser: 0,
    idCliente: "0",
    fecha: new Date(),
    idClienteSeparada: 0,
    tiempoSeparada: 0,
    d_cliente: "",
    idEstilista: 0,
    idRec: 0,
    idSuc: 0,
  });
  useEffect(() => {
    const idCita = new URLSearchParams(window.location.search).get("idCita");
    const idUser = new URLSearchParams(window.location.search).get("idUser");
    const idCliente = new URLSearchParams(window.location.search).get("idCliente");
    const fecha = new URLSearchParams(window.location.search).get("fecha");
    const idSuc = new URLSearchParams(window.location.search).get("idSuc");
    const cadenaClienteTiempo = idCliente.split(",");
    const idClienteSeparada = cadenaClienteTiempo[0];
    const tiempoSeparada = cadenaClienteTiempo[1];
    const estilistaSeparada = cadenaClienteTiempo[2];
    const idRec = new URLSearchParams(window.location.search).get("idRec");

    const getCiaForeignKey = () => {
      const cliente = dataClientes.find((cia: Cliente) => cia.id_cliente === Number(idCliente));
      return cliente ? cliente.nombre : "Sin cliente";
    };
    setDatosParametros({
      idCita: Number(idCita),
      idUser: Number(idUser),
      idCliente: idCliente,
      fecha: new Date(fecha),
      idClienteSeparada: Number(idClienteSeparada),
      tiempoSeparada: Number(tiempoSeparada),
      d_cliente: getCiaForeignKey(),
      idEstilista: Number(estilistaSeparada),
      idSuc: Number(idSuc),
      idRec: Number(idRec),
    });
  }, []);
  const clavesEmpleados = ["4", "5", "9", "10"];

  const peticionEstilista = async () => {
    try {
      const response = await axios.get("http://cbinfo.no-ip.info:9089/Trabajador?id=0");
      const reponseTemporal = response.data;
      const formattedData = reponseTemporal.map((evento: EstilistaResponse) => ({
        ...evento,
        admin_id: evento?.id ? evento?.id : 0,
        title: evento?.nombre ? evento?.nombre : "",
        mobile: evento?.descripcion_puesto ? evento?.descripcion_puesto : "",
      }));

      setDatasEstilista(reponseTemporal);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    peticionEstilista();
  }, []);

  const minDateTime = setHours(startOfToday(), 8);

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
    idEstatus: 1,
  });
  const { dataClientes } = useClientes();

  const [modalCitaEdit, setModalCitaEdit] = useState(false);
  const handleChangeSelect = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value;
    const selectedName = event.target.name;
    setDataEvent((prevState: any) => ({ ...prevState, [selectedName]: selectedValue }));
  };
  const [datasEstilista, setDatasEstilista] = useState<EstilistaResponse[]>([]);
  const [modalEstilista, setModalEstilista] = useState(false);
  const putCitaEstado = () => {
    const temporal = new Date(datosParametros.fecha);
    const nuevaFecha = format(temporal, "yyyy-MM-dd HH:mm");

    axios
      .put(
        `http://cbinfo.no-ip.info:9089/Cita?id=${datosParametros.idCita}&cia=26&sucursal=${
          datosParametros.idSuc
        }&fechaCita=${nuevaFecha}&idCliente=${datosParametros.idClienteSeparada}&tiempo=${
          datosParametros.tiempoSeparada.toString() === "NaN" ? 0 : datosParametros.tiempoSeparada
        }&idEstilista=${datosParametros.idEstilista}&idUsuario=${datosParametros.idRec}&estatus=${
          dataEvent.idEstatus
        }`
      )
      .then((response) => {
        setSuccessInfo(true);
        setModalCitaEdit(false);
      });
  };

  const [datasServicios, setDatasServicios] = useState<[]>([]);

  const deleteServicio = (id: number) => {
    if (datasServicios.length <= 1) {
      alert("No puede quedase una cita sin servicios");
    } else {
      jezaApi.delete(`/CitaServicio?idServicio=${id}`).then(() => {
        getCitaServicios(Number(datosParametros.idCita));
        setDeleteInfo(false);
      });
    }
  };
  useEffect(() => {
    // setTimeout(() => {
    getCitaServicios(Number(datosParametros.idCita));
    // }, 1000);
  }, [datosParametros.idCita]);

  const getCitaServicios = async (id: number) => {
    const fechaTemporal = new Date(datosParametros.fecha);
    const formattedDate = format(fechaTemporal, "yyyyMMdd");
    if (Number(datosParametros.idCita) > 1) {
      try {
        const response = await axios.get(
          `http://cbinfo.no-ip.info:9089/Citaservicio?id=${Number(
            datosParametros.idCita
          )}&fecha=${formattedDate}&sucursal=${datosParametros.idSuc}`
        );
        setDatasServicios(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
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
  const handleChangeServicios = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormServicio({ ...formServicio, [name]: value });
  };
  const { dataProductos4 } = useProductosFiltradoExistenciaProducto({
    descripcion: "%",
    insumo: 0,
    inventariable: 0,
    obsoleto: 0,
    servicio: 2,
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
  const columnClientes: GridColDef[] = [
    { field: "descripcion", headerName: "Descripcion", width: 200 },
    { field: "precio", headerName: "Precio", width: 100 },
    { field: "tiempo", headerName: "Tiempo", width: 80 },
    {
      field: "action",
      headerName: "Acciones",
      width: 200,
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
  const [modalProductoSelect, setModalProductoSelect] = useState(false);
  const postServicio = () => {
    if (formServicio.cantidad > 0 && formServicio.idServicio > 0 && formServicio.observaciones) {
      jezaApi
        .post(
          `/CitaServicio?id_Cita=${datosParametros.idCita}&idServicio=${formServicio.idServicio}&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${formServicio.observaciones}&usuario=${datosParametros.idSuc}`
        )
        .then((response) => {
          setSuccessInfo(true);
          getCitaServicios(Number(datosParametros.idCita));
          setFormServicio({
            ...formServicio,
            d_servicio: "",
            cantidad: 0,
            observaciones: "",
            idServicio: 0,
          });
        });
    } else {
      setVoidInfo(true);
    }
  };
  const [modalServicioEdit, setModalServicioEdit] = useState(false);
  const putServicio = () => {
    if (formServicio.cantidad > 0 && formServicio.observaciones) {
      jezaApi
        .put(
          `/CitaServicio?id=${formServicio.id}&id_Cita=${datosParametros.idCita}&idServicio=${formServicio.idServicio}&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${formServicio.observaciones}&usuario=${datosParametros.idRec}`
        )
        .then(() => {
          setSuccessInfo(true);
          setModalServicioEdit(false);
          getCitaServicios(formServicio.id_Cita);
          setFormServicio({
            ...formServicio,
            d_servicio: "",
            cantidad: 0,
            observaciones: "",
            idServicio: 0,
          });
        });
    } else {
      alert("Favor de ingresar numberos");
    }
  };

  interface Props {
    openModal: boolean;
    onClose: () => void;
    textTitle: string;
    contentText: string;
    salir: () => void;
    guardar?: (id: number) => void;
  }
  const [voidInfo, setVoidInfo] = useState(false);
  const [successInfo, setSuccessInfo] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(false);
  const DialogComponent = ({
    openModal,
    onClose,
    textTitle,
    contentText,
    salir,
    guardar,
  }: Props) => {
    return (
      <Dialog open={openModal} onClose={onClose}>
        <DialogTitle>{textTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color={"error"} onClick={salir}>
            Salir
          </Button>
          {guardar ? (
            <Button
              variant="contained"
              color={"success"}
              onClick={() => guardar(id || 0)} // Pass the id parameter to guardar
              autoFocus
            >
              Ok
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    );
  };
  const voidCerrar = () => {
    setVoidInfo(false);
  };
  const successInfoFunction = () => {
    setSuccessInfo(false);
  };
  const deleteInfoFunction = () => {
    setDeleteInfo(false);
  };
  const [id, setid] = useState(0);
  const confirmationDelete = (id: number) => {
    setDeleteInfo(true);
    setid(id);
    // deleteServicio(id);
  };
  return (
    <>
      <DialogComponent
        openModal={successInfo}
        onClose={() => setSuccessInfo(false)}
        textTitle={"Ok"}
        contentText={"Información guardada correctamente"}
        salir={successInfoFunction}
      />
      <DialogComponent
        openModal={voidInfo}
        onClose={() => setVoidInfo(false)}
        textTitle={"Advertencia"}
        contentText={"Error, información vacía, favor de verificar"}
        salir={voidCerrar}
      />
      <DialogComponent
        openModal={deleteInfo}
        onClose={() => setDeleteInfo(false)}
        textTitle={""}
        contentText={"¿Está seguro de eliminar el servicio?"}
        guardar={() => deleteServicio(id)}
        salir={deleteInfoFunction}
      />
      <div style={{ marginRight: 25, marginLeft: 25 }}>
        <div style={{ right: 10, top: 10, position: "absolute" }}>
          <MoreVertIcon onClick={() => setModalCitaEdit(true)}> </MoreVertIcon>
        </div>
        <hr />
        <h3> Servicios... </h3>
        {/* ESCOJER SERVICIO */}
        {datasServicios.length > 0 ? (
          datasServicios.map((servicio: Servicio, index: number) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              <Grid container>
                <Grid item xs={12}>
                  <Card sx={{ width: "100%" }}>
                    <CardContent>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                          <Typography variant="body1">Servicio: {servicio.descripcion}</Typography>
                          <Typography variant="caption">
                            Cantidad: {servicio.cantidad + "   "}
                          </Typography>
                          <Typography variant="caption">
                            {servicio.observaciones ? `Obseración: ${servicio.observaciones} ` : ""}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <DeleteIcon
                            onClick={() => confirmationDelete(servicio.id)}
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
        <hr />
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
          label="Cantidad"
          name="cantidad"
          value={formServicio.cantidad}
          onChange={handleChangeServicios}
          fullWidth
          size="small"
          sx={{ marginBottom: "16px" }}
        />
        <br />
        <br />
        <TextField
          label="Observaciones"
          name="observaciones"
          value={formServicio.observaciones}
          onChange={handleChangeServicios}
          fullWidth
          size="small"
          sx={{ marginBottom: "16px" }}
        />
        <Button
          variant="contained"
          onClick={() => {
            postServicio();
          }}
        >
          Guardar
        </Button>
      </div>

      {/* MODALS COMIENZO */}
      <Modal open={modalEstilista} onClose={() => setModalEstilista(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: "80%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Búsqueda de estilista </h2>
          {datasEstilista.map((cliente) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // Corregir "alignContent" a "alignItems"
                  marginBottom: 8, // Agregar margen inferior entre elementos
                }}
              >
                <p key={cliente.id}>{cliente.nombre + cliente.id}</p>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setDatosParametros({ ...datosParametros, idEstilista: cliente.id });
                    setModalEstilista(false);
                    console.log(dataEvent.idEstilista);
                  }}
                >
                  Seleccionar
                </Button>
              </div>
            </>
          ))}
        </div>
      </Modal>

      <Modal open={modalCitaEdit} onClose={() => setModalCitaEdit(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: "90%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Edición de citas </h2>
          <p>Cambiar estado de cita</p>
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <Select value={dataEvent.idEstatus} name="idEstatus" onChange={handleChangeSelect}>
              <MenuItem value={0}> Escoja un estado </MenuItem>
              <MenuItem value={1}> Cita asignada </MenuItem>
              <MenuItem value={2}> Cita confirmada </MenuItem>
              <MenuItem value={3}> Cancelar cita </MenuItem>
              <MenuItem value={4}> Cita a domicilio </MenuItem>
              <MenuItem value={5}> Cliente en proceso </MenuItem>
              <MenuItem value={6}> Requerida </MenuItem>
              <MenuItem value={7}> Asignada </MenuItem>
              <MenuItem value={8}> Pendiente de revisión </MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <Typography> Cambiar la fecha </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              value={datosParametros.fecha}
              timeSteps={{ minutes: 15 }}
              minTime={minDateTime}
              maxTime={maxDateTime}
              sx={{ width: "100%", ml: 0.3 }}
              timezone={"America/Mexico_City"}
              ampm={false}
              format="dd/MM/yyyy HH:mm" // Formato DDMMAAAA HH:mm (hora en formato 24 horas)
              onChange={(fecha) => setDatosParametros({ ...datosParametros, fecha: fecha })}
            />
          </LocalizationProvider>
          <br />
          <br />
          <Typography> Cambiar cliente </Typography>
          <Select
            sx={{ width: "75%" }}
            name="nombreCliente"
            value={datosParametros.idClienteSeparada}
            disabled
          >
            <MenuItem value={datosParametros.idCliente}> Seleccione un cliente </MenuItem>
            {dataClientes.map((cte) => (
              <MenuItem key={cte.id_cliente} value={cte.id_cliente}>
                {cte.nombre}
              </MenuItem>
            ))}
          </Select>
          <Button
            style={{ width: 66, marginLeft: 10, height: 29 }}
            variant="outlined"
            color="primary"
            onClick={() => setmodalCliente(true)}
          >
            Buscar
          </Button>
          <br />
          <br />
          <Typography> Cambiar estilista </Typography>
          <Select
            sx={{ width: "75%" }}
            name="idEstilista"
            value={datosParametros.idEstilista}
            disabled
          >
            <MenuItem value={datosParametros.idEstilista}> Seleccione un estilista </MenuItem>
            {datasEstilista.map((cte) => (
              <MenuItem key={cte.id} value={cte.id}>
                {cte.nombre}
              </MenuItem>
            ))}
          </Select>
          <Button
            style={{ width: 66, marginLeft: 10, height: 29 }}
            variant="outlined"
            color="primary"
            onClick={() => setModalEstilista(true)}
          >
            Buscar
          </Button>
          <br />
          <div style={{ position: "fixed", top: 25, right: 25 }}>
            <CloseIcon onClick={() => setModalCitaEdit(false)}></CloseIcon>
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button variant={"contained"} onClick={() => putCitaEstado()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={modalCliente} onClose={() => setmodalCliente(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: "80%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Búsqueda de clientes </h2>
          <DataGrid
            rows={dataClientes}
            columns={columnClientes}
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
          {dataClientes.map((cliente) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center", // Corregir "alignContent" a "alignItems"
                  marginBottom: 8, // Agregar margen inferior entre elementos
                }}
              >
                <p key={cliente.id_cliente}>{cliente.nombre}</p>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setmodalCliente(false);
                    setDatosParametros({
                      ...datosParametros,
                      idClienteSeparada: cliente.id_cliente,
                    });
                  }}
                >
                  Seleccionar
                </Button>
              </div>
            </>
          ))}
        </div>
      </Modal>
      <Modal
        open={modalServicioEdit}
        onClose={() => {
          setModalServicioEdit(false);
          setFormServicio({
            cantidad: 0,
            id_Cita: 0,
            idServicio: 0,
            observaciones: "",
            precio: 0,
            usuario: 1,
            d_servicio: "",
            id: 0,
          });
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: "60%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Edición de servicio... </h2>
          <FormControl sx={{ m: 1, width: "95%" }} variant="outlined">
            <Typography> Servicio </Typography>
            <TextField
              size="small"
              value={formServicio.d_servicio}
              disabled
              sx={{
                backgroundColor: "lightgray",
              }}
            ></TextField>
            <br />
            <Typography> Cantidad </Typography>
            <TextField
              size="small"
              defaultValue={formServicio.cantidad}
              name="cantidad"
              onChange={handleChangeServicios}
            ></TextField>
            <br />
            <Typography> Observaciones </Typography>
            <TextField
              size="small"
              defaultValue={formServicio.observaciones}
              multiline
              maxRows={4}
              name="observaciones"
              onChange={handleChangeServicios}
            ></TextField>
          </FormControl>
          <br />
          {/* <Button onClick={() => edit()}> Guardar </Button> */}
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <Button
              variant={"contained"}
              color="error"
              onClick={() => {
                setFormServicio({
                  cantidad: 0,
                  id_Cita: 0,
                  idServicio: 0,
                  observaciones: "",
                  precio: 0,
                  usuario: 1,
                  d_servicio: "",
                  id: 0,
                });
                setModalServicioEdit(false);
              }}
            >
              Salir
            </Button>
            <Button variant={"contained"} onClick={() => putServicio()}>
              Guardar
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
            width: "85%",
            height: "70%",
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
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          ></DataGrid>
          <br />
          <br />
          <br />

          {/* <Button onClick={() => edit()}> Guardar </Button> */}
          <div style={{ position: "absolute", top: 25, right: 25 }}>
            <CloseIcon
              onClick={() => {
                setModalProductoSelect(false);
              }}
            ></CloseIcon>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CitaScreen;
