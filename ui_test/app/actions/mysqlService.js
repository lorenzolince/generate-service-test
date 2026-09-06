"use server";

import { findMysqlOperation } from "../catalog/mysqlOperations";
import { executeOperation } from "./operationService";

const executeMysql = async (operationId, payload = {}) => {
  const operation = findMysqlOperation(operationId);
  return executeOperation(operation, payload);
};

export async function executeMysqlOperation(operationId, payload = {}) {
  return executeMysql(operationId, payload);
}

export async function getMysqlPersonas() {
  const response = await executeMysql("gsSpGetAllPersonas");
  return response?.gsSpGetAllPersonas1 || [];
}

export async function getMysqlPersonaById(idPersona) {
  const response = await executeMysql("gsSpGetPersona", { pIdPersona: Number(idPersona) });
  return response?.gsSpGetPersona1?.[0] || null;
}

export async function insertMysqlPersona(persona) {
  return executeMysql("gsSpInsertPersona", toMysqlPersonaPayload(persona));
}

export async function updateMysqlPersona(persona) {
  return executeMysql("gsSpUpdatePersona", toMysqlPersonaPayload(persona, true));
}

export async function deleteMysqlPersona(idPersona) {
  return executeMysql("gsQDeletePersona", { idPersona: Number(idPersona) });
}

const toMysqlPersonaPayload = (persona, includeId = false) => {
  const payload = {
    pNombre: persona.nombre || "",
    pApellido: persona.apellido || "",
    pEdad: Number(persona.edad || 0),
    pEmail: persona.email || "",
    pFechaNacimiento: persona.fechaNacimiento || null,
    pActivo: Boolean(persona.activo)
  };

  if (includeId) {
    payload.pIdPersona = Number(persona.idPersona || 0);
  }

  return payload;
};
