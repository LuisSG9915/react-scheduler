import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
// import { jezaApi } from "../../api/jezaApi";
import { jezaApi } from "../api/jezaApi";
import { Trabajador } from "../models/Trabajador";

export const useNominaTrabajadores = () => {
  const [dataTrabajadores, setDataTrabajadores] = useState<Trabajador[]>([]);

  const fetchNominaTrabajadores = async () => {
    try {
      const response: AxiosResponse<Trabajador[]> = await jezaApi.get(`/Trabajador?id=0`);
      setDataTrabajadores(response.data);
      // console.log(dataTrabajadores);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNominaTrabajadores();
  }, []);

  return { dataTrabajadores, fetchNominaTrabajadores };
};
