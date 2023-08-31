import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Cliente } from "../models/Cliente";
import { jezaApi } from "../api/jezaApi";

interface Props {
  cveCliente: number;
}

export const useHistorialClientes = ({ cveCliente }: Props) => {
  const [historialClientes, setHistorialClientes] = useState<any[]>([]);

  const fetchEstatusCitas = async () => {
    try {
      const response: AxiosResponse<Cliente[]> = await jezaApi.get(
        `/Historial?cliente=${cveCliente}`
      );
      setHistorialClientes(response.data);
      console.log({ historialClientes });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEstatusCitas();
  }, [cveCliente]);

  return { historialClientes, fetchEstatusCitas, setHistorialClientes };
};
