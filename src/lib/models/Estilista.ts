export interface Estilista {
  admin_id: number;
  title: string;
  mobile: string;
  avatar: string;
}

// Generated by https://quicktype.io

export interface EstilistaResponse {
  id: number;
  clave_empleado: string;
  status: number;
  d_estatus: string;
  nombre: string;
  fecha_nacimiento: string;
  sexo: string;
  RFC: string;
  CURP: string;
  imss: string;
  domicilio: string | null;
  colonia: string | null;
  poblacion: null | string;
  estado: null | string;
  lugar_nacimiento: null | string;
  codigo_postal: null | string;
  telefono1: null | string;
  telefono2: null | string;
  email: null | string;
  idDepartamento: number;
  descripcion_departamento: string;
  idPuesto: number;
  descripcion_puesto: string;
  observaciones: string;
  nivel_escolaridad: number;
  d_nivelEscolaridad: null | string;
  fecha_baja: null | string;
  motivo_baja: number | null;
  d_motiboBaja: null;
  motivo_baja_especificacion: null | string;
  fecha_alta: string;
  fecha_cambio: string;
  admin_id: number;
  title: string;
  mobile: string;
}

export enum Colonia {
  Empty = "",
  Q = "q",
}

export enum DEstatus {
  Ssacscscs = "ssacscscs",
}

export enum DescripcionDepartamento {
  Barrio = "Barrio",
  CDMexico = "Cd Mexico",
  SANPedro = "San Pedro",
}

export enum DescripcionPuesto {
  EstilistaLíder = "Estilista Líder",
  TeamManeger = "Team Maneger",
}
