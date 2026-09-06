"use server";

import { findPostgresOperation } from "../catalog/postgresOperations";
import { executeOperation } from "./operationService";

const executePostgres = async (operationId, payload = {}) => {
  const operation = findPostgresOperation(operationId);
  return executeOperation(operation, payload);
};

export async function executePostgresOperation(operationId, payload = {}) {
  return executePostgres(operationId, payload);
}

export async function getPostgresPersonas() {
  const response = await executePostgres("gsSpGetPersonas");
  return response?.pPersonas || [];
}

export async function getPostgresPersonaById(idPersona) {
  const response = await executePostgres("gsSpGetPersona", { pIdPersona: Number(idPersona) });
  return response?.pPersona || null;
}

export async function insertPostgresPersona(persona) {
  return executePostgres("gsSpInsertPersona", { pPersona: cleanPersona(persona) });
}

export async function updatePostgresPersona(persona) {
  return executePostgres("gsSpUpdatePersona", { pPersona: cleanPersona(persona) });
}

export async function deletePostgresPersona(idPersona) {
  return executePostgres("gsSpDeletePersona", { pIdPersona: Number(idPersona) });
}

const cleanPersona = (persona) => {
  const cleanValue = {
    idPersona: Number(persona.idPersona || 0),
    nombre: persona.nombre || "",
    apellido: persona.apellido || "",
    edad: Number(persona.edad || 0),
    email: persona.email || "",
    fechaNacimiento: persona.fechaNacimiento || null,
    activo: Boolean(persona.activo)
  };

  if (persona.fechaRegistro) {
    cleanValue.fechaRegistro = persona.fechaRegistro;
  }

  return cleanValue;
};