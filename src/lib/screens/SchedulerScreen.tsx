import { useRef, Fragment, useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Modal,
  SelectChangeEvent,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import axios from "axios";
import { format, startOfToday, setHours, addDays, subDays } from "date-fns";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Scheduler } from "..";
import { jezaApi } from "../api/jezaApi";
import { useClientes } from "../hooks/useClientes";
import { useProductosFiltradoExistenciaProducto } from "../hooks/useProductosFiltradoExistenciaProducto";
import { EstilistaResponse } from "../models/Estilista";
import { Eventos } from "../models/Events";
import { ServicioPost, Servicio } from "../models/Servicio";
import { SchedulerRef, ProcessedEvent, EventActions } from "../types";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { EVENTS } from "../../data";
// Generated by https://quicktype.io

function SchedulerScreen() {
  const calendarRef = useRef<SchedulerRef>(null);
  const [datas, setDatas] = useState<Eventos[]>([]);
  const [datasEstilista, setDatasEstilista] = useState<EstilistaResponse[]>([]);
  const [datasServicios, setDatasServicios] = useState<[]>([]);
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
  const [formattedDatas, setFormattedDatas] = useState<Eventos[]>([]);
  const [mode, setMode] = useState<"default" | "tabs">("default");
  const [refreshKey, setRefreshKey] = useState(0); // Nuevo estado local
  const navigate = useNavigate();

  // MODALS
  const [modalCliente, setmodalCliente] = useState(false);
  const [modalEstilista, setModalEstilista] = useState(false);
  const [modalCitaEdit, setModalCitaEdit] = useState(false);
  const [modalServicioEdit, setModalServicioEdit] = useState(false);
  const [modalServiciosAgregar, setModalServiciosAgregar] = useState(false);
  const [modalProductoSelect, setModalProductoSelect] = useState(false);
  const clavesEmpleados = ["B55", "B71", "B76", "B80", "B82", "B85", "B90"];
  const clavesEmpleadosCB = ["B55", "B82", "B90", "B71", "B85"];

  const { dataClientes } = useClientes();
  const { dataProductos4 } = useProductosFiltradoExistenciaProducto({
    descripcion: "%",
    insumo: 0,
    inventariable: 0,
    obsoleto: 0,
    servicio: 1,
    sucursal: 21,
  });
  const idSuc = new URLSearchParams(window.location.search).get("idSuc");
  const suc = new URLSearchParams(window.location.search).get("suc");
  const idRec = new URLSearchParams(window.location.search).get("idRec");
  useEffect(() => {
    setDataEvent({ ...dataEvent, sucursal: Number(idSuc), d_sucursal: suc, idRec: Number(idRec) });
    if (!idSuc) {
      alert("Favor de ingresar en la página principal");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataEvent((prevState: any) => ({ ...prevState, [name]: value }));
  };
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
    console.log("LIMPIADO");
  };

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };
  const handleChangeServicios = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormServicio({ ...formServicio, [name]: value });
    // const delayedSetFormValues = debounce<typeof setFormServicio>(setFormServicio, 500);

    // delayedSetFormValues((prevValues: ServicioPost) => ({
    //   ...prevValues,
    //   [name]: value,
    // }));
  };

  const handleChangeSelect = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value;
    const selectedName = event.target.name;
    setDataEvent((prevState: any) => ({ ...prevState, [selectedName]: selectedValue }));
  };

  const peticion = async () => {
    const temp = new Date(nuevaFechaPrueba);
    const formattedDate = format(temp, "yyyyMMdd");
    try {
      const response = await axios.get(
        `http://cbinfo.no-ip.info:9089/Cita?id=%&suc=${
          idSuc ? idSuc : 21
        }&estilista=%&f1=${"20230110"}&f2=${formattedDate}&cliente=%&estatus=%`
      );
      setDatas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const peticionEstilista = async () => {
    if (dataEvent.sucursal !== 0) {
      try {
        const response = await axios.get(
          `http://cbinfo.no-ip.info:9089/Estilistas?suc=${dataEvent.sucursal}`
        );
        const reponseTemporal = response.data;
        const formattedData = reponseTemporal.map((evento: EstilistaResponse) => ({
          ...evento,
          admin_id: evento?.id ? evento?.id : 0,
          title: evento?.nombre ? evento?.nombre : "",
          mobile: evento?.descripcion_puesto ? evento?.descripcion_puesto : "",
        }));
        // const elementosFiltrados = formattedData.filter((elemento: EstilistaResponse) =>
        //   clavesEmpleados.includes(elemento.clave_empleado)
        // );
        setDatasEstilista(formattedData);
        // setRefreshKey((key) => key + 1); // Actualiza el estado local para forzar la actualización del componente Scheduler
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getCitaServicios = async (id: number) => {
    try {
      const response = await axios.get(
        `http://cbinfo.no-ip.info:9089/Citaservicio?id=${id}&fecha=20230727&sucursal=21`
      );
      setDatasServicios(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    changeLoadingValue(true);
    const formattedData = datas.map((evento: Eventos) => ({
      ...evento,
      start: evento.fechaCita ? new Date(evento.fechaCita) : new Date(),
      end: evento.horaFin ? new Date(evento.horaFin) : new Date(),
      admin_id: evento.idEstilista ? evento.idEstilista : 3,
      event_id: evento.id ? evento.id : 0,
      title: evento.idCliente.toString() + "," + evento.tiempo,
      description: evento.nombreCliente,
      color:
        evento.estatus === 1
          ? "#46e09b"
          : evento.estatus === 2
          ? "green"
          : evento.estatus === 3
          ? "grey"
          : evento.estatus === 4
          ? "pink"
          : evento.estatus === 5
          ? "lightblue"
          : evento.estatus === 6
          ? "purple"
          : evento.estatus === 7
          ? "lightblue"
          : evento.estatus === 8
          ? "yellow"
          : "lightblue",
    }));
    console.log({ formattedDatas });

    setFormattedDatas(formattedData);
  }, [datas]);
  const changeLoadingValue = (newLoadingValue) => {
    if (calendarRef.current && calendarRef.current.scheduler) {
      calendarRef.current.scheduler.loading = newLoadingValue;
    }
  };

  const handleConfirmEvent = async (
    event: ProcessedEvent,
    action: EventActions
  ): Promise<ProcessedEvent> => {
    // Lógica para manejar la confirmación de eventos
    console.log("Evento confirmado:", event);
    console.log("Acción:", action);
    if (action === "create") {
      const newEvent: Eventos = {
        id: 1,
        event_id: 5,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        admin_id: event.admin_id,
        color: "blue",
      };
      axios
        .post<Eventos>("http://localhost:3000/events", newEvent)
        .then(() => alert("REALIZADA"))
        .catch((e) => console.log({ e }));
    }
    if (action === "edit") {
      const editEvent: Eventos = {
        id: event.event_id,
        event_id: event.event_id,
        title: event.title,
        description: event.description,
        start: event.start,
        end: event.end,
        admin_id: event.admin_id,
        color: "blue",
      };
      axios
        .put<Eventos>(`http://localhost:3000/events/${event.event_id}`, editEvent)
        .then(() => console.log("exitoso"))
        .catch((e) => console.log(e));
    }
    return event;
  };

  const peticiones = async () => {
    peticionEstilista().then(async () => {
      const temp = new Date(nuevaFechaPrueba);
      const formattedDate = format(temp, "yyyyMMdd");
      try {
        const response = axios.get(
          `http://cbinfo.no-ip.info:9089/Cita?id=%&suc=${
            dataEvent.sucursal ? dataEvent.sucursal : 21
          }&estilista=%&f1=${formattedDate}&f2=${formattedDate}&cliente=%&estatus=%`
        );
        const formattedData = (await response).data.map((evento: Eventos) => ({
          ...evento,
          start: evento.fechaCita ? new Date(evento.fechaCita) : new Date(),
          end: evento.horaFin ? new Date(evento.horaFin) : new Date(),
          admin_id: evento.idEstilista ? evento.idEstilista : 3,
          event_id: evento.id ? evento.id : 0,
          title: evento.idCliente.toString() + "," + evento.tiempo + "," + evento.idEstilista,
          description: evento.nombreCliente,
          color:
            evento.estatus === 1
              ? "#46e09b"
              : evento.estatus === 2
              ? "green"
              : evento.estatus === 3
              ? "grey"
              : evento.estatus === 4
              ? "pink"
              : evento.estatus === 5
              ? "lightblue"
              : evento.estatus === 6
              ? "purple"
              : evento.estatus === 7
              ? "lightblue"
              : evento.estatus === 8
              ? "yellow"
              : "lightblue",
        }));
        setTimeout(() => {
          setRefreshKey((key) => key + 1); // Actualiza el estado local para forzar la actualización del componente Scheduler
        }, 1000);
        setFormattedDatas(formattedData);
        changeLoadingValue(false);

        console.log("peticiones");
      } catch (error) {
        console.error(error);
      }
    });
  };
  const postCita = (idUsuario: number) => {
    axios
      .post(
        `http://cbinfo.no-ip.info:9089/Cita?cia=26&sucursal=21&fechaCita=${dataEvent.fechaCita}&idCliente=${dataEvent.idCliente}&tiempo=0&idEstilista=${idUsuario}&idUsuario=96&estatus=1`
      )
      .then((response) => {
        peticiones();
        setModalServiciosAgregar(true);
        setFormServicio({ ...formServicio, id_Cita: response.data[0].mensaje2 });
      });
  };
  const postServicio = () => {
    if (formServicio.cantidad !== 0 || formServicio.idServicio > 0) {
      jezaApi
        .post(
          `/CitaServicio?id_Cita=${formServicio.id_Cita}&idServicio=${
            formServicio.idServicio
          }&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${
            formServicio.observaciones
          }&usuario=${86}`
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            // text: `${response.data[0].mensaje1}`,
            text: `Realizado`,
            confirmButtonColor: "#3085d6",
          });
          getCitaServicios(formServicio.id_Cita);
          setFormServicio({ ...formServicio, d_servicio: "", cantidad: 0, observaciones: "" });
          peticiones();
        });
    } else {
      alert("Datos vacíos, intente de nuevo");
    }
  };

  const putServicio = () => {
    jezaApi
      .put(
        `/CitaServicio?id=${formServicio.id}&id_Cita=${formServicio.id_Cita}&idServicio=${formServicio.idServicio}&cantidad=${formServicio.cantidad}&precio=${formServicio.precio}&observaciones=${formServicio.observaciones}&usuario=21`
      )
      .then(() => {
        alert("Servicio actualizado");
        setModalServicioEdit(false);
        peticiones();
        getCitaServicios(formServicio.id_Cita);
      });
  };

  const deleteServicio = (id: number) => {
    jezaApi.delete(`/CitaServicio?idServicio=${id}`).then(() => {
      alert("Eliminación exitosa");
      getCitaServicios(formServicio.id_Cita);
      peticiones();
    });
  };

  const handleDeleteEvent = async (idEvent: number) => {
    deleteCita(idEvent);
  };

  const deleteCita = (id: number) => {
    axios
      .delete(`http://cbinfo.no-ip.info:9089/Cita?id=${id}`)
      .then((response) => alert("Cita eliminada con éxito"));
  };

  const putCita = (cita: ProcessedEvent) => {
    axios
      .put(
        `http://cbinfo.no-ip.info:9089/Cita?id=${cita.event_id}&cia=26&sucursal=${
          dataEvent.sucursal
        }&fechaCita=${format(cita.start, "yyyy-MM-dd HH:mm")}&idCliente=${cita.idCliente}&tiempo=${
          cita.tiempo
        }&idEstilista=${cita.admin_id}&idUsuario=${cita.idUsuario}&estatus=${cita.estatus}`
      )
      .then((response) => peticiones())
      .catch((e) => alert(e));

    // .then((response) => (calendarRef.current.scheduler.events = formattedDatas));
  };
  const putCitaEstado = () => {
    console.log(dataEvent);
    axios
      .put(
        `http://cbinfo.no-ip.info:9089/Cita?id=${dataEvent.event_id}&cia=26&sucursal=21&fechaCita=${dataEvent.fechaCita}&idCliente=${dataEvent.idCliente}&tiempo=${dataEvent.tiempo}&idEstilista=${dataEvent.admin_id}&idUsuario=${dataEvent.idUsuario}&estatus=${dataEvent.idEstatus}`
      )
      .then((response) => {
        alert("Acción realizada");
        peticiones();
        setModalCitaEdit(false);
      });
  };
  const handleDropEvent = async (
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ) => {
    // Lógica para manejar la confirmación de eventos

    console.log("Evento  updatedEvent", updatedEvent);
    console.log("Evento  droppedOn", droppedOn);
    console.log("Evento  originalEvent", originalEvent);
    changeLoadingValue(true);
    putCita(updatedEvent);
  };

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

  const columnServicios: GridColDef[] = [];

  const minDateTime = setHours(startOfToday(), 8);

  const maxDateTime = setHours(startOfToday(), 20);

  const currentDates = new Date();
  const ligaProductiva = "http://cbinfo.no-ip.info:9085/";
  const ligaLocal = "http://localhost:3000/";

  const handleOpenNewWindow = () => {
    const url = `${ligaLocal}Cliente`; // Reemplaza esto con la URL que desees abrir
    const width = 500;
    const height = 1500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };
  const handleOpenNewWindowCreateCitaScreen = ({ idUsuario, fecha }) => {
    const url = `${ligaLocal}CreateCitaScreen?idUser=${idUsuario}&fecha=${fecha}&idSuc=${dataEvent.sucursal}&idRec=${idRec}`; // Reemplaza esto con la URL que desees abrir
    const width = 1000;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };
  const handleOpenNewWindowCitaScreen = ({ idCita, idUser, idCliente, fecha }) => {
    const url = `${ligaLocal}CitaScreen?idCita=${idCita}&idUser=${idUser}&idCliente=${idCliente}&fecha=${fecha}&idSuc=${dataEvent.sucursal}&idRec=${idRec}`; // Reemplaza esto con la URL que desees abrir
    const width = 1200;
    const height = 1200;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };
  const fechaInicial = new Date();
  const [nuevaFechaPrueba, setNuevaFechaPrueba] = useState<Date>(fechaInicial);
  useEffect(() => {
    peticiones();
  }, [nuevaFechaPrueba]);
  useEffect(() => {
    peticiones();
  }, [dataEvent.sucursal]);
  useEffect(() => {
    peticionEstilista();

    // peticiones() porque no lo uso, no sé
  }, [idSuc, dataEvent.sucursal, !datasEstilista]);
  return (
    <Fragment>
      {/* <SidebarHorizontal></SidebarHorizontal> */}
      <div style={{ textAlign: "center", width: 150 }}>
        <Button
          color={mode === "default" ? "primary" : "inherit"}
          variant={mode === "default" ? "contained" : "text"}
          size="small"
          onClick={() => {
            setMode("default");
            calendarRef.current?.scheduler?.handleState("default", "resourceViewMode");
          }}
        >
          Default
        </Button>
        <Button
          color={mode === "tabs" ? "primary" : "inherit"}
          variant={mode === "tabs" ? "contained" : "text"}
          size="small"
          onClick={() => {
            setMode("tabs");
            calendarRef.current?.scheduler?.handleState("tabs", "resourceViewMode");
          }}
        >
          Tabs
        </Button>
      </div>

      <Grid container justifyContent="flex-end">
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Sucursal"
          value={dataEvent.sucursal}
          onChange={handleChangeSelect}
          name="sucursal"
        >
          <MenuItem value={0}>Seleccione una sucursal</MenuItem>
          <MenuItem value={21}>Barrio</MenuItem>
          <MenuItem value={26}>San Pedro</MenuItem>
          <MenuItem value={27}>CDMX</MenuItem>
        </Select>

        <Button
          onClick={() => {
            handleOpenNewWindow();
          }}
        >
          Agregar Clientes
        </Button>
      </Grid>
      <Button onClick={() => calendarRef.current.scheduler.handleGotoDay(currentDates)}></Button>
      {/* <Button onClick={() => console.log(calendarRef.current.scheduler.loading)}>PRUEBA</Button> */}
      {/* <div>
        <Button onClick={peticion}>Refresh Component</Button>
        <Button onClick={peticiones}>Refresh Component</Button>
      </div> */}

      <Scheduler
        key={refreshKey}
        day={{
          step: 30,
          startHour: 8,
          endHour: 20,
        }}
        ref={calendarRef}
        // loading={calendarRef.current?.scheduler ? calendarRef.current.scheduler.loading : false}
        month={null}
        onEventClick={(evento: any) => {
          setDataEvent(evento);
          setFormServicio({ ...formServicio, id_Cita: Number(evento.id) });
          getCitaServicios(Number(evento.id));
          // console.log({ evento });
        }}
        onSelectedDateChange={(date) => {
          setNuevaFechaPrueba(date);
        }}
        onConfirm={handleConfirmEvent}
        onDelete={handleDeleteEvent}
        customEditor={({ close, state }) => {
          if (Number(idSuc) === Number(dataEvent.sucursal)) {
            if (state.description.value.length > 0) {
              handleOpenNewWindowCitaScreen({
                idCita: state.event_id.value,
                idUser: state.admin_id.value,
                idCliente: state.title.value,
                fecha: state.start.value,
              });
            } else {
              handleOpenNewWindowCreateCitaScreen({
                idUsuario: state.admin_id.value,
                fecha: state.start.value,
              });
            }
          } else {
            close();
            alert("No cuenta con permisos para realizar acciones en otras sucursales");
          }
          // console.log(state);
          return (
            <Button
              onClick={() => {
                close();
                peticiones();
              }}
            >
              Salir
            </Button>
          );
        }}
        deletable={false}
        // EJEMPLO DE COMO ESTILISZAR LAS CARTAS DE LA AGENDA....
        // eventRenderer={(prop) => (
        //   <div draggable={prop.draggable} onClick={() => prop.onClick}>
        //     <h5>{prop.event.event_id}</h5>
        //     <h5>{prop.event.description}</h5>
        //   </div>
        // )}
        view={"day"}
        selectedDate={nuevaFechaPrueba}
        height={2}
        timeZone="America/Mexico_City"
        // editable={false}
        onEventDrop={handleDropEvent}
        events={formattedDatas ? formattedDatas : EVENTS}
        resources={datasEstilista}
        resourceFields={{
          idField: "admin_id",
          textField: "title",
          // Subtext puedo ingresar el tipo de estilista
          subTextField: "mobile",
          avatarField: "title",
          // colorField: "color",
        }}
        fields={[
          {
            name: "admin_id",
            type: "select",
            default:
              datasEstilista.length > 0 && datasEstilista[0].admin_id
                ? datasEstilista[0].admin_id
                : 0,
            options: datasEstilista.map((res) => {
              return {
                id: res.admin_id ? res.admin_id : 0,
                text: `${res.title}  `,
                value: res.admin_id ? res.admin_id : 0, //Should match "name" property
              };
            }),
            config: { label: "Assignee", required: true },
          },
        ]}
      />

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
                    setDataEvent({ ...dataEvent, idCliente: cliente.id_cliente });
                  }}
                >
                  Seleccionar
                </Button>
              </div>
            </>
          ))}
        </div>
      </Modal>
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
                    setDataEvent({ ...dataEvent, idEstilista: cliente.id });
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
            height: "70%",
            backgroundColor: "#fff",
            padding: 16,
            borderRadius: 4,
            overflow: "auto", // Aplicar scroll si el contenido excede el tamaño del contenedor
          }}
        >
          <h2> Edición de citas </h2>
          <p>Cambiar estado de cita</p>
          <FormControl sx={{ width: "100%" }} variant="outlined">
            <Select
              defaultValue={0}
              name="idEstatus"
              value={dataEvent.idEstatus}
              onChange={handleChangeSelect}
            >
              <MenuItem value={0}> Escoja un estado </MenuItem>
              <MenuItem value={2}> Cita confirmada </MenuItem>
              <MenuItem value={3}> Cancelar cita </MenuItem>
              <MenuItem value={4}> Cita a domicilio </MenuItem>
              {/* <MenuItem value={5}> Cliente en proceso </MenuItem> */}
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
              timeSteps={{ minutes: 15 }}
              minTime={minDateTime}
              maxTime={maxDateTime}
              sx={{ width: "100%", ml: 0.3 }}
              timezone={"America/Mexico_City"}
              ampm={false}
              format="dd/MM/yyyy HH:mm" // Formato DDMMAAAA HH:mm (hora en formato 24 horas)
              onChange={(fecha) =>
                setDataEvent({ ...dataEvent, fechaCita: format(fecha, "yyyy-MM-dd HH:mm") })
              }
            />
          </LocalizationProvider>
          <br />
          <br />
          <Typography> Cambiar cliente </Typography>
          <Select sx={{ width: "75%" }} name="nombreCliente" value={dataEvent.idCliente} disabled>
            <MenuItem value={0}> Seleccione un cliente </MenuItem>
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
          <Select sx={{ width: "75%" }} name="idEstilista" value={dataEvent.idEstilista} disabled>
            <MenuItem value={0}> Seleccione un estilista </MenuItem>
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
          {/* <Button onClick={() => edit()}> Guardar </Button> */}
          <div style={{ position: "absolute", bottom: 10, right: 10 }}>
            <Button color="warning" onClick={() => setModalCitaEdit(false)}>
              Salir
            </Button>
            <Button onClick={() => putCitaEstado()}> Guardar </Button>
          </div>
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
          peticiones();
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
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

      <Modal
        open={modalServiciosAgregar}
        onClose={() => {
          setModalServiciosAgregar(false);
          peticiones();
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
    </Fragment>
  );
}

export default SchedulerScreen;
