import { format } from "date-fns";
import { ProcessedEvent } from "../types";
import axios from "axios";

export const putCita = async (cita: ProcessedEvent) => {
  const fecha = format(cita.start, "yyyy-MM-dd HH:mm");
  console.log(fecha);
  await axios.put(
    `http://cbinfo.no-ip.info:9089/Cita?id=${
      cita.event_id
    }&cia=26&sucursal=21&fechaCita=${fecha.toString()}&idCliente=${cita.idCliente}&tiempo=${
      cita.tiempo
    }&idEstilista=${cita.admin_id}&idUsuario=${cita.idUsuario}&estatus=${cita.estatus}`
  );
};

export const putCitaEstado = async (
  event_id: any,
  fechaCita: any,
  idCliente: any,
  tiempo: any,
  admin_id: any,
  idUsuario: any,
  idEstatus: any
) => {
  await axios
    .put(
      `http://cbinfo.no-ip.info:9089/Cita?id=${event_id}&cia=26&sucursal=21&fechaCita=${fechaCita}&idCliente=${idCliente}&tiempo=${tiempo}&idEstilista=${admin_id}&idUsuario=${idUsuario}&estatus=${idEstatus}`
    )
    .then((response) => {
      alert("Acción realizada");
    });
};

export const deleteCita = (id: number) => {
  axios
    .delete(`http://cbinfo.no-ip.info:9089/Cita?id=${id}`)
    .then((response) => alert("Cita eliminada con éxito"));
};

export const getCitaServicios = async (id: number): Promise<any> => {
  const response = await axios.get(
    `http://cbinfo.no-ip.info:9089/Citaservicio?id=${id}&fecha=20230720&sucursal=21`
  );
  return response.data;
};

export const peticionCita = async () => {
  const response = await axios.get(
    "http://cbinfo.no-ip.info:9089/Cita?id=%&suc=%&estilista=%&f1=20230101&f2=20231212&cliente=%&estatus=%"
  );
  return response.data;
};
