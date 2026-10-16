# Generate Service Test

**Generate Service Test** es una guía práctica para probar las capacidades de **Generate Service** a partir de esquemas reales de base de datos. El proyecto reúne motores, scripts SQL, archivos de esquema, colecciones de prueba, configuraciones de gateway y una interfaz de validación para que el cliente pueda generar microservicios, consumir sus endpoints y verificar el comportamiento resultante.

Generate Service permite crear microservicios de distintos tipos, como REST, GraphQL, gRPC, SOAP, WebSocket y otros modelos de integración, usando como entrada la estructura y la lógica disponible en una base de datos. En este repositorio el contrato visible para la UI se mantiene como REST, pero el backend generado puede ser REST, GraphQL, gRPC o SOAP. Cuando el backend no es REST, **KrakenD** actúa como una fachada que transforma esas APIs generadas en endpoints REST consumibles por la interfaz de prueba.

## Propósito

El propósito de este proyecto es que un cliente pueda probar Generate Service con escenarios preparados y tomar decisiones técnicas con evidencia. Cada motor incluido contiene una base de datos de prueba, scripts de inicialización y archivos de esquema que representan operaciones publicables como servicios.

Con este material, el cliente puede levantar una base de datos, seleccionar los esquemas que quiere probar, generar el microservicio desde Generate Service y ejecutar los endpoints resultantes desde la UI, desde Postman o desde Kreya, dependiendo del protocolo generado.

También puede extender las pruebas creando sus propios procedimientos, funciones, packages, queries o tipos sobre las bases incluidas, generar nuevos esquemas y validar cómo Generate Service los transforma en servicios consumibles. La misma idea se puede reutilizar en aplicaciones propias: generar APIs desde nuevos objetos de base de datos, exponerlas en REST, GraphQL, gRPC o SOAP, y usar KrakenD para publicar un contrato REST estable que pueda renderizarse desde una UI.

## Qué Permite Probar

- Generación de microservicios a partir de procedimientos, funciones, packages y queries.
- Publicación de operaciones de base de datos como endpoints REST, GraphQL, gRPC y SOAP.
- Transformación de APIs GraphQL, gRPC y SOAP a un contrato REST mediante KrakenD.
- Manejo de parámetros de entrada, salida e `INOUT`.
- Transformación de tipos complejos, arreglos, cursores, JSON, objetos y estructuras tabulares.
- Consumo de los endpoints generados desde una interfaz de prueba, desde Postman o desde Kreya.
- Comparación de escenarios equivalentes en distintos motores de base de datos.
- Validación de la estructura técnica generada: controllers, services, models, repositories y configuración del microservicio.
- Reutilización del patrón para probar APIs generadas desde nuevos schemas o nuevos stored procedures del cliente.

## Cómo Se Alimenta Generate Service

Generate Service puede recibir la información del esquema de dos formas principales.

La primera es mediante un datasource configurado en la plataforma. En este flujo, el usuario configura la conexión a la base de datos, Generate Service lee la metadata disponible y presenta los objetos publicables en una vista tipo árbol multiseleccionable. Desde allí el cliente elige qué procedimientos, funciones, packages o queries quiere transformar en endpoints.

La segunda es mediante archivos de esquema. Este repositorio ya incluye archivos `schemas/` por motor, listos para adjuntarse directamente en Generate Service y generar microservicios con las operaciones existentes en las bases de prueba. Si el cliente quiere publicar un procedimiento, función, package, query o tipo que no está incluido aquí, puede usar el cliente local para generar un nuevo archivo de esquema desde su propia base de datos.

El flujo con cliente local está pensado para clientes con políticas de seguridad que prefieren mantener sus conexiones, credenciales y configuraciones dentro de su propio entorno. Para ese caso, Generate Service ofrece un cliente local descargable como `docker-compose.yml`, que se ejecuta cerca de la base de datos, genera archivos de esquema y permite adjuntarlos después en la plataforma. Lo que viaja hacia Generate Service es el archivo de esquema que el cliente decide usar para generar el microservicio.

## Schemas Incluidos

Cada carpeta `schemas/` contiene archivos de esquema correspondientes a operaciones reales definidas en los scripts SQL del motor. Estos archivos tienen la estructura necesaria para que Generate Service pueda crear los microservicios sin que el cliente tenga que volver a generar el esquema desde el cliente local.

