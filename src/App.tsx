import { Scheduler } from "./lib";
import { useRef, Fragment, useState, useEffect } from "react";
import { SchedulerRef, ProcessedEvent, EventActions } from "./lib/types";
import { EVENTS, RESOURCES } from "./data";
import useStore from "./lib/hooks/useStore";
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

  const peticion = async () => {
    try {
      const response = await axios.get("http://localhost:3000/events");
      setDatas(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  // const eliminar = async (id: any) => {
  //   axios.delete("http://localhost:3000/events", id).then(() => console.log("done"));
  // };

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
    console.log(formattedDatas);
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
        .put<Eventos>("http://localhost:3000/events", editEvent)
        .then(() => console.log("exitoso"))
        .catch((e) => console.log(e));
    }
    return event;
  };

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
      <div style={{ textAlign: "center" }}></div>
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
          deletable={false}
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
