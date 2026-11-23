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
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, startOfToday, setHours } from "date-fns";
import { useEffect, useState } from "react";
import { useClientesWithUseEffect } from "../hooks/useClientesWithUseEffect";
import { Eventos } from "../models/Events";
import axios from "axios";
import { Servicio, ServicioPost } from "../models/Servicio";
import { FormaPago } from "../models/FormaPago";
import { AnticipoGet } from "../models/Anticipo";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { jezaApi } from "../api/jezaApi";
import { useProductosFiltradoExistenciaProducto } from "../hooks/useProductosFiltradoExistenciaProducto";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import { useNominaTrabajadores } from "../hooks/useTrabajadores";
import { ligaAgenda } from "../consts/ligaAgenda";
function CreateCitaScreen() {
  const { dataClientes, fetchClientes } = useClientesWithUseEffect();
  const { dataTrabajadores } = useNominaTrabajadores();
  const [modalCliente, setmodalCliente] = useState(false);
  const [busquedaCliente, setBusquedaCliente] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [modalTrabajador, setmodalTrabajador] = useState(false);
  const [modalAnticipo, setModalAnticipo] = useState(false);
  const [dataPago, setDataPago] = useState<FormaPago[]>([]);
  const [formasPagosFiltradas, setFormasPagosFiltradas] = useState<FormaPago[]>([]);
  const [disabledReferencia, setDisabledReferencia] = useState(false);
  const [formPago, setFormPago] = useState<FormaPago>({
    id: 0,
    descripcion: "",
    grupo_operacion: 0,
    sucursal: 0,
    nombreSuc: "",
    tarjeta: false,
    tipo: 0,
  });
  const [formAnticipo, setFormAnticipo] = useState<AnticipoGet>({
    id: 0,
    caja: 0,
    cia: 0,
    fecha: "",
    fechaMovto: "",
    idCliente: 0,
    idUsuario: 0,
    importe: 0,
    no_venta: 0,
    nombreCia: "",
    nombreSuc: "",
    nombreUsr: "",
    observaciones: "",
    referencia: "",
    sucursal: 0,
    tipoMovto: 0,
    d_cliente: "",
    idformaPago: 0,
  });

  const [datasServicios, setDatasServicios] = useState<[]>([]);

  const minDateTime = setHours(startOfToday(), 8);
  const [modalServiciosAgregar, setModalServiciosAgregar] = useState(false);
  const [modalProductoSelect, setModalProductoSelect] = useState(false);
  const [busquedaServicio, setBusquedaServicio] = useState("");
  const [filtroServicio, setFiltroServicio] = useState("");

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
  }, [fecha, idRec, idSuc, idUser]);

  // const postCita = async () => {
  //   const fechaTemporal = new Date(datosParametros.fecha);
  //   const formattedDate = format(fechaTemporal, "yyyy-MM-dd HH:mm");
  //   if (!dataEvent.idCliente) {
  //     setVoidInfo(true);
  //   } else {
  //     const response = await axios
  //       .post(
  //         `https://api.cbinformatica.net:9089/Cita?cia=26&sucursal=${datosParametros.idSuc}&fechaCita=${formattedDate}&idCliente=${dataEvent.idCliente}&tiempo=0&idEstilista=${datosParametros.idUser}&idUsuario=${datosParametros.idRec}&estatus=1`
  //       )
  //       .then((response) => {
  //         setFormServicio({ ...formServicio, id_Cita: Number(response.data[0].mensaje2) });
  //         setTimeout(() => {
  //           setModalServiciosAgregar(true);
  //         }, 1111);
  //       });
  //     return response;
  //   }
  // };

  const postCita = async () => {
    const fechaTemporal = new Date(datosParametros.fecha);
    const formattedDate = format(fechaTemporal, "yyyy-MM-dd HH:mm");

    if (!dataEvent.idCliente) {
      setVoidInfo(true);
    } else {
      try {
        if (formServicio.tiempo > 0) {
          const response = await axios.post(
            `https://api.cbinformatica.net:9089/Cita?cia=26&sucursal=${
              datosParametros.idSuc
            }&fechaCita=${formattedDate}&idCliente=${dataEvent.idCliente}&tiempo=0&idEstilista=${
              datosParametros.idUser ? datosParametros.idUser : dataEvent.idUsuario
            }&idUsuario=${datosParametros.idRec}&estatus=${tieneServicioProductoLibre ? 1005 : 1}`
          );

          setFormServicio({
            ...formServicio,
            id_Cita: Number(response.data[0].mensaje2),
            cantidad: 1,
          });

          setDatosParametros({
            ...datosParametros,
            fecha: new Date(
              datosParametros.fecha.setMinutes(
                datosParametros.fecha.getMinutes() + formServicio.tiempo * formServicio.cantidad
              )
            ),
          });
          return response.data;
        } else {
          setFormServicio({ ...formServicio, cantidad: 1 });
          setTimeout(() => {
            setModalServiciosAgregar(true);
          }, 1111);
        }
      } catch (error) {
        // Manejo de errores aquí
        console.error("Error en postCita:", error);
        throw error; // Lanza el error nuevamente para manejarlo en el llamador si es necesario.
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
    tiempo: 0,
  });
  const [formEditServicio, setFormEditServicio] = useState<ServicioPost>({
    id_Cita: 0,
    idServicio: 0,
    cantidad: 0,
    precio: 0,
    observaciones: "",
    usuario: 0,
    d_servicio: "",
    id: 0,
    tiempo: 0,
  });
  const limpiarFormServicios = () => {
    setFormServicio({
      cantidad: 1,
      id_Cita: 0,
      idServicio: 0,
      observaciones: "",
      precio: 0,
      usuario: 0,
      d_servicio: "",
      id: 0,
    });
  };
  const deleteServicio = (id: number) => {
    if (datasServicios.length <= 1) {
      alert("Las citas no se pueden quedar vacías, favor de verificar");
    } else {
      jezaApi.delete(`/CitaServicio?idServicio=${id}`).then(() => {
        getCitaServicios(formServicio.id_Cita);
        setDeleteInfo(false);
      });
    }
  };
  const getCitaServicios = async (id: number) => {
    const temporal = new Date(datosParametros.fecha);
    const fechaFormateada = format(temporal, "yyyyMMdd");
    try {
      const response = await axios.get(
        `https://api.cbinformatica.net:9089//CitaServicio?idcliente=${dataEvent.idCliente}&fecha=${fechaFormateada}&sucursal=${datosParametros.idSuc}`
      );
      setDatasServicios(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [modalServicioEdit, setModalServicioEdit] = useState(false);
  const [modalProductoSelectEdit, setModalProductoSelectEdit] = useState(false);

  const { dataProductos4 } = useProductosFiltradoExistenciaProducto({
    descripcion: "%",
    insumo: 0,
    inventariable: 0,
    obsoleto: 0,
    servicio: 1,
    sucursal: Number(idSuc),
  });
  const esProductoLibre = (valor: unknown) =>
    valor === true ||
    valor === 1 ||
    (typeof valor === "string" && ["1", "true"].includes(valor.trim().toLowerCase()));
  const tieneServicioProductoLibreGuardado = datasServicios.some(
    (servicio: Servicio) =>
      esProductoLibre(servicio.productoLibre) ||
      dataProductos4.some(
        (producto) => producto.id === servicio.idServicio && esProductoLibre(producto.productoLibre)
      )
  );
  const tieneServicioProductoLibre =
    esProductoLibre(formServicio.productoLibre) || tieneServicioProductoLibreGuardado;
  const columnsProductos4Edit: GridColDef[] = [
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
            setFormEditServicio({
              ...formEditServicio,
              idServicio: params.row.id,
              precio: params.row.precio,
              d_servicio: params.row.descripcion,
              tiempo: params.row.tiempo,
            });
            setModalProductoSelectEdit(false);
          }}
        >
          Agregar
        </Button>
      ),
    },
  ];

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
              tiempo: params.row.tiempo,
              productoLibre: esProductoLibre(params.row.productoLibre),
            });
            setModalProductoSelect(false);
          }}
        >
          Agregar
        </Button>
      ),
    },
  ];

  const [textSuccessInfo, setTextSuccessInfo] = useState("Registro guardado correctamente");
  const postServicio = async () => {
    try {
      const response = await postCita();
      const temp = response[0].mensaje2;
      if (formServicio.cantidad !== 0 && formServicio.idServicio > 0) {
        await jezaApi
          .post(
            `/CitaServicio?id_Cita=${temp ? temp : formServicio.id_Cita}&idServicio=${
              formServicio.idServicio
            }&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${
              formServicio.observaciones ? formServicio.observaciones : "."
            }&usuario=${datosParametros.idUser ? datosParametros.idUser : idRec}`
          )
          .then(() => {
            setTextSuccessInfo("Se agendó la cita correctamente...");
            setTimeout(() => {
              setSuccessInfo(true);
            }, 1000);
            getCitaServicios(formServicio.id_Cita);
            setFormServicio({
              ...formServicio,
              d_servicio: "",
              cantidad: 1,
              observaciones: "",
              idServicio: 0,
              id_Cita: 0,
            });
          });
      } else {
        setVoidInfo(true);
      }
    } catch (error) {
      console.error("Error:", error);
      // Manejar el error según tus necesidades.
    }
  };

  const putServicio = () => {
    if (formEditServicio.cantidad > 0) {
      jezaApi
        .put(
          `/CitaServicio?id=${formEditServicio.id}&id_Cita=${formEditServicio.id_Cita}&idServicio=${
            formEditServicio.idServicio
          }&cantidad=${formEditServicio.cantidad}&precio=${formEditServicio.precio}&observaciones=${
            formEditServicio.observaciones ? formEditServicio.observaciones : "."
          }&usuario=${datosParametros.idUser}`
        )
        .then(() => {
          setSuccessInfo(true);
          getCitaServicios(formServicio.id_Cita);
          setModalServicioEdit(false);
        });
    } else {
      alert("Favor de ingresar numeros");
    }
  };

  const getFormaPago = () => {
    jezaApi.get("/FormaPago?id=%").then((response) => {
      setDataPago(response.data);
    });
  };
  useEffect(() => {
    getFormaPago();
  }, []);

  useEffect(() => {
    const filtradas = dataPago.filter((formaPago) => formaPago.sucursal === datosParametros.idSuc);
    setFormasPagosFiltradas(filtradas);
  }, [dataPago, datosParametros.idSuc]);

  const limpiarFormAnticipo = () => {
    setFormAnticipo({
      ...formAnticipo,
      fechaMovto: "",
      referencia: "",
      importe: 0,
      observaciones: "",
    });
    setFormPago({
      id: 0,
      descripcion: "",
      grupo_operacion: 0,
      sucursal: 0,
      nombreSuc: "",
      tarjeta: false,
      tipo: 0,
    });
    setDisabledReferencia(false);
  };

  const abrirModalAnticipo = async () => {
    if (!dataEvent.idCliente) {
      setVoidInfo(true);
      return;
    }
    if (!tieneServicioProductoLibreGuardado) return;

    const formattedDate = format(new Date(datosParametros.fecha), "yyyy-MM-dd HH:mm");
    try {
      const response = await axios.post(
        `https://api.cbinformatica.net:9089/Cita?cia=26&sucursal=${
          datosParametros.idSuc
        }&fechaCita=${formattedDate}&idCliente=${dataEvent.idCliente}&tiempo=0&idEstilista=${
          datosParametros.idUser ? datosParametros.idUser : dataEvent.idUsuario
        }&idUsuario=${datosParametros.idRec}&estatus=${tieneServicioProductoLibre ? 1005 : 1}`
      );
      limpiarFormAnticipo();
      setFormAnticipo((prevState) => ({
        ...prevState,
        fechaMovto: format(new Date(), "yyyy-MM-dd"),
        observaciones: String(response.data[0].mensaje2),
      }));
      setModalAnticipo(true);
    } catch (error) {
      console.error("Error al crear la cita para el anticipo:", error);
    }
  };

  const handleChangeFormaPagoAnticipo = (value: string | number) => {
    const selectedFormaPago = dataPago.find((formapago) => formapago.id === Number(value));
    if (selectedFormaPago) {
      setFormPago(selectedFormaPago);
      if (selectedFormaPago.tipo === 1) {
        setDisabledReferencia(true);
        setFormAnticipo((prevState) => ({ ...prevState, referencia: "" }));
      } else {
        setDisabledReferencia(false);
      }
    } else {
      setFormPago({
        id: 0,
        descripcion: "",
        grupo_operacion: 0,
        sucursal: 0,
        nombreSuc: "",
        tarjeta: false,
        tipo: 0,
      });
      setDisabledReferencia(false);
    }
  };

  const insertarAnticipo = async () => {
    if (
      !formAnticipo.fechaMovto ||
      !formAnticipo.importe ||
      Number(formAnticipo.importe) <= 0 ||
      !formPago.id ||
      !dataEvent.idCliente ||
      !formAnticipo.observaciones
    ) {
      setVoidInfo(true);
      return;
    }
    try {
      await jezaApi.post("/Anticipo", null, {
        params: {
          cia: 26,
          sucursal: datosParametros.idSuc,
          caja: 1,
          fecha: formAnticipo.fechaMovto.replace(/-/g, ""),
          no_venta: 0,
          fechaMovto: format(new Date(), "yyyyMMdd"),
          idCliente: dataEvent.idCliente,
          idUsuario: datosParametros.idRec,
          tipoMovto: 2,
          referencia: "AGENDA",
          id_formaPago: formPago.id,
          importe: Number(formAnticipo.importe) * -1,
          observaciones: formAnticipo.observaciones,
        },
      });
      setTextSuccessInfo("Anticipo creado con éxito");
      setModalAnticipo(false);
      limpiarFormAnticipo();
      setTimeout(() => {
        setSuccessInfo(true);
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  const dataClientesWithIds = dataClientes.map((cliente, index) => ({
    ...cliente,
    id: index + 1, // O utiliza algún valor único de tu elección
  }));
  const normalizarTexto = (valor: string | number | undefined) =>
    String(valor ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const terminoBusquedaCliente = normalizarTexto(filtroCliente.trim());
  const clientesFiltrados = dataClientesWithIds.filter((cliente) =>
    [cliente.nombre, cliente.telefono, cliente.id_cliente].some((valor) =>
      normalizarTexto(valor).includes(terminoBusquedaCliente)
    )
  );
  const terminoBusquedaServicio = normalizarTexto(filtroServicio.trim());
  const serviciosFiltrados = dataProductos4.filter((producto) =>
    [producto.descripcion, producto.descripcion_corta, producto.clave_prod, producto.id].some(
      (valor) => normalizarTexto(valor).includes(terminoBusquedaServicio)
    )
  );
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

  const handleOpenNewWindow = () => {
    const url = `${ligaAgenda}Cliente?sucursal=${datosParametros.idSuc}&idSuc=${datosParametros.idSuc}&idRec=${idRec}`; // Reemplaza esto con la URL que desees abrir
    const width = 500;
    const height = 1500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };

  return (
    <>
      <DialogComponent
        openModal={successInfo}
        onClose={() => setSuccessInfo(false)}
        textTitle={"Ok"}
        contentText={textSuccessInfo}
        salir={successInfoFunction}
      />
      <DialogComponent
        openModal={voidInfo}
        onClose={() => setVoidInfo(false)}
        textTitle={"Advertencia"}
        contentText={"Hacen falta datos, favor de revisarlos"}
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

        {idUser === "null" ? (
          <>
            <p>Estilista</p>
            <Select name="nombreCliente" value={dataEvent.idUsuario} disabled>
              <MenuItem value={0}> Seleccione un cliente </MenuItem>
              {dataTrabajadores.map((cte) => (
                <MenuItem key={cte.id} value={cte.id}>
                  {cte.nombre}
                </MenuItem>
              ))}
            </Select>
            <ButtonGroup style={{ marginTop: 15, direction: "rtl" }}>
              <Button variant="contained" color="primary" onClick={() => setmodalTrabajador(true)}>
                Buscar
              </Button>
            </ButtonGroup>
          </>
        ) : null}
      </FormGroup>
      <br />
      <br />
      <br />
      <ButtonGroup style={{ marginRight: 20, marginLeft: 20, direction: "rtl" }}>
        <Button color="success" variant="contained" onClick={() => postCita()}>
          Ingresar servicios
        </Button>
        {tieneServicioProductoLibreGuardado && (
          <Button color="info" variant="contained" onClick={() => abrirModalAnticipo()}>
            Registrar anticipo
          </Button>
        )}
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
            width: "90%",
            maxHeight: "90%", // Cambiar height a maxHeight
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <h2>Búsqueda de clientes</h2>
            </Grid>
            <Grid item>
              <Button onClick={handleOpenNewWindow} color="secondary" variant="contained">
                Agregar cliente
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => fetchClientes()} color="success" variant="contained">
                Actualizar
              </Button>
            </Grid>
          </Grid>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <TextField
              label="Buscar por nombre, teléfono o número"
              size="small"
              value={busquedaCliente}
              onChange={(event) => setBusquedaCliente(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setFiltroCliente(busquedaCliente.trim());
              }}
              style={{ flex: 1, minWidth: 240 }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setFiltroCliente(busquedaCliente.trim())}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setBusquedaCliente("");
                setFiltroCliente("");
              }}
            >
              Limpiar
            </Button>
          </div>
          <DataGrid
            rows={clientesFiltrados}
            columns={[
              {
                field: "nombre",
                headerName: "Nombre",
                width: 200,
              },
              {
                field: "telefono",
                headerName: "telefono",
                width: 200,
                renderCell(params) {
                  return params.row.telefono ? params.row.telefono : "Sin numero";
                },
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
                  pageSize: 6,
                },
              },
            }}
            pageSizeOptions={[8]}
            disableRowSelectionOnClick
          />
        </div>
      </Modal>

      <Modal open={modalTrabajador} onClose={() => setmodalCliente(false)}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxHeight: "90%", // Cambiar height a maxHeight
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Búsqueda de trabajadores </h2>
          <DataGrid
            rows={dataTrabajadores}
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
                      setmodalTrabajador(false);
                      setDataEvent({
                        ...dataEvent,
                        idUsuario: params.row.id,
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
                  pageSize: 6,
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
            height: "100%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <div style={{ display: "flex", justifyContent: "end" }}>
            <CloseIcon
              onClick={() => {
                setModalServiciosAgregar(false);
                limpiarFormServicios();
              }}
            ></CloseIcon>
          </div>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <h3>Agregar servicios</h3>
            <AddCircleIcon
              fontSize="large"
              color="success"
              onClick={() => {
                setModalProductoSelect(true);
              }}
            />
          </div>
          {/* <h3> Servicio:</h3> */}
          <TextField
            variant="filled"
            label={"Agrega el servicio"}
            fullWidth
            disabled
            size="small"
            value={formServicio.d_servicio}
            sx={{ marginBottom: "16px", justifyContent: "flex-start" }}
          ></TextField>
          <br />
          <br />
          {/* <p> Servicio: {formServicio.d_servicio}</p> */}
          <TextField
            label={"Cantidad"}
            type="number"
            name="cantidad"
            defaultValue={formServicio.cantidad}
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
            fullWidth
            size="small"
            sx={{ marginBottom: "16px" }}
          ></TextField>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              postServicio();
            }}
          >
            Guardar
            <SaveTwoToneIcon style={{ marginLeft: 10 }}></SaveTwoToneIcon>
          </Button>
          <br />
          <br />
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
                              onClick={() => confirmationDelete(Number(servicio.id))}
                              style={{ marginLeft: "auto", fontSize: 25 }}
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
          <br />
          <br />
          <br />
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
            width: "95%",
            maxHeight: "90%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Selección de servicio </h2>
          <div style={{ position: "fixed", top: 25, right: 25 }}>
            <CloseIcon
              onClick={() => {
                setModalProductoSelect(false);
              }}
            ></CloseIcon>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <TextField
              label="Buscar servicio por nombre, clave o número"
              size="small"
              value={busquedaServicio}
              onChange={(event) => setBusquedaServicio(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setFiltroServicio(busquedaServicio.trim());
              }}
              style={{ flex: 1, minWidth: 240 }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setFiltroServicio(busquedaServicio.trim())}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setBusquedaServicio("");
                setFiltroServicio("");
              }}
            >
              Limpiar
            </Button>
          </div>
          <DataGrid
            rows={serviciosFiltrados}
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
        </div>
      </Modal>

      <Modal
        open={modalServicioEdit}
        onClose={() => {
          setModalServicioEdit(false);
          setFormServicio({
            cantidad: 1,
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
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <Typography> Servicio </Typography>
                <TextField
                  size="small"
                  value={formEditServicio.d_servicio}
                  disabled
                  sx={{
                    backgroundColor: "lightgray",
                  }}
                ></TextField>
              </Grid>
              <Grid item xs={2}>
                <Button onClick={() => setModalProductoSelectEdit(true)}>Modificar servicio</Button>
              </Grid>
            </Grid>
            <br />
            <Typography> Cantidad </Typography>
            <TextField
              size="small"
              type="number"
              defaultValue={formEditServicio.cantidad}
              name="cantidad"
              onChange={(value) =>
                setFormEditServicio({ ...formEditServicio, cantidad: Number(value.target.value) })
              }
            ></TextField>
            <br />
            <Typography> Observaciones </Typography>
            <TextField
              size="small"
              defaultValue={formEditServicio.observaciones}
              multiline
              maxRows={4}
              name="observaciones"
              onChange={(value) =>
                setFormEditServicio({ ...formEditServicio, observaciones: value.target.value })
              }
            ></TextField>
          </FormControl>
          <br />
          {/* <Button onClick={() => edit()}> Guardar </Button> */}
          <div style={{ position: "absolute", top: 10, right: 10 }}>
            <CloseIcon
              onClick={() => {
                setFormServicio({
                  ...formServicio,
                  cantidad: 1,
                  idServicio: 0,
                  observaciones: "",
                  precio: 0,
                  usuario: 1,
                  d_servicio: "",
                  id: 0,
                });
                setModalServicioEdit(false);
              }}
            ></CloseIcon>
          </div>
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <Button variant={"contained"} onClick={() => putServicio()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={modalProductoSelectEdit}
        onClose={() => {
          setModalProductoSelectEdit(false);
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
          <div style={{ position: "fixed", top: 25, right: 25 }}>
            <CloseIcon
              onClick={() => {
                setModalProductoSelectEdit(false);
              }}
            ></CloseIcon>
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <TextField
              label="Buscar servicio por nombre, clave o número"
              size="small"
              value={busquedaServicio}
              onChange={(event) => setBusquedaServicio(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setFiltroServicio(busquedaServicio.trim());
              }}
              style={{ flex: 1, minWidth: 240 }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={() => setFiltroServicio(busquedaServicio.trim())}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setBusquedaServicio("");
                setFiltroServicio("");
              }}
            >
              Limpiar
            </Button>
          </div>
          <DataGrid
            rows={serviciosFiltrados}
            columns={columnsProductos4Edit}
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
        </div>
      </Modal>

      <Modal
        open={modalAnticipo}
        onClose={() => {
          setModalAnticipo(false);
          limpiarFormAnticipo();
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            maxHeight: "90%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <div style={{ display: "flex", justifyContent: "end" }}>
            <CloseIcon
              onClick={() => {
                setModalAnticipo(false);
                limpiarFormAnticipo();
              }}
            ></CloseIcon>
          </div>
          <h3>Crear anticipo</h3>
          <p>Fecha del anticipo</p>
          <TextField
            type="date"
            size="small"
            fullWidth
            value={formAnticipo.fechaMovto}
            onChange={(valor) => {
              setFormAnticipo({ ...formAnticipo, fechaMovto: valor.target.value });
            }}
            sx={{ marginBottom: "16px" }}
          ></TextField>
          <p>Cliente</p>
          <TextField
            size="small"
            fullWidth
            disabled
            value={dataClientes.find((cte) => cte.id_cliente === dataEvent.idCliente)?.nombre ?? ""}
            sx={{ marginBottom: "16px" }}
          ></TextField>
          <p>Forma de pago</p>
          <Select
            fullWidth
            size="small"
            value={formPago.id}
            onChange={(valor) => handleChangeFormaPagoAnticipo(valor.target.value)}
            sx={{ marginBottom: "16px" }}
          >
            <MenuItem value={0}>Selecciona forma de pago</MenuItem>
            {formasPagosFiltradas.map((formapago: FormaPago) => (
              <MenuItem key={formapago.id} value={formapago.id}>
                {formapago.descripcion}
              </MenuItem>
            ))}
          </Select>
          {!disabledReferencia ? (
            <>
              <p>Referencia</p>
              <TextField
                size="small"
                fullWidth
                value={formAnticipo.referencia}
                onChange={(valor) => {
                  setFormAnticipo({ ...formAnticipo, referencia: valor.target.value });
                }}
                sx={{ marginBottom: "16px" }}
              ></TextField>
            </>
          ) : null}
          <p>Importe</p>
          <TextField
            type="number"
            size="small"
            fullWidth
            value={formAnticipo.importe}
            onChange={(valor) => {
              setFormAnticipo({ ...formAnticipo, importe: Number(valor.target.value) });
            }}
            sx={{ marginBottom: "16px" }}
          ></TextField>
          <p>Observaciones</p>
          <TextField
            size="small"
            fullWidth
            disabled
            value={formAnticipo.observaciones}
            sx={{ marginBottom: "16px", backgroundColor: "lightgray" }}
          ></TextField>
          <ButtonGroup style={{ direction: "rtl", marginTop: 8 }}>
            <Button variant="contained" color="success" onClick={() => insertarAnticipo()}>
              Guardar anticipo
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setModalAnticipo(false);
                limpiarFormAnticipo();
              }}
            >
              Cancelar
            </Button>
          </ButtonGroup>
        </div>
      </Modal>
    </>
  );
}

export default CreateCitaScreen;
