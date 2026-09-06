"use server";

import { findSqlServerOperation } from "../catalog/sqlserverOperations";
import { executeOperation } from "./operationService";

const executeSqlServer = async (operationId, payload = {}) => {
  const operation = findSqlServerOperation(operationId);
  return executeOperation(operation, payload);
};

export async function executeSqlServerOperation(operationId, payload = {}) {
  return executeSqlServer(operationId, payload);
}

export async function getSqlServerPersonas() {
  const response = await executeSqlServer("gsSpGetPersonas");
  return response?.gsSpGetPersonas1 || [];
}

export async function getSqlServerPersonaById(idPersona) {
  const response = await executeSqlServer("gsSpGetPersona", { pIdPersona: Number(idPersona) });
  return response?.gsSpGetPersona1?.[0] || null;
}

export async function insertSqlServerPersona(persona) {
  return executeSqlServer("gsSpInsertPersona", cleanInsertPersona(persona));
}

export async function updateSqlServerPersona(persona) {
  return executeSqlServer("gsSpUpdatePersona", cleanUpdatePersona(persona));
}

export async function deleteSqlServerPersona(idPersona) {
  return executeSqlServer("gsSpDeletePersona", { pIdPersona: Number(idPersona) });
}

const cleanInsertPersona = (persona) => ({
  pNombre: persona.nombre || "",
  pApellido: persona.apellido || "",
  pEdad: Number(persona.edad || 0),
  pEmail: persona.email || "",
  pFechaNacimiento: persona.fechaNacimiento || null,
  pActivo: Boolean(persona.activo)
});

const cleanUpdatePersona = (persona) => ({
  pIdPersona: Number(persona.idPersona || 0),
  ...cleanInsertPersona(persona)
});