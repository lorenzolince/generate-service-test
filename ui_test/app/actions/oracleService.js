"use server";

import { findOracleOperation } from "../catalog/oracleOperations";
import { executeOperation } from "./operationService";

const executeOracle = async (operationId, payload = {}) => {
  const operation = findOracleOperation(operationId);
  return executeOperation(operation, payload);
};

export async function executeOracleOperation(operationId, payload = {}) {
  return executeOracle(operationId, payload);
}

export async function getOraclePersonas() {
  const response = await executeOracle("gsSpGetPersonas");
  return response?.pPersonas || [];
}

export async function getOraclePersonaById(idPersona) {
  const response = await executeOracle("gsSpGetPersona", { pIdPersona: Number(idPersona) });
  return response?.pPersona || null;
}

export async function insertOraclePersona(persona) {
  return executeOracle("gsSpInsertPersona", { pPersona: cleanPersona(persona) });
}

export async function updateOraclePersona(persona) {
  return executeOracle("gsSpUpdatePersona", { pPersona: cleanPersona(persona) });
}

export async function deleteOraclePersona(idPersona) {
  return executeOracle("gsSpDeletePersona", { pIdPersona: Number(idPersona) });
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
