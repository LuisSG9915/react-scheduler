import {
  Typography,
  TextField,
  Container,
  Box,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React, { useState } from "react";
import { Cliente } from "../models/Cliente";
import { jezaApi } from "../api/jezaApi";
import Swal from "sweetalert2";
import { ligaAgenda } from "../consts/ligaAgenda";

function ClientesScreen() {
  const idSuc = new URLSearchParams(window.location.search).get("sucursal");

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
    recibirCorreo: false,
  });

  const postCliente = () => {
    if (!form.nombre || !form.telefono || !form.email || !form.redsocial1 || !form.fecha_nac) {
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
          }&redsocial2=${"..."}&redsocial3=${"..."}&sucOrigen=${idSuc}&recibirCorreo=${
            form.recibirCorreo
          }`
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
            redsocial1: "",
          });
          Swal.fire({
            icon: "success",
            text: `Registro realizado correctamente`,
            confirmButtonColor: "#3085d6",
          });
        });
    }
  };
  const idUser = new URLSearchParams(window.location.search).get("idUser");
  const fecha = new URLSearchParams(window.location.search).get("fecha");
  const idRec = new URLSearchParams(window.location.search).get("idRec");

  const handleOpenNewWindowCreateCitaScreen = ({ idUsuario, fecha }) => {
    const url = `${ligaAgenda}CreateCitaScreen?idUser=${idUsuario}&fecha=${fecha}&idSuc=${idSuc}&idRec=${idRec}`; // Reemplaza esto con la URL que desees abrir
    const width = 1000;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
    window.open(url, "_blank", features);
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
              <Typography variant="body1">Teléfono:</Typography>
              <TextField
                type="text"
                name="number"
                onChange={(e) => setForm({ ...form, telefono: String(e.target.value) })}
                value={form.telefono}
                placeholder="Ingrese el Número Telefónico del Cliente"
              />
              <Typography variant="body1">Instagram: </Typography>
              <TextField
                type="text"
                name="redsocial1"
                onChange={(e) => setForm({ ...form, redsocial1: String(e.target.value) })}
                value={form.redsocial1}
                placeholder="Ingrese el instagram"
              />
              <Typography variant="body1">Domicilio:</Typography>
              <TextField
                type="text"
                name="domicilio"
                onChange={(e) => setForm({ ...form, domicilio: String(e.target.value) })}
                value={form.domicilio}
                placeholder="Ingrese el Domicilio del cliente"
              />
              <Typography variant="body1">Codigo Postal:</Typography>
              <TextField
                type="number"
                name="cp"
                onChange={(e) => setForm({ ...form, cp: String(e.target.value) })}
                value={form.cp}
                placeholder="Ingrese el Código Postal"
              />
              <Typography variant="body1">Ciudad:</Typography>
              <TextField
                type="text"
                name="ciudad"
                onChange={(e) => setForm({ ...form, ciudad: String(e.target.value) })}
                value={form.ciudad}
                placeholder="Ingrese la Ciudad"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => {
                      setForm({ ...form, recibirCorreo: e.target.checked });
                    }}
                  />
                }
                label="No recibir correos"
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <Button onClick={() => postCliente()} variant="contained">
            Guardar
          </Button>
          <br />
          {/* <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handleOpenNewWindowCreateCitaScreen({
                idUsuario: null,
                fecha: Date(),
              });
            }}
          >
            Crear cita
          </Button> */}
        </Box>
      </Container>
    </>
  );
}

export default ClientesScreen;
