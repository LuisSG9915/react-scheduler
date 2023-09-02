export interface Eventos {
  id?: number | string;
  event_id: number | string;
  title: string;
  description: string | undefined;
  start: Date;
  end: Date;
  admin_id: number;
  color: string | undefined;
  disabled?: boolean;
  // NUEVOS AGREGADOS
  horaFin?: Date | null;
  fechaCita?: Date | null | string;
  idUsuario?: number;
  servicioDescripcion?: string;
  numeroTelefono?: string;
  cia?: number;
  sucursal?: number;
  d_sucursal?: string;
  idCliente?: number;
  nombreCliente?: string;
  tiempo?: number;
  idEstilista?: number;
  nombreEstilista?: string;
  nombreRecepcionista?: string;
  fechaAlta?: string;
  estatus?: number;
  descripcionEstatus?: string;
  fechaCambio?: string;
  idcolor?: number;
  idEstatus?: number;
  idRec?: number;
}
