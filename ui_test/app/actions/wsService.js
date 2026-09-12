import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WS_BASE_URL = "http://localhost:8080";
const WS_URL = `${WS_BASE_URL}/clientesw`;

let stompClient;
let connected = false;
let globalCallback = null;

/**
 * Inicializa la conexión STOMP si no está activa
 */
async function ensureConnection() {
  if (connected) return true;
  return new Promise((resolve, reject) => {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        connected = true;
        console.log("Conectado a STOMP");

        // Suscripción global al canal de clientes
        stompClient.subscribe("/topic/getAllClient", (message) => {
          const data = JSON.parse(message.body).getAllClientOut;
          if (globalCallback) {
            globalCallback(data); // 🔑 actualiza automáticamente
          }
        });

        resolve(true);
      },
      onStompError: (frame) => {
        console.error("Error STOMP:", frame.headers["message"]);
        reject(frame);
      },
    });
    stompClient.activate();
  });
}

/**
 * Utilidad para request-response en un topic específico
 */
function requestResponse(destination, body, topic) {
  return new Promise((resolve) => {
    const subscription = stompClient.subscribe(topic, (message) => {
      subscription.unsubscribe();
      resolve(JSON.parse(message.body));
    });
    stompClient.publish({
      destination,
      body: body ? JSON.stringify(body) : "",
    });
  });
}

// ------------------- API homologada -------------------

export async function getAllApi(callback) {
  await ensureConnection();
  if (callback) {
    globalCallback = callback; // 🔑 guardamos callback para actualizaciones reactivas
  }
  const data = await requestResponse("/app/getAllClient", null, "/topic/getAllClient");
  return data.getAllClientOut;
}

export async function getApi(id) {
  await ensureConnection();
  const data = await requestResponse("/app/getClientById", { pId: id }, "/topic/getClientById");
  return data.pClient;
}

export async function getApiByName(name) {
  await ensureConnection();
  const data = await requestResponse("/app/getClientByName", { name }, "/topic/getClientByName");
  return data.getClientByNameQuery;
}

export async function saveApi(client) {
  await ensureConnection();
  stompClient.publish({
    destination: "/app/insertClient",
    body: JSON.stringify({ pClient: client }),
  });
  return 200;
}

export async function saveMultipleApi(clients) {
  await ensureConnection();
  stompClient.publish({
    destination: "/app/insertMultipleClient",
    body: clients,
  });
  return 200;
}

export async function deleteApi(id) {
  await ensureConnection();
  const data = await requestResponse("/app/deleteClient", { pId: id }, "/topic/deleteClient");
  return data.status || "OK";
}

export async function updateApi(client) {
  await ensureConnection();
  stompClient.publish({
    destination: "/app/updateClient",
    body: JSON.stringify({ pClient: client }),
  });
  return 200;
}