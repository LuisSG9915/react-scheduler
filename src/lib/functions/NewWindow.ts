export const handleOpenVentas = () => {
  const url = `http://cbinfo.no-ip.info:9088/Ventas`; // Reemplaza esto con la URL que desees abrir
  const width = 500;
  const height = 1500;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  const features = `width=${width},height=${height},left=${left},top=${top},toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1`;
  window.open(url, "_blank");
};
