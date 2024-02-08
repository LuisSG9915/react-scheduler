import { useRef, Fragment, useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
  Dialog,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import { Scheduler } from "..";
import { EstilistaResponse } from "../models/Estilista";
import { Eventos } from "../models/Events";
import { ServicioPost } from "../models/Servicio";
import { SchedulerRef, ProcessedEvent, EventActions } from "../types";
import { useNavigate } from "react-router-dom";
import { EVENTS } from "../../data";
import { useEstatusCitas } from "../hooks/useEstatusCitas";
import { COLOR_ESTATUS_CITAS } from "../helpers/constants";
import { useClientes } from "../hooks/useClientes";
import HomeIcon from "@mui/icons-material/Home";
import { jezaApi } from "../api/jezaApi";
// Generated by https://quicktype.io

function SchedulerScreen() {
  const [loading, setLoading] = useState(true);

  const calendarRef = useRef<SchedulerRef>(null);
  const [datas, setDatas] = useState<Eventos[]>([]);
  const [datasEstilista, setDatasEstilista] = useState<EstilistaResponse[]>([]);
  const [datasServicios, setDatasServicios] = useState<[]>([]);
  const { estatusCitas } = useEstatusCitas();
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

  const idSuc = new URLSearchParams(window.location.search).get("idSuc");
  const suc = new URLSearchParams(window.location.search).get("suc");
  const idRec = new URLSearchParams(window.location.search).get("idRec");

  useEffect(() => {
    setDataEvent({ ...dataEvent, sucursal: Number(idSuc), d_sucursal: suc, idRec: Number(idRec) });
    if (!idSuc) {
      alert("Favor de ingresar en la página principal");
    }
  }, []);

  const handleChangeSelect = (event: SelectChangeEvent<number>) => {
    const selectedValue = event.target.value;
    const selectedName = event.target.name;
    setDataEvent((prevState: any) => ({ ...prevState, [selectedName]: selectedValue }));
  };

  const peticionEstilista = async () => {
    if (dataEvent.sucursal !== 0) {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://cbinfo.no-ip.info:9089/Estilistas?suc=${dataEvent.sucursal}&fecha=${format(
            new Date(nuevaFechaPrueba),
            "yyyy-MM-dd"
          )}`
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
  const { dataClientes, fetchClientes } = useClientes();
  useEffect(() => {
    fetchClientes();
  }, []);

  const clientesFormatted = (data, idCliente) => {
    const buscarIdProducto = () => {
      const objetoEncontrado = data.find((obj) => obj.id_cliente === idCliente);

      if (objetoEncontrado) {
        console.log(objetoEncontrado);
        return [objetoEncontrado.telefono];
      } else {
        return "";
      }
    };
    const idProductosEncontrados = buscarIdProducto();
    return {
      datosFormateados: data,
      idProductosEncontrados,
    };
  };

  const peticiones = async () => {
    await peticionEstilista().then(async () => {
      if (dataEvent.sucursal > 20) {
        const temp = new Date(nuevaFechaPrueba);
        const formattedDate = format(temp, "yyyyMMdd");
        try {
          const response = axios.get(
            `http://cbinfo.no-ip.info:9089/Cita?cliente=%&f1=${formattedDate}&suc=${dataEvent.sucursal}`
          );
          const formattedData = (await response).data.map((evento: Eventos) => ({
            ...evento,
            tiempo: evento.tiempo,
            idUsuario: evento.idUsuario,
            ServicioDescripción: evento.ServicioDescripción,
            start: evento.fechaCita ? new Date(evento.fechaCita) : new Date(),
            end: evento.horaFin ? new Date(evento.horaFin) : new Date(),
            admin_id: evento.idEstilista ? evento.idEstilista : 3,
            event_id: evento.id ? evento.id : 0,
            idEstatus: evento.estatus,
            idCitaServicio: evento.idCitaServicio,
            numeroTelefono: clientesFormatted(dataClientes, Number(evento.idCliente))
              .idProductosEncontrados,
            title:
              evento.idCliente.toString() +
              "," +
              evento.tiempo +
              "," +
              evento.idEstilista +
              "," +
              evento.estatus +
              "," +
              evento.idCitaServicio +
              "," +
              evento.ServicioDescripción,
            description: evento.nombreCliente,
            disabled: evento.estatus === 1006 ? true : false,
            color:
              evento.estatus === 1
                ? COLOR_ESTATUS_CITAS[0]
                : evento.estatus === 2
                ? COLOR_ESTATUS_CITAS[1]
                : evento.estatus === 3
                ? COLOR_ESTATUS_CITAS[2]
                : evento.estatus === 1007
                ? COLOR_ESTATUS_CITAS[5]
                : evento.estatus === 1008
                ? COLOR_ESTATUS_CITAS[4]
                : evento.estatus === 6
                ? COLOR_ESTATUS_CITAS[3]
                : evento.estatus === 1005
                ? COLOR_ESTATUS_CITAS[2]
                : evento.estatus === 4
                ? COLOR_ESTATUS_CITAS[3]
                : evento.estatus === 1009
                ? "#dddddd"
                : "grey",
          }));
          setTimeout(() => {
            setRefreshKey((key) => key + 1); // Actualiza el estado local para forzar la actualización del componente Scheduler
          }, 500);
          setTimeout(() => {
            setLoading(false);
          }, 1000);

          setFormattedDatas(formattedData);
          // changeLoadingValue(false);
        } catch (error) {
          console.error(error);
        }
      }
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
    if (cita.start < new Date()) {
      setMessageDialog({
        subtitle:
          "No se pueden actualizar citas en un horario anterior al actual, favor de intentarlo de nuevo",
        title: "Advertencia",
      });
      setVoidInfo(true);
      setTimeout(() => {
        setLoading(false);
      }, 2500);
    } else if (Number(cita.estatus) === 4) {
      setVoidInfo(true);
      setMessageDialog({
        subtitle: "No se puede modificar una cita en proceso, favor de verificar la cita en ventas",
        title: "Advertencia",
      });
      setLoading(false);
    } else {
      axios
        .put(
          `http://cbinfo.no-ip.info:9089/Cita?id=${cita.event_id}&cia=26&sucursal=${
            dataEvent.sucursal
          }&fechaCita=${format(cita.start, "yyyy-MM-dd HH:mm")}&idCliente=${
            cita.idCliente
          }&tiempo=${cita.tiempo ? cita.tiempo : 0}&idEstilista=${cita.admin_id}&idUsuario=${
            cita.idUsuario
          }&estatus=${cita.estatus}`
        )
        .then((response) => peticiones())
        .catch((e) => alert(e));
    }
  };

  const handleDropEvent = async (
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ) => {
    changeLoadingValue(true);
    setLoading(true);
    filtroSeguridad("CAT_CITA_ADD").then((response) => {
      if (response == false) {
        setVoidInfo(true);
        setMessageDialog({
          subtitle: "No cuenta con permisos ",
          title: "Atención",
        });
        setLoading(false);
      } else {
        setVisualizar(true);
        putCita(updatedEvent);
      }
    });
  };

  const currentDates = new Date();
  const ligaProductiva = "http://cbinfo.no-ip.info:9085/";
  const ligaLocal = "http://localhost:3000/";
  const ligaPruebas = "http://cbinfo.no-ip.info:9082/";

  const handleOpenNewWindow = () => {
    const url = `${ligaPruebas}Cliente?sucursal=${dataEvent.sucursal}`; // Reemplaza esto con la URL que desees abrir
    const width = 500;
    const height = 1500;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };
  const handleOpenNewWindowCreateCitaScreen = ({ idUsuario, fecha }) => {
    const url = `${ligaPruebas}CreateCitaScreen?idUser=${idUsuario}&fecha=${fecha}&idSuc=${dataEvent.sucursal}&idRec=${idRec}`; // Reemplaza esto con la URL que desees abrir
    const width = 1000;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };
  const handleOpenNewWindowCitaScreen = ({ idCita, idUser, idCliente, fecha, flag }) => {
    const url = `${ligaPruebas}CitaScreen?idCita=${idCita}&idUser=${idUser}&idCliente=${idCliente}&fecha=${fecha}&idSuc=${dataEvent.sucursal}&idRec=${idRec}&flag=${flag}`; // Reemplaza esto con la URL que desees abrir
    const width = 600;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
  };

  const fechaInicial = new Date();
  const [nuevaFechaPrueba, setNuevaFechaPrueba] = useState<Date>(fechaInicial);

  useEffect(() => {
    setLoading(true);
    peticiones();
  }, [nuevaFechaPrueba]);

  useEffect(() => {
    setLoading(true);
    peticiones();
  }, [dataEvent.sucursal]);

  useEffect(() => {
    peticionEstilista();
  }, [idSuc, dataEvent.sucursal, !datasEstilista]);
  const overlayClass = loading ? "overlay active" : "overlay";

  interface Props {
    openModal: boolean;
    onClose: () => void;
    textTitle: string;
    contentText: string;
    salir: () => void;
    guardar?: (id: number) => void;
  }
  const [voidInfo, setVoidInfo] = useState(false);
  const [messageDialog, setMessageDialog] = useState({
    title: "",
    subtitle: "",
  });
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
              onClick={() => null} // Pass the id parameter to guardar
              autoFocus
            >
              Ok
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    );
  };

  const filtroSeguridad = async (modulo: string): Promise<boolean> => {
    // Ahora, session tiene elementos, puedes usar session.map

    const response = await jezaApi.get(`/Permiso?usuario=${idRec}&modulo=${modulo}`);

    if (response.data[0].permiso == false) {
      return false; // No se otorga el permiso
    }

    return true; // Se otorga el permiso
  };
  const [visualizar, setVisualizar] = useState(false);
  useEffect(() => {
    filtroSeguridad("ACCESS_SUCURSAL_AGENDA")
      .then((response) => {
        if (response == false) {
          setVisualizar(false);
        } else {
          setVisualizar(true);
        }
        if (Number(idRec) == 2235) {
          setVisualizar(true);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert("Su sesión ha expirado, favor de ingresar de nuevo ");
          window.location.href = "http://localhost:5173/";
        }
      });
  }, []);

  return (
    <div>
      <Dialog open={loading} fullWidth maxWidth={"xs"}>
        <div
          className=""
          style={{
            backgroundColor: "darkgrey",
            padding: 50,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <br />
          <CircularProgress size={50} />
        </div>
      </Dialog>
      <Grid
        container
        justifyContent="flex-end"
        alignContent={"center"}
        alignItems={"center"}
        style={{ position: "sticky" }}
      >
        <HomeIcon
          color={"info"}
          onClick={() => (window.location.href = "http://cbinfo.no-ip.info:9088/Ventas")}
        ></HomeIcon>
        {visualizar ? (
          <>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Sucursal"
              value={dataEvent.sucursal}
              onChange={handleChangeSelect}
              name="sucursal"
              size="small"
            >
              <MenuItem value={0}>Seleccione una sucursal</MenuItem>
              <MenuItem value={21}>Barrio</MenuItem>
              <MenuItem value={26}>San Pedro</MenuItem>
              <MenuItem value={27}>CDMX</MenuItem>
              <MenuItem value={1074}>PRUEBAS SISTEMAS</MenuItem>
            </Select>
            <Button
              style={{ fontStyle: "italic" }}
              onClick={() => {
                handleOpenNewWindow();
              }}
            >
              Agregar Clientes
            </Button>
          </>
        ) : null}
      </Grid>

      <DialogComponent
        contentText={messageDialog.subtitle}
        onClose={() => setVoidInfo(false)}
        openModal={voidInfo}
        salir={() => setVoidInfo(false)}
        textTitle={messageDialog.title}
      ></DialogComponent>
      <Button onClick={() => calendarRef.current.scheduler.handleGotoDay(currentDates)}></Button>
      <Scheduler
        key={refreshKey}
        day={{
          step: 30,
          startHour: 8,
          endHour: 20,
        }}
        ref={calendarRef}
        month={null}
        onEventClick={(evento: any) => {
          setDataEvent(evento);
          setFormServicio({ ...formServicio, id_Cita: Number(evento.id) });
          getCitaServicios(Number(evento.id));
        }}
        onSelectedDateChange={(date) => {
          setNuevaFechaPrueba(date);
        }}
        onConfirm={handleConfirmEvent}
        onDelete={handleDeleteEvent}
        customEditor={({ close, state }) => {
          const cadenaEstatus = state.title.value.split(",");
          const estatusState = cadenaEstatus[3];
          const fecha = new Date();
          // __________________________________________________________________ CAT_CITA_ADD
          if (
            state.start.value < fecha.setMinutes(fecha.getMinutes() - 30) &&
            state.description.value.length === 0
          ) {
            setMessageDialog({
              subtitle:
                "No se pueden ingresar citas en un horario anterior al actual, favor de intentarlo de nuevo",
              title: "Atención",
            });
            setVoidInfo(true);

            close();
          } else {
            filtroSeguridad("CAT_CITA_ADD").then(async (response) => {
              if (response) {
                if (
                  (await filtroSeguridad("EDICION_AGENDA_TOTAL")) ||
                  Number(idSuc) === Number(dataEvent.sucursal)
                ) {
                  if (state.description.value.length > 0) {
                    if (Number(estatusState) == 4 || Number(estatusState) == 1009) {
                      handleOpenNewWindowCitaScreen({
                        idCita: state.event_id.value,
                        idUser: state.admin_id.value,
                        idCliente: state.title.value,
                        fecha: new Date(state.start.value),
                        flag: 1,
                      });
                    } else {
                      handleOpenNewWindowCitaScreen({
                        idCita: state.event_id.value,
                        idUser: state.admin_id.value,
                        idCliente: state.title.value,
                        fecha: new Date(state.start.value),
                        flag: 0,
                      });
                    }
                    // CREACIÓN
                  } else {
                    handleOpenNewWindowCreateCitaScreen({
                      idUsuario: state.admin_id.value,
                      fecha: state.start.value,
                    });
                  }
                } else {
                  close();
                  setMessageDialog({
                    subtitle: "No cuenta con permisos para realizar acciones en otras sucursales",
                    title: "Atención",
                  });
                  setVoidInfo(true);
                }
              } else {
                close();
                setMessageDialog({
                  subtitle: "No cuenta con permisos ",
                  title: "Atención",
                });
                setVoidInfo(true);
              }
            });
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
    </div>
  );
}

export default SchedulerScreen;