- `mysql/schemas/`: schemas para operaciones MySQL.
- `mariaDb/schemas/`: schemas para operaciones MariaDB compatibles con el flujo MySQL/MariaDB.
- `PostgreSQL/schemas/`: schemas para procedimientos, funciones y queries PostgreSQL.
- `OracleDb/schemas/`: schemas para procedimientos, funciones, packages, queries y tipos Oracle.
- `sqlserver/schemas/`: schemas para procedimientos, funciones y queries SQL Server.

Cuando se necesite probar una operación nueva que no exista en estas carpetas, el cliente puede crearla en la base de datos correspondiente y usar el cliente local de Generate Service para generar el nuevo archivo de esquema.

## Objetivo de KrakenD

KrakenD se usa como gateway de adaptación para que la UI de pruebas pueda consumir siempre un contrato REST bajo `/api/...`, incluso cuando el microservicio generado por Generate Service expone otro protocolo.

El objetivo no es reemplazar el microservicio generado, sino demostrar un patrón reutilizable:

1. Generate Service genera una API REST, GraphQL, gRPC o SOAP a partir del esquema de base de datos.
2. KrakenD recibe las llamadas REST que espera la UI en `http://localhost:8083/api/...`.
3. KrakenD transforma la llamada hacia el backend generado correspondiente.
4. La UI recibe una respuesta JSON normalizada y puede renderizarla como si todo fuera REST.

La carpeta `krakend/` contiene configuraciones separadas para distintos protocolos generados:

- `GraphQLkrakend.json`: fachada REST sobre operaciones GraphQL generadas.
- `Grpckrakend.json`: fachada REST sobre operaciones gRPC generadas, usando Envoy como transcodificador gRPC/JSON.
- `Soapkrakend.json`: fachada REST sobre operaciones SOAP generadas, usando el proxy SOAP incluido.
- `proto/`: descriptor fuente para las pruebas gRPC.
- `envoy/`: configuración para traducir llamadas HTTP/JSON hacia gRPC.
- `soap-proxy/`: adaptador intermedio para invocar servicios SOAP desde KrakenD.
- `scripts/`: transformaciones auxiliares usadas por algunas rutas para normalizar payloads, fechas, arreglos o cuerpos GraphQL.

Con este enfoque, un cliente puede generar sus propios microservicios en el protocolo que necesite y mantener una experiencia homogénea para la UI o para otros consumidores REST. Si se generan nuevos stored procedures, funciones, packages o queries, el mismo patrón se puede repetir: agregar o regenerar el schema, generar la API, ajustar la configuración de KrakenD y validar el endpoint desde la UI.

## Objetivo de Kreya

Kreya se incluye como herramienta de prueba para las APIs gRPC generadas desde el schema de Oracle DB. Mientras la UI consume los endpoints transformados por KrakenD como REST, Kreya permite probar directamente el contrato gRPC generado.

La carpeta `Kreya/generate-service/` contiene un proyecto Kreya con operaciones de `TestDemoGrpcOracleService`. Cada operación tiene su archivo `.krop` y su request JSON asociado, por ejemplo:

- `gsSpGetPersona`
- `gsSpInsertPersona`
- `gsSpCursorInWithOutputs`
- `gsFnCountPersonas`
- `gsQPersonaById`
- `pipePersonas`

Este material sirve para validar que el microservicio gRPC generado responde correctamente contra el esquema Oracle de ejemplo. También sirve como plantilla: si el cliente genera nuevos stored procedures o nuevas operaciones gRPC, puede crear nuevas requests en Kreya siguiendo el mismo formato y probarlas contra su propio servicio generado.

## Contenido del Proyecto

- `mysql/`: scripts, schemas y configuración Docker para MySQL.
- `mariaDb/`: scripts, schemas y configuración Docker para MariaDB compatible con el flujo MySQL/MariaDB.
- `PostgreSQL/`: scripts, schemas y configuración Docker para PostgreSQL.
- `OracleDb/`: scripts, schemas y configuración Docker para Oracle.
- `sqlserver/`: scripts, schemas y configuración Docker para SQL Server.
- `krakend/`: gateway y adaptadores para exponer GraphQL, gRPC y SOAP como endpoints REST consumibles por la UI.
- `Kreya/`: proyecto Kreya con colección gRPC Oracle para probar directamente APIs gRPC generadas.
- `ui_test/`: interfaz de prueba para explorar endpoints, payloads, respuestas y documentación por motor.
- `generate-service-test.postman_collection.json`: colección de Postman para ejecutar escenarios desde un cliente HTTP.

