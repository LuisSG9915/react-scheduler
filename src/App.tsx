import { Scheduler } from "./lib";
import { useRef, Fragment } from "react";
import { SchedulerRef, ProcessedEvent, EventActions } from "./lib/types";
import { EVENTS, RESOURCES } from "./data";
function App() {
  const calendarRef = useRef<SchedulerRef>(null);

  const handleConfirmEvent = async (
    event: ProcessedEvent,
    action: EventActions
  ): Promise<ProcessedEvent> => {
    // Lógica para manejar la confirmación de eventos
    console.log("Evento confirmado:", event);
    console.log("Acción:", action);
    return event;
  };

  const handleDeleteEvent = async (idEvent: string | number) => {
    // Lógica para manejar la confirmación de eventos
    console.log("Evento  idEvent", idEvent);
  };

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}></div>
      <Scheduler
        day={{
          step: 15,
          startHour: 10,
          endHour: 15,
        }}
        ref={calendarRef}
        // Event edit ID lo hace de manera 'automatica'
        onEventClick={(a) => console.log(a)}
        onConfirm={handleConfirmEvent}
        onDelete={handleDeleteEvent}
        events={EVENTS}
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
        // viewerExtraComponent={(fields, event) => {
        //   return (
        //     <div>
        //       {fields.map((field, i) => {
        //         if (field.name === "admin_id") {
        //           const admin = field.options.find(
        //             (fe) => fe.id === event.admin_id
        //           );
        //           return (
        //             <Typography
        //               key={i}
        //               style={{ display: "flex", alignItems: "center" }}
        //               color="textSecondary"
        //               variant="caption"
        //               noWrap
        //             >
        //               <PersonRoundedIcon /> {admin.text}
        //             </Typography>
        //           );
        //         } else {
        //           return "";
        //         }
        //       })}
        //     </div>
        //   );
        // }}
      />
    </Fragment>
  );
}

export default App;
