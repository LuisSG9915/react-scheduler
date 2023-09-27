import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import React, { useMemo } from "react";
import { LuCalendarSearch } from "react-icons/lu";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { ExportToCsv } from "export-to-csv"; //or use your library of choice here
interface Props {
  datah: any[];
  loadHistorialDetalle: (
    cveCliente: number,
    noVenta: number,
    idProducto: number,
    idSucursal: number
  ) => Promise<void>;
  setParamsDetalles: (
    value: React.SetStateAction<{
      sucursal: number;
      numVenta: number;
      idProducto: number;
      clave: number;
      Cve_cliente: number;
      fecha: string;
    }>
  ) => void;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
}

function TableHistorial({ datah, loadHistorialDetalle, setParamsDetalles, setIsModalOpen }: Props) {
  const cHistorial = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        header: "Acciones",
        Cell: ({ row }) => {
          let icono;
          let isDisabled = false; // Por defecto, el botón no está deshabilitado

          // Analizar la clave para determinar si es un producto o un servicio
          if (row.original.Clave.endsWith("P")) {
            // Si la clave termina con "P", se trata de un producto
            icono = <FaShoppingCart size={23} />;
            isDisabled = true; // Marcar el botón como deshabilitado para productos
          } else if (row.original.Clave.endsWith("S")) {
            // Si la clave termina con "S", se trata de un servicio
            icono = <FaUser size={23} />;
          } else {
            // Si no coincide con ninguna de las anteriores, se usa un icono predeterminado
            icono = <LuCalendarSearch size={23} />;
          }

          return (
            <div>
              <button
                disabled={isDisabled} // Establecer la propiedad disabled según isDisabled
                onClick={() => {
                  loadHistorialDetalle(
                    row.original.Cve_cliente,
                    row.original.NumVenta,
                    row.original.idProducto,
                    row.original.sucursal
                  );
                  setParamsDetalles({
                    Cve_cliente: row.original.Cve_cliente,
                    idProducto: row.original.idProducto,
                    numVenta: row.original.NumVenta,
                    sucursal: row.original.NombreSuc,
                    clave: row.original.id,
                    fecha: row.original.Fecha,
                  });
                  setIsModalOpen(true);
                }}
              >
                {icono}
              </button>
            </div>
          );
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },

      {
        accessorKey: "Cve_cliente",
        header: "Cliente",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NumVenta",
        header: "NumVenta",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "NombreSuc",
        header: "Sucursal",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Fecha",
        header: "Fecha",
        flex: 1,
        size: 1,
        Cell: ({ cell }) => {
          // const fecha = new Date(cell.getValue()); // Obtener la fecha como objeto Date
          const fecha = new Date();
          const dia = fecha.getDate().toString().padStart(2, "0"); // Obtener el día con dos dígitos
          const mes = (fecha.getMonth() + 1).toString().padStart(2, "0"); // Obtener el mes con dos dígitos (los meses en JavaScript son base 0)
          const anio = fecha.getFullYear().toString(); // Obtener el año con cuatro dígitos

          return <span>{`${dia}/${mes}/${anio}`}</span>;
        },
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Clave",
        header: "Clave",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Producto_Servicio",
        header: "Producto/Servicio",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Cantidad",
        header: "Cantidad",
        flex: 1,
        size: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Precio",
        header: "Precio",
        flex: 1,
        Cell: ({ cell }) => (
          <span>
            $
            {cell
              .getValue<number>()
              .toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        ),
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        size: 1,
      },
      {
        accessorKey: "Estilista",
        header: "Estilista",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Descuento",
        header: "Descuento",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "Forma_pago",
        header: "Forma de pago",
        flex: 1,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
    ],
    []
  );

  // Configuración de las opciones de exportación CSV
  const csvOptions = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: cHistorial.map((c) => c.header),
  };

  // Crea una instancia de ExportToCsv con las opciones
  const csvExporter = new ExportToCsv(csvOptions);

  // Función para exportar las filas especificadas
  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };

  // Función para exportar todos los datos
  const handleExportData = () => {
    csvExporter.generateCsv(datah.map((row) => row.original));
  };

  return (
    <MaterialReactTable
      columns={cHistorial}
      data={datah}
      initialState={{
        pagination: {
          pageSize: 5,
          pageIndex: 0,
        },
        density: "compact",
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Box sx={{ display: "flex", gap: "1rem", p: "0.5rem", flexWrap: "wrap" }}>
          <Button
            color="primary"
            //export all data that is currently in the table (ignore pagination, sorting, filtering, etc.)

            onClick={handleExportData}
            startIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export All Data
          </Button>
        </Box>
      )}
      // renderDetailPanel={renderDetailPanel} // Pasar la función renderDetailPanel como prop
    />
  );
}

export default TableHistorial;
