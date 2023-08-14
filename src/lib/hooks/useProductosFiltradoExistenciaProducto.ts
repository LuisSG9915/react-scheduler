import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { jezaApi } from "../api/jezaApi";
import { ProductoExistencia } from "../models/Product";
interface Props {
  descripcion: string;
  inventariable: number;
  servicio: number;
  insumo: number;
  obsoleto: number;
  sucursal: number;
}
export const useProductosFiltradoExistenciaProducto = ({
  descripcion,
  insumo,
  inventariable,
  obsoleto,
  servicio,
  sucursal,
}: Props) => {
  const [dataProductos4, setDataProductos4] = useState<ProductoExistencia[]>([]);

  const fetchProduct4 = async () => {
    try {
      const response: AxiosResponse<ProductoExistencia[]> = await jezaApi.get(
        `/ProductoExistencia?id=0&descripcion=${
          descripcion ? descripcion : "%"
        }&verinventariable=${inventariable}&esServicio=${servicio}&esInsumo=${insumo}&obsoleto=${obsoleto}&marca=%&cia=21&sucursal=${sucursal}`
      );
      setDataProductos4(response.data);
      console.log({ dataProductos4 });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct4();
  }, []);
  useEffect(() => {
    fetchProduct4();
  }, [descripcion]);

  return { dataProductos4, fetchProduct4, setDataProductos4 };
};
