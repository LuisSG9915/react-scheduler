import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Cliente } from "../models/Cliente";
import { jezaApi } from "../api/jezaApi";

export const useClientesWithUseEffect = () => {
  const [dataClientes, setDataClientes] = useState<Cliente[]>([]);

  const fetchClientes = async () => {
    try {
      const response: AxiosResponse<Cliente[]> = await jezaApi.get("/Cliente?id=0");
      setDataClientes(response.data);
      console.log({ dataClientes });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return { dataClientes, fetchClientes, setDataClientes };
};