## Flujo de Prueba

1. Levantar el motor de base de datos que se quiere evaluar.
2. Usar los scripts SQL incluidos para inicializar los objetos de prueba.
3. Adjuntar en Generate Service los archivos de `schemas/` incluidos o seleccionar objetos desde un datasource configurado.
4. Generar y descargar el microservicio en el protocolo que se quiere validar: REST, GraphQL, gRPC o SOAP.
5. Si el microservicio generado es REST, consumirlo directamente desde la UI o desde Postman.
6. Si el microservicio generado es GraphQL, gRPC o SOAP, levantar KrakenD con la configuración correspondiente para exponerlo como REST en `http://localhost:8083/api/...`.
7. Probar los endpoints desde `ui_test/`, desde Postman o desde Kreya cuando se quiera validar gRPC directamente.
8. Revisar la documentación de cada operación para entender qué escenario demuestra.

## Puertos y Configuración

La colección de Postman y la interfaz `ui_test/` están configuradas para consumir por defecto endpoints REST en:

```text
http://localhost:8083
```

Ese puerto puede corresponder a un microservicio REST generado directamente o a KrakenD cuando se necesita adaptar GraphQL, gRPC o SOAP hacia REST. Si se ejecuta en otro puerto, se debe actualizar la colección de Postman o configurar la URL base de `ui_test/`, por ejemplo:

```text
API_ENDPOINT_MYSQL=http://localhost:8083
API_ENDPOINT_ORACLE=http://localhost:8083
API_ENDPOINT_POSTGRES=http://localhost:8083
API_ENDPOINT_SQLSERVER=http://localhost:8083
```

La UI de pruebas se ejecuta en el puerto `3033`.

Puertos usados por los adaptadores incluidos:

- `8083`: contrato REST consumido por la UI y por Postman. Puede estar servido por el backend REST generado o por KrakenD.
- `8084`: puerto esperado para el microservicio GraphQL generado en las pruebas Oracle.
- `9090`: puerto esperado para el microservicio gRPC generado en las pruebas Oracle.
- `8085`: puerto esperado para el microservicio SOAP generado en las pruebas Oracle.
- `4000`: proxy SOAP usado por KrakenD para adaptar SOAP a JSON/REST.
- `9901`: panel de administración de Envoy para depuración gRPC.

## Ejecutar la UI de Pruebas

La carpeta `ui_test/` contiene la interfaz **Generate Service Test**. Esta UI permite consumir los endpoints generados, revisar payloads, ver respuestas y consultar documentación de soporte por motor, incluyendo tipos de datos soportados y reglas de generación asociadas a nombres de PL/SQL, procedimientos, funciones, queries y atributos.

La UI siempre espera endpoints REST. Por eso puede conectarse directamente a un microservicio REST generado o a KrakenD cuando el backend generado sea GraphQL, gRPC o SOAP.

Requisitos recomendados:

- Node.js `20.x`.
- npm `10.x`.

Comandos de arranque:

```powershell
cd ui_test
npm install
npm run dev
```

La aplicación queda disponible en:

```text
http://localhost:3033
```

## Flujo Visual

### 1. Entrada a Generate Service

La pantalla principal presenta los tipos de servicios e integraciones que puede generar la plataforma, junto con los motores soportados para construir microservicios orientados a datos.

![Entrada a Generate Service](docs/images/generate-service/01_home.png)

### 2. Selección Desde Datasource

Cuando el cliente trabaja con un datasource configurado, Generate Service muestra los objetos de base de datos disponibles en una vista jerárquica. Desde este árbol se pueden seleccionar procedimientos, funciones y packages para publicarlos como endpoints.

![Selección de objetos desde datasource](docs/images/generate-service/02_datasource_selection.png)

### 3. Endpoints Seleccionados Desde Datasource

Los objetos seleccionados quedan registrados como operaciones que formarán parte del microservicio generado. En este punto el cliente puede revisar nombres, origen, método y configuración antes de iniciar la generación.

