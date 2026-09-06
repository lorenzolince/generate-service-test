"use server";

const DEFAULT_API_ENDPOINT = "http://localhost:8083";

const ENGINE_DEFAULT_API_ENDPOINTS = {
  oracle: "http://localhost:8083",
  mysql: "http://localhost:8083",
  sqlserver: "http://localhost:8083",
  postgres: "http://localhost:8083"
};

const ENGINE_ENDPOINT_ENV_KEYS = {
  oracle: ["API_ENDPOINT_ORACLE", "ORACLE_API_ENDPOINT", "NEXT_PUBLIC_API_ENDPOINT_ORACLE", "NEXT_PUBLIC_ORACLE_API_ENDPOINT"],
  mysql: ["API_ENDPOINT_MYSQL", "MYSQL_API_ENDPOINT", "NEXT_PUBLIC_API_ENDPOINT_MYSQL", "NEXT_PUBLIC_MYSQL_API_ENDPOINT"],
  sqlserver: ["API_ENDPOINT_SQLSERVER", "SQLSERVER_API_ENDPOINT", "NEXT_PUBLIC_API_ENDPOINT_SQLSERVER", "NEXT_PUBLIC_SQLSERVER_API_ENDPOINT"],
  postgres: ["API_ENDPOINT_POSTGRES", "POSTGRES_API_ENDPOINT", "NEXT_PUBLIC_API_ENDPOINT_POSTGRES", "NEXT_PUBLIC_POSTGRES_API_ENDPOINT"]
};

const resolveBaseApiEndpoint = (engine = "oracle") => {
  const endpoint = getEngineEndpoint(engine);
  return endpoint.replace(/\/$/, "");
};

const getEngineEndpoint = (engine) => {
  const engineEndpoint = ENGINE_ENDPOINT_ENV_KEYS[engine]
    ?.map((key) => process.env[key])
    .find(Boolean);

  return engineEndpoint || process.env.API_ENDPOINT || process.env.NEXT_PUBLIC_API_ENDPOINT || ENGINE_DEFAULT_API_ENDPOINTS[engine] || DEFAULT_API_ENDPOINT;
};

export async function getBaseApiEndpoint(engine) {
  return resolveBaseApiEndpoint(engine);
}

export async function executeOperation(operation, payload = {}) {
  if (!operation) {
    throw new Error("Operation is required");
  }

  const requestOptions = {
    method: operation.method || "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (operation.hasRequestBody) {
    requestOptions.body = JSON.stringify(payload || {});
  }

  const response = await fetch(`${resolveBaseApiEndpoint(operation.engine)}${operation.path}`, requestOptions);
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || `HTTP ${response.status}`);
  }

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    return responseText;
  }
}
