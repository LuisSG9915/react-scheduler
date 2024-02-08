import { format } from "date-fns";
import { ProcessedEvent } from "../types";
import axios from "axios";
import { jezaApi } from "../api/jezaApi";

export const putCita = async (cita: ProcessedEvent) => {
  const fecha = format(cita.start, "yyyy-MM-dd HH:mm");
  console.log(fecha);
  await jezaApi.put(
    `/Cita?id=${cita.event_id}&cia=26&sucursal=21&fechaCita=${fecha.toString()}&idCliente=${
      cita.idCliente
    }&tiempo=${cita.tiempo}&idEstilista=${cita.admin_id}&idUsuario=${cita.idUsuario}&estatus=${
      cita.estatus
    }`
  );
};

export const putCitaEstado = async (
  event_id: any,
  fechaCita: any,
  idCliente: any,
  tiempo: any,
  admin_id: any,
  idUsuario: any,
  idEstatus: any,
  sucursal: any
) => {
  if (idEstatus > 0) {
    if (idUsuario == 2235) {
      alert("Sin permisos");
      return;
    }

    await jezaApi.put(
      `/Cita?id=${
        idEstatus === 4 ? 0 : event_id
      }&cia=26&sucursal=${sucursal}&fechaCita=${fechaCita}&idCliente=${idCliente}&tiempo=${tiempo}&idEstilista=${admin_id}&idUsuario=${idUsuario}&estatus=${idEstatus}`
    );
  }
};

export const deleteCita = (id: number) => {
  jezaApi.delete(`/Cita?id=${id}`).then((response) => alert("Cita eliminada con éxito"));
};

export const getCitaServicios = async (id: number): Promise<any> => {
  const response = await jezaApi.get(`/Citaservicio?id=${id}&fecha=20230720&sucursal=21`);
  return response.data;
};

export const peticionCita = async () => {
  const response = await jezaApi.get(
    "/Cita?id=%&suc=%&estilista=%&f1=20230101&f2=20231212&cliente=%&estatus=%"
  );
  return response.data;
};
