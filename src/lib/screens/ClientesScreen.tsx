import { Typography, TextField, Container, Box, Button, Grid } from "@mui/material";
import React, { useState } from "react";
import { Cliente } from "../models/Cliente";
import { jezaApi } from "../api/jezaApi";
import Swal from "sweetalert2";

function ClientesScreen() {
  const [form, setForm] = useState<Cliente>({
    id_cliente: 0,
    nombre: "",
    domicilio: "",
    ciudad: "",
    estado: "",
    colonia: "",
    cp: "",
    rfc: "",
    telefono: "",
    email: "",
    nombre_fiscal: "",
    suspendido: false,
    sucursal_origen: 0,
    num_plastico: "",
    suc_asig_plast: 0,
    fecha_asig_plast: "",
    usr_asig_plast: "",
    plastico_activo: false,
    fecha_nac: "",
    correo_factura: "",
    regimenFiscal: "",
    claveRegistroMovil: "",
    fecha_alta: "",
    fecha_act: "",
    redsocial1: "",
    redsocial2: "",
    redsocial3: "",
  });

  const postCliente = () => {
    if (
      !form.nombre ||
      !form.domicilio ||
      !form.ciudad ||
      !form.estado ||
      !form.colonia ||
      !form.cp ||
      !form.telefono ||
      !form.email ||
      !form.fecha_nac
    ) {
      alert("Hacen falta datos, favor de revisarlos");
    } else {
      jezaApi
        .post(
          `/Cliente?nombre=${form.nombre}&domicilio=${form.domicilio}&ciudad=${
            form.ciudad
          }&estado=${form.estado}&colonia=${form.colonia}&cp=${form.cp}&telefono=${
            form.telefono
          }&email=${form.email}&fecha_nac=${form.fecha_nac}&redsocial1=${
            form.redsocial1 ? form.redsocial1 : "."
          }&redsocial2=${"..."}&redsocial3=${"..."}`
        )
        .then((response) => {
          setForm({
            ...form,
            nombre: "",
            domicilio: "",
            ciudad: "",
            estado: "",
            colonia: "",
            cp: "",
            telefono: "",
            email: "",
            fecha_nac: "",
          });
          Swal.fire({
            icon: "success",
            //   text: `${response.data[0].mensaje1}`,
            text: `Registro realizado correctamente`,
            confirmButtonColor: "#3085d6",
          });
        });
    }
  };

  return (
    <>
      <Container maxWidth="lg">
        <Box display="flex" flexDirection="column" alignItems="center">
          <br />
          <Typography variant="h5">Creación de cliente</Typography>
          <br />
          <Grid container spacing={2}>
            {/* First column */}
            <Grid item xs={6}>
              <Typography variant="body1">Nombre:</Typography>
              <TextField
                type="text"
                name="nombre"
                onChange={(e) => setForm({ ...form, nombre: String(e.target.value) })}
                value={form.nombre}
                placeholder="Ingrese el nombre del cliente"
              />
              <Typography variant="body1">Domicilio:</Typography>
              <TextField
                type="text"
                name="domicilio"
                onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                value={form.domicilio}
                placeholder="Ingrese el Domicilio del cliente"
              />
              <Typography variant="body1">Ciudad:</Typography>
              <TextField
                type="text"
                name="ciudad"
                onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })}
                value={form.ciudad}
                placeholder="Ingrese la Ciudad"
              />
              <Typography variant="body1">Estado:</Typography>
              <TextField
                type="text"
                name="estado"
                onChange={(e) => setForm({ ...form, estado: String(e.target.value) })}
                value={form.estado}
                placeholder="Ingrese el Estado"
              />
              <Typography variant="body1">Colonia:</Typography>
              <TextField
                type="text"
                name="colonia"
                onChange={(e) => setForm({ ...form, colonia: String(e.target.value) })}
                value={form.colonia}
                placeholder="Ingrese la Colonia"
              />
            </Grid>

            {/* Second column */}
            <Grid item xs={6}>
              <Typography variant="body1">Codigo Postal:</Typography>
              <TextField
                type="number"
                name="cp"
                onChange={(e) => setForm({ ...form, cp: String(e.target.value) })}
                value={form.cp}
                placeholder="Ingrese el Código Postal"
              />
              <Typography variant="body1">Teléfono:</Typography>
              <TextField
                type="text"
                name="number"
                onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                value={form.telefono}
                placeholder="Ingrese el Número Telefónico del Cliente"
              />
              <Typography variant="body1">E-mail:</Typography>
              <TextField
                type="email"
                name="email"
                onChange={(e) => setForm({ ...form, email: String(e.target.value) })}
                value={form.email}
                placeholder="Ingrese el Correo Electrónico del Cliente"
              />
              <Typography variant="body1">Fecha de nacimiento:</Typography>
              <TextField
                type="date"
                name="fecha_nac"
                onChange={(e) => setForm({ ...form, fecha_nac: String(e.target.value) })}
                value={form.fecha_nac}
                
              />
              <Typography variant="body1">Instagram: </Typography>
              <TextField
                type="text"
                name="redsocial1"
                onChange={(e) => setForm({ ...form, redsocial1: String(e.target.value) })}
                value={form.redsocial1}
                placeholder="Ingrese el instagram"
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <Button onClick={() => postCliente()} variant="contained">
            Guardar
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default ClientesScreen;
