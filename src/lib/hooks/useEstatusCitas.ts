import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { Cliente } from "../models/Cliente";
import { jezaApi } from "../api/jezaApi";

export const useEstatusCitas = () => {
  const [estatusCitas, setEstatusCitas] = useState<any[]>([]);

  const fetchEstatusCitas = async () => {
    try {
      const response: AxiosResponse<Cliente[]> = await jezaApi.get("/EstatusCitas");
      setEstatusCitas(response.data);
      console.log({ estatusCitas });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEstatusCitas();
  }, []);

  return { estatusCitas, fetchEstatusCitas, setEstatusCitas };
};
