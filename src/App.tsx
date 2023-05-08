import { Scheduler } from "./lib";
import { useRef, Fragment, useState, useEffect } from "react";
import { SchedulerRef, ProcessedEvent, EventActions } from "./lib/types";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { RESOURCES } from "./data";
import axios from "axios";

function App() {
  interface Eventos {
    id?: number | string;
    event_id: number | string;
    title: string;
    description: string | undefined;
    start: Date;
    end: Date;
    admin_id: number;
    color: string | undefined;
  }

  const calendarRef = useRef<SchedulerRef>(null);
  const [datas, setDatas] = useState<Eventos[]>([]);
  const [formattedDatas, setFormattedDatas] = useState<Eventos[]>([]);
  const [mode, setMode] = useState<"default" | "tabs">("default");
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };
  const peticion = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events");
      setDatas(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    peticion();
  }, []);

  useEffect(() => {
    const formattedData = datas.map((evento: Eventos) => ({
      ...evento,
      start: new Date(evento.start),
      end: new Date(evento.end),
    }));
    setFormattedDatas(formattedData);
  }, [datas]);

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
        .then(() => console.log({ event }))
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

  const peticiones = () => {
    axios
      .get("http://localhost:3000/events") // cambiar la URL de acuerdo a tu API
      .then((response) => {
        const formattedData = datas.map((evento: Eventos) => ({
          ...evento,
          start: new Date(evento.start),
          end: new Date(evento.end),
        }));
        setFormattedDatas(formattedData);
        console.log("peticiones");
      })
      .catch((error) => console.error(error));
  };

  // const asyncPetición = async() =>{
  //   peticion();
  //       const formattedData = datas.map((evento: Eventos) => ({
  //     ...evento,
  //     start: new Date(evento.start),
  //     end: new Date(evento.end),
  //   }));
  //   setFormattedDatas(formattedData);
  //   console.log(formattedDatas);

  // };

  // const handleDeleteEvent = async (idEvent: string | number) => {
  //   // Lógica para manejar la confirmación de eventos
  //   console.log("Evento  idEvent", idEvent);
  //   eliminar(idEvent);
  // };

  const handleDropEvent = async (
    droppedOn: Date,
    updatedEvent: ProcessedEvent,
    originalEvent: ProcessedEvent
  ) => {
    // Lógica para manejar la confirmación de eventos
    console.log("Evento  idEvent", updatedEvent);
    console.log("Evento  idEvent", droppedOn);
    console.log("Evento  idEvent", originalEvent);
  };

  return (
    <Fragment>
      <div style={{ textAlign: "center", width: 150 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Sucursal</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Sucursal"
            onChange={handleChange}
          >
            <MenuItem value={10}>Mexico</MenuItem>
            <MenuItem value={20}>Monterrey</MenuItem>
            <MenuItem value={30}>Bodega</MenuItem>
          </Select>
        </FormControl>
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
      <div>
        {/* <Button onClick={ peticion}>Refresh Component</Button> */}
        <Button onClick={peticiones}>Refresh Component</Button>
      </div>
      {formattedDatas.length > 2 ? (
        <Scheduler
          day={{
            step: 30,
            startHour: 10,
            endHour: 15,
          }}
          ref={calendarRef}
          // Event edit ID lo hace de manera 'automatica'
          onEventClick={(a) => console.log(a)}
          onConfirm={handleConfirmEvent}
          // onDelete={handleDeleteEvent}
          // deletable={false}
          view={"day"}
          height={2}
          timeZone="America/Mexico_City"
          // editable={false}
          onEventDrop={handleDropEvent}
          events={formattedDatas}
          resources={RESOURCES}
          resourceFields={{
            idField: "admin_id",
            textField: "title",
            subTextField: "mobile",
            avatarField: "title",
            // colorField: "color",
          }}
          fields={[
            {
              name: "admin_id",
              type: "select",
              default: RESOURCES[0].admin_id,
              options: RESOURCES.map((res) => {
                return {
                  id: res.admin_id,
                  text: `${res.title} (${res.mobile})`,
                  value: res.admin_id, //Should match "name" property
                };
              }),
              config: { label: "Assignee", required: true },
            },
          ]}
        />
      ) : (
        // Aqui pongo un cargado...
        <h1>a</h1>
      )}
    </Fragment>
  );
}

export default App;
