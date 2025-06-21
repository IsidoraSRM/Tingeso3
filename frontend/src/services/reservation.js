import httpClient from "../http-common";

// Obtener todas las reservas
const getAll = () => {
  return httpClient.get("/reservation/all");
};

// Obtener una reserva por ID
const getById = (id) => {
  return httpClient.get(`/reservation/${id}`);
};

// Crear una reserva básica
const create = (reservationData) => {
  return httpClient.post("/reservation/create", reservationData);
};

// Crear una reserva con cálculo de precios
const createWithPricing = (reservationData) => {
  return httpClient.post("/reservation/create2", reservationData);
};

// Obtener reserva con cálculo de precios
const getReservationWithPricing = (id) => {
  return httpClient.get(`/reservation/${id}/pricing`);
};

// Obtener clientes de una reserva
const getCustomersByReservationId = (id) => {
  return httpClient.get(`/reservation/customers/${id}`);
};

// Enviar correo de confirmación
const sendConfirmationEmail = (id) => {
  return httpClient.get(`/reservation/${id}/send-mail`);
};
// Obtener reporte de vueltas/tiempo para un rango de fechas
const getLapsTimeReport = (startDate, endDate) => {
  return httpClient.get("/reservation/reports/laps-time", {
    params: {
      startDate: startDate,
      endDate: endDate
    }
  });
};

// Obtener reporte por tamaño de grupo para un rango de fechas
const getGroupSizeReport = (startDate, endDate) => {
  return httpClient.get("/reservation/reports/group-size", {
    params: {
      startDate: startDate,
      endDate: endDate
    }
  });
};

export default { 
  getAll, 
  getById, 
  create, 
  createWithPricing, 
  getReservationWithPricing, 
  getCustomersByReservationId, 
  sendConfirmationEmail,
  getLapsTimeReport,
  getGroupSizeReport
};