![Endpoints seleccionados desde datasource](docs/images/generate-service/03_endpoints_from_datasource.png)

### 4. Descarga del Microservicio Generado

Al finalizar la generación, Generate Service entrega el microservicio como un archivo descargable. Ese paquete contiene los componentes necesarios para compilar, ejecutar y probar el servicio generado.

![Descarga del microservicio generado](docs/images/generate-service/04_generated_service_download.png)

### 5. Descarga del Cliente Local

Generate Service permite descargar el artefacto necesario para ejecutar el cliente local. Este artefacto se entrega como `docker-compose.yml`, facilitando que el cliente levante la herramienta dentro de su propio entorno.

![Descarga del cliente local](docs/images/generate-service/05_download_local_client.png)

### 6. Generación Local de Esquemas

El cliente local permite conectarse a una base de datos dentro del entorno del cliente, seleccionar el motor y generar el archivo de esquema correspondiente. Las credenciales y la configuración de conexión permanecen localmente.

![Generación local de esquemas](docs/images/generate-service/06_local_client_schema_generation.png)

### 7. Carga de Archivo de Esquema

El archivo de esquema generado localmente puede adjuntarse en Generate Service como fuente para la generación. Cada archivo representa una operación o estructura publicable como endpoint.

![Carga de archivo de esquema](docs/images/generate-service/07_schema_file_upload.png)

### 8. Endpoint Desde Archivo de Esquema

Una vez registrado el archivo, Generate Service lo incorpora como una operación lista para generar dentro del microservicio, manteniendo visible el método, el origen, el nombre del endpoint y el archivo asociado.

![Endpoint generado desde archivo de esquema](docs/images/generate-service/08_endpoints_from_schema_file.png)

### 9. Estructura del Microservicio

El microservicio descargado incluye una estructura técnica lista para desarrollo y validación, con capas como controller, service, model, repository y configuración de aplicación.

![Estructura del microservicio generado](docs/images/generate-service/09_generated_microservice_structure.png)

### 10. UI de Pruebas Generate Service Test

La interfaz incluida en `ui_test/` permite ejecutar los endpoints generados por motor, inspeccionar payloads y respuestas, y consultar documentación sobre capacidades soportadas, tipos de datos y reglas de generación.

![UI de pruebas Generate Service Test](docs/images/generate-service/10_generate_service_test_ui.png)

## Para Quién Sirve

Este repositorio está pensado para:

- Clientes que quieren probar Generate Service con bases y esquemas preparados.
- Equipos técnicos que necesitan comprobar capacidades reales antes de adoptar una solución.
- Desarrolladores que quieren entender cómo una operación de base de datos se convierte en un endpoint consumible.
- Arquitectos que deben evaluar alternativas para publicar lógica de datos como microservicios.
- Organizaciones que necesitan probar un flujo donde las conexiones y credenciales puedan mantenerse dentro de su entorno local.

## Reutilización del Concepto

El material incluido no está limitado a los ejemplos Oracle, MySQL, MariaDB, PostgreSQL o SQL Server del repositorio. El cliente puede reutilizar el concepto completo en sus propias aplicaciones generadas:

1. Crear o seleccionar nuevos objetos de base de datos.
2. Generar nuevos archivos de schema desde Generate Service o desde el cliente local.
3. Generar una API REST, GraphQL, gRPC o SOAP.
4. Probar el protocolo nativo con la herramienta adecuada: Postman para REST/GraphQL, Kreya para gRPC o clientes SOAP cuando aplique.
5. Exponer el contrato esperado por la UI mediante KrakenD si el protocolo generado no es REST.
6. Agregar el endpoint a la UI de prueba para validar payload, respuesta y documentación funcional.

## Resultado Esperado

Al terminar el recorrido, el cliente debe poder levantar una base de datos de prueba, generar un microservicio desde Generate Service, ejecutar sus endpoints y comprobar cómo la plataforma transforma esquemas y operaciones complejas en servicios listos para integrarse en una solución real.

Además, debe poder entender cómo reutilizar el patrón con sus propios schemas y APIs generadas: usar REST directamente cuando aplique, usar Kreya para validar gRPC nativo y usar KrakenD para adaptar GraphQL, gRPC o SOAP a REST cuando se necesite renderizar o consumir todo desde la misma UI.
