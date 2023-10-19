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
  IconButton,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import React, { useEffect, useState } from "react";
import { format, startOfToday, setHours } from "date-fns";
import axios from "axios";
import { Eventos } from "../models/Events";
import ListTwoToneIcon from "@mui/icons-material/ListTwoTone";
import HistoryTwoToneIcon from "@mui/icons-material/HistoryTwoTone";
import { ServicioPost, Servicio } from "../models/Servicio";
import { EstilistaResponse } from "../models/Estilista";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { jezaApi } from "../api/jezaApi";
import { useProductosFiltradoExistenciaProducto } from "../hooks/useProductosFiltradoExistenciaProducto";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { Cliente } from "../models/Cliente";
import { useEstatusCitas } from "../hooks/useEstatusCitas";
import { useHistorialClientes } from "../hooks/useHistorialClientes";
import ManageSearchTwoToneIcon from "@mui/icons-material/ManageSearchTwoTone";
import { useClientesWithUseEffect } from "../hooks/useClientesWithUseEffect";
import TableHistorial from "../components/SchedulerModificado/TableHistorial";
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
    flag: 0,
    estatus: 0,
    idCitaServicio: 0,
    descripcionServicio: "",
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
    const estatus = cadenaClienteTiempo[3];
    const idCitaServicio = cadenaClienteTiempo[4];
    const descripcionServicio = cadenaClienteTiempo[5];
    const idRec = new URLSearchParams(window.location.search).get("idRec");
    const flag = new URLSearchParams(window.location.search).get("flag");

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
      flag: Number(flag),
      estatus: Number(estatus),
      idCitaServicio: Number(idCitaServicio),
      descripcionServicio: descripcionServicio,
    });
    setDataEvent({ ...dataEvent, idEstatus: Number(estatus) });
  }, []);
  const clavesEmpleados = ["4", "5", "9", "10"];
  const { estatusCitas } = useEstatusCitas();

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
    idEstatus: 0,
  });
  const { dataClientes } = useClientesWithUseEffect();

  const [modalCitaEdit, setModalCitaEdit] = useState(false);
  const [datasEstilista, setDatasEstilista] = useState<EstilistaResponse[]>([]);
  const [modalEstilista, setModalEstilista] = useState(false);

  const [flagCita, setFlagCita] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente>({
    ciudad: "",
    claveRegistroMovil: "",
    colonia: "",
    correo_factura: "",
    cp: "",
    domicilio: "",
    email: "",
    estado: "",
    fecha_act: "",
    fecha_alta: "",
    fecha_asig_plast: "",
    fecha_nac: "",
    id_cliente: 0,
    nombre: "",
    nombre_fiscal: "",
    num_plastico: "",
    plastico_activo: false,
    regimenFiscal: "",
    rfc: "",
    suc_asig_plast: 0,
    sucursal_origen: 0,
    suspendido: false,
    telefono: "",
    usr_asig_plast: "",
    redsocial1: "",
    redsocial2: "",
    redsocial3: "",
  });
  useEffect(() => {
    if (Number(datosParametros.idClienteSeparada) > 0) {
      const clienteFiltrado = dataClientes.find(
        (cliente) => cliente.id_cliente == Number(datosParametros.idClienteSeparada)
      );
      console.log(clienteFiltrado);

      setClienteSeleccionado(clienteFiltrado);
    }
  }, [dataClientes, datosParametros.idClienteSeparada]);

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
        setModalCitaEdit(false);
        setEditEstatusInfo(false);
        setTimeout(() => {
          setSuccessInfo(true);
        }, 1000);
        setFlagCita(false);
      });
  };

  const [datasServicios, setDatasServicios] = useState<any[]>([]);

  const deleteServicio = (id: number) => {
    jezaApi.delete(`/CitaServicio?idServicio=${id}`).then(() => {
      getCitaServicios(Number(datosParametros.idCita));
      setDeleteInfo(false);
    });
    // if (datasServicios.length <= 1) {
    //   alert("No puede quedase una cita sin servicios");
    // } else {
    //   jezaApi.delete(`/CitaServicio?idServicio=${id}`).then(() => {
    //     getCitaServicios(Number(datosParametros.idCita));
    //     setDeleteInfo(false);
    //   });
    // }
  };
  useEffect(() => {
    // setTimeout(() => {
    getCitaServicios(Number(datosParametros.idCita));
    // }, 1000);
  }, [datosParametros.idCita, datosParametros.idCitaServicio]);

  const getCitaServicios = async (id: number) => {
    const fechaTemporal = new Date(datosParametros.fecha);
    const formattedDate = format(fechaTemporal, "yyyyMMdd");
    if (Number(datosParametros.idCita) > 1) {
      try {
        const response = await axios.get(
          `http://cbinfo.no-ip.info:9089/Citaservicio?idcliente=${datosParametros.idClienteSeparada}&fecha=${formattedDate}&sucursal=${datosParametros.idSuc}`
        );
        if (datosParametros.idCitaServicio > 0) {
          const formattedTempCita = [
            response.data.find((item) => item.id === datosParametros.idCitaServicio),
          ];
          setDatasServicios(formattedTempCita);
        } else {
          const formattedTempCitaDesc = [
            response.data.find((item) => item.descripcion == datosParametros.descripcionServicio),
          ];
          setDatasServicios(formattedTempCitaDesc);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const [formServicio, setFormServicio] = useState<ServicioPost>({
    id_Cita: 0,
    idServicio: 0,
    cantidad: 1,
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
            setFormServicio({
              ...formServicio,
              idServicio: params.row.id,
              precio: params.row.precio,
              d_servicio: params.row.descripcion,
            });
            setModalProductoSelectEdit(false);
          }}
        >
          Agregar
        </Button>
      ),
    },
  ];
  const [historialDetalle, setHistorialDetalle] = useState<any[]>([]); // Definir historialDetalle como una variable local, no un estado del componente

  const [paramsDetalles, setParamsDetalles] = useState({
    sucursal: 0,
    numVenta: 0,
    idProducto: 0,
    clave: 0,
    Cve_cliente: 0,
    fecha: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const loadHistorialDetalle = async (
    cveCliente: number,
    noVenta: number,
    idProducto: number,
    idSucursal: number
  ) => {
    await jezaApi
      .get(
        `/HistorialDetalle?suc=${idSucursal}&cliente=${cveCliente}&venta=${noVenta}&serv=${idProducto}`
      )
      .then((response) => {
        // Verifica los datos de respuesta en la consola para asegurarte que sean correctos
        console.log(response.data);
        // Asigna los datos de respuesta a la variable local historialDetalle
        handleOpenModal();
        setHistorialDetalle(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columnHistorialClientes: GridColDef[] = [
    { field: "Estilista", headerName: "Estilista", resizable: true, minWidth: 150 },
    { field: "Servicio", headerName: "Servicio", resizable: true, minWidth: 250 },
    { field: "fechaCita", headerName: "Fecha de cita", resizable: true, minWidth: 100 },
    { field: "hora", headerName: "Hora", resizable: true, minWidth: 50 },
    { field: "nombreSuc", headerName: "Sucursal", resizable: true, minWidth: 100 },
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
  const [modalProductoSelectEdit, setModalProductoSelectEdit] = useState(false);
  const [modalHistorialCliente, setModalHistorialCliente] = useState(false);
  const postServicio = () => {
    if (formServicio.cantidad > 0 && formServicio.idServicio > 0) {
      jezaApi
        .post(
          `/CitaServicio?id_Cita=${datosParametros.idCita}&idServicio=${
            formServicio.idServicio
          }&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${
            formServicio.observaciones ? formServicio.observaciones : "."
          }&usuario=${datosParametros.idSuc}`
        )
        .then((response) => {
          setSuccessInfo(true);
          getCitaServicios(Number(datosParametros.idCita));
          setFormServicio({
            ...formServicio,
            d_servicio: "",
            cantidad: 1,
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
    if (formServicio.cantidad > 0) {
      jezaApi
        .put(
          `/CitaServicio?id=${formServicio.id}&id_Cita=${datosParametros.idCita}&idServicio=${
            formServicio.idServicio
          }&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${
            formServicio.observaciones ? formServicio.observaciones : "."
          }&usuario=${datosParametros.idRec}`
        )
        .then(() => {
          setSuccessInfo(true);
          setModalServicioEdit(false);
          getCitaServicios(formServicio.id_Cita);
          setFormServicio({
            ...formServicio,
            d_servicio: "",
            cantidad: 1,
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
  const [successInfoCita, setSuccessInfoCita] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState(false);
  const [editEstatusInfo, setEditEstatusInfo] = useState(false);
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
  const successInfoFunctionCita = () => {
    setSuccessInfoCita(false);
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

  const { historialClientes } = useHistorialClientes({
    cveCliente: Number(datosParametros.idClienteSeparada),
  });

  const putCita = () => {
    const fechaHora = decodeURIComponent(datosParametros.fecha.toString());
    const fecha = new Date(fechaHora);

    // Obtener los componentes de fecha y hora
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // El mes se indexa desde 0
    const dia = fecha.getDate().toString().padStart(2, "0");
    const horas = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");

    // Formatear la fecha y la hora en el formato deseado
    const fechaHoraFormateada = `${año}/${mes}/${dia} ${horas}:${minutos}`;
    const newFecha = fechaHoraFormateada;
    jezaApi
      .put(
        `/Cita?id=${datosParametros.idCita}&cia=${26}&sucursal=${
          datosParametros.idSuc
        }&fechaCita=${newFecha}&idCliente=${datosParametros.idClienteSeparada}&tiempo=${
          datosParametros.tiempoSeparada
        }&idEstilista=${datosParametros.idEstilista}&idUsuario=${datosParametros.idUser}&estatus=${
          datosParametros.estatus
        }`
      )
      .then(() => {
        setSuccessInfoCita(true);
      });
  };

  const sp_detalleVentasUpdTiempo = () => {
    if (datosParametros.estatus === 4) {
      jezaApi
        .put(
          `/sp_detalleVentasUpdTiempo?id=${datosParametros.idCita}&tiempo=${datosParametros.tiempoSeparada}`
        )
        .then(() => setSuccessInfo(true));
    } else {
      putCita();
    }
  };
  const [stateHandleCitaProceso, setSetstateHandleCitaProceso] = useState(false);
  useEffect(() => {
    if (datosParametros.idCita == 4) {
      setSetstateHandleCitaProceso(true);
    }
  }, []);

  const handleCitaProceso = () => {
    if (stateHandleCitaProceso == false) {
      setDataEvent({ ...dataEvent, idEstatus: 4 });
      // putCitaEstado();
      setTimeout(() => {
        setEditEstatusInfo(true);
      }, 1000);
    }
  };
  const [datah, setData] = useState<any[]>([]); // Definir el estado datah
  const [datah1, setData1] = useState<any[]>([]); // Definir el estado datah

  const historial = (dato: any) => {
    jezaApi.get(`/Historial?cliente=${datosParametros.idClienteSeparada}`).then((response) => {
      setData(response.data);
      // toggleModalHistorial(); // Abrir o cerrar el modal cuando los datos se hayan cargado
    });
    historialCitaFutura(datosParametros.idClienteSeparada);
  };
  useEffect(() => {
    historialCitaFutura(datosParametros.idClienteSeparada);
  }, [datosParametros.idClienteSeparada]);

  const historialCitaFutura = (dato: any) => {
    jezaApi
      .get(`/sp_detalleCitasFuturasSel?Cliente=${datosParametros.idClienteSeparada}`)
      .then((response) => {
        const dataConFechasFormateadas = response.data.map((item: any) => ({
          ...item,
          fechaCita: new Date(item.fechaCita).toLocaleDateString(),
          fechaAlta: new Date(item.fechaAlta).toLocaleDateString(),
        }));
        setData1(dataConFechasFormateadas);
        // toggleModalHistorialFutura(); // Abrir o cerrar el modal cuando los datos se hayan cargado
      });
  };

  return (
    <>
      <div style={{ right: 10, top: 10, position: "absolute" }}>
        {/* <FormControlLabel
          control={<Checkbox value={stateHandleCitaProceso} onClick={() => handleCitaProceso()} />}
          label="Cita en proceso"
        />
        <Select
          value={dataEvent.idEstatus}
          name="idEstatus"
          onChange={handleChangeEstatusCita}
          size="small"
          disabled={datosParametros.flag === 1 ? true : false}
        >
          <MenuItem value={0}> Escoja un estado </MenuItem>
          {estatusCitas.map((status, index) => (
            <MenuItem key={status.id + index} value={status.id}>
              {status.descripcionEstatus}
            </MenuItem>
          ))}
        </Select> */}
        <Button
          style={{ marginLeft: 5 }}
          variant="contained"
          onClick={() => setModalHistorialCliente(true)}
        >
          Historial
          <HistoryTwoToneIcon style={{ marginLeft: 5 }} fontSize="medium"></HistoryTwoToneIcon>
        </Button>
        <Button
          variant="contained"
          style={{ marginLeft: 10 }}
          onClick={() => setModalCitaEdit(true)}
          disabled={datosParametros.flag === 1 ? true : false}
        >
          Edición cita
          <ListTwoToneIcon style={{ marginLeft: 5 }} fontSize="medium"></ListTwoToneIcon>
        </Button>
      </div>
      <DialogComponent
        openModal={successInfo}
        onClose={() => setSuccessInfo(false)}
        textTitle={"Ok"}
        contentText={"Información guardada correctamente"}
        salir={successInfoFunction}
      />
      <DialogComponent
        openModal={successInfoCita}
        onClose={() => setSuccessInfoCita(false)}
        textTitle={"Ok"}
        contentText={"Tiempo cambiado exitosamente"}
        salir={successInfoFunctionCita}
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
      <DialogComponent
        openModal={editEstatusInfo}
        onClose={() => setEditEstatusInfo(false)}
        textTitle={""}
        contentText={"Está seguro de cambiar el estado de la cita?"}
        guardar={() => putCitaEstado()}
        salir={() => setEditEstatusInfo(false)}
      />
      <div style={{ marginRight: 25, marginLeft: 25 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={5} md={5}>
            <br />
            <br />
            {/* SEPARACIÓN  */}
            <h3> Servicio </h3>
            {/* ESCOJER SERVICIO */}
            {datasServicios.length > 0 ? (
              datasServicios.map((servicio: Servicio, index: number) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", marginBottom: 10 }}
                >
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
                              <IconButton
                                onClick={() => confirmationDelete(servicio.id)}
                                disabled={datosParametros.flag === 1 ? true : false}
                              >
                                <DeleteIcon
                                  style={{
                                    marginLeft: "auto",
                                    color: datosParametros.flag === 1 ? "grey" : "black",
                                  }}
                                />
                              </IconButton>
                              <IconButton
                                disabled={datosParametros.flag === 1 ? true : false}
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
                              >
                                <EditIcon
                                  style={{ color: datosParametros.flag === 1 ? "grey" : "black" }}
                                />
                              </IconButton>
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
            <>
              <h3>Cambio de tiempos</h3>
              <TextField
                label="Tiempo"
                name="tiempoSeparada"
                type="number"
                value={datosParametros.tiempoSeparada}
                onChange={(valor) =>
                  setDatosParametros({
                    ...datosParametros,
                    tiempoSeparada: Number(valor.target.value),
                  })
                }
                fullWidth
                size="small"
                sx={{ marginBottom: "16px" }}
              ></TextField>
              <Button
                variant="contained"
                onClick={() => sp_detalleVentasUpdTiempo()}
                disabled={
                  datosParametros.flag === 1 && datosParametros.estatus !== 4 ? true : false
                }
              >
                Guardar
              </Button>
            </>
          </Grid>
        </Grid>
        <hr />
        {datosParametros.flag === 1 ? (
          <h2 style={{ textAlign: "center" }}>
            No puede realizar ediciones a citas en proceso y ya finzalizadas, favor de contactar al
            administrador
          </h2>
        ) : null}
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
          {/* <p>Cambiar estado de cita</p>
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <Select value={dataEvent.idEstatus} name="idEstatus" onChange={handleChangeSelect}>
              <MenuItem value={0}> Escoja un estado </MenuItem>
              {estatusCitas.map((status) => (
                <MenuItem key={status.id} value={status.id}>
                  {status.descripcionEstatus}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
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
          <Typography> Cliente </Typography>
          <Select
            sx={{ width: "100%" }}
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
          {/* <Button
            style={{ width: 66, marginLeft: 10, height: 29 }}
            variant="outlined"
            color="primary"
            onClick={() => setmodalCliente(true)}
          >
            Buscar
          </Button> */}
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
            cantidad: null,
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
                  value={formServicio.d_servicio}
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
                  cantidad: null,
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

      <Modal
        open={modalHistorialCliente}
        onClose={() => {
          setModalHistorialCliente(false);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "70%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <hr />
          <h2>Datos del cliente</h2>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <p>Nombre: {clienteSeleccionado?.nombre}</p>
              <p>
                Telefono:{" "}
                {clienteSeleccionado?.telefono
                  ? clienteSeleccionado?.telefono
                  : "Actualice la información"}
              </p>
              <p>Instagram: Actualice la información</p>
            </Grid>
            <Grid item xs={6}>
              <p>
                Fecha de nacimiento:{" "}
                {clienteSeleccionado?.fecha_nac
                  ? clienteSeleccionado?.fecha_nac
                  : "Actualice la información"}
              </p>
              <p>
                Correo:{" "}
                {clienteSeleccionado?.correo_factura
                  ? clienteSeleccionado?.correo_factura
                  : "Actualice la información"}
              </p>
            </Grid>
          </Grid>
          <hr />
          <h2> Historial de citas </h2>
          <TableHistorial
            datah={datah}
            loadHistorialDetalle={loadHistorialDetalle}
            setIsModalOpen={setIsModalOpen}
            setParamsDetalles={setParamsDetalles}
          ></TableHistorial>
          <DataGrid
            rows={datah1}
            columns={columnHistorialClientes}
            autoHeight
            getRowId={(row) => row.fechaCita}
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
                setModalHistorialCliente(false);
              }}
            ></CloseIcon>
          </div>
        </div>
      </Modal>

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            height: "70%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <div style={{ position: "absolute", top: 25, right: 25 }}>
            <CloseIcon
              onClick={() => {
                setIsModalOpen(false);
              }}
            ></CloseIcon>
          </div>
          <h2>Historial detalle</h2>
          <div style={{ maxHeight: "400px", overflowY: "scroll" }}>
            <hr />
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>
                    <p>
                      <strong>Fecha:</strong> {paramsDetalles.fecha.split("T")[0]}
                    </p>
                  </th>
                  <th>
                    <p>
                      <strong>No. Venta: </strong>
                      {paramsDetalles.numVenta}
                    </p>
                  </th>
                  <th>
                    <p>
                      <strong>Sucursal:</strong> {paramsDetalles.sucursal}
                    </p>
                  </th>
                </tr>
              </thead>
            </table>
            <hr />
            <br />
            <h2>Historial citas futuras</h2>
            <table style={tableStyles}>
              <thead>
                <tr>
                  <th style={thStyles}>Fecha de cita</th>
                  <th style={thStyles}>Hora</th>
                  <th style={thStyles}>Estilista</th>
                  <th style={thStyles}>Usuario registro</th>
                </tr>
              </thead>
              <tbody>
                {datah1.map((item, index) => (
                  <tr key={index}>
                    <td style={tdStyles}>{item.fechaCita}</td>
                    <td style={tdStyles}>{item.hora}</td>
                    <td style={tdStyles}>{item.Estilista}</td>
                    <td style={tdStyles}>{item.nombreUsrRegistra}</td>
                  </tr>
                ))}
              </tbody>
            </table>{" "}
            <div>
              <p style={{ textAlign: "left" }}>
                {/* <strong>Total: ${totalImportes.toFixed(2)}</strong> */}
              </p>
            </div>
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
          <DataGrid
            rows={dataProductos4}
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
    </>
  );
}
const tableStyles: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyles: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
  background: "#f2f2f2",
  fontWeight: "bold",
};

const tdStyles: React.CSSProperties = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "left",
};
export default CitaScreen;
