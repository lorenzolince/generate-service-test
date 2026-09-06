FROM mcr.microsoft.com/mssql/server:2017-latest

WORKDIR /usr/config

COPY generate_service_sqlserver_test_suite.sql /usr/config/generate_service_sqlserver_test_suite.sql

RUN printf '%s\n' \
	'#!/bin/bash' \
	'set -e' \
	'SQLCMD="/opt/mssql-tools/bin/sqlcmd"' \
	'SQLCMD_EXTRA_ARGS=""' \
	'if [ -x /opt/mssql-tools18/bin/sqlcmd ]; then' \
	'    SQLCMD="/opt/mssql-tools18/bin/sqlcmd"' \
	'    SQLCMD_EXTRA_ARGS="-C"' \
	'fi' \
	'echo "Waiting for SQL Server..."' \
	'STATUS=1' \
	'i=0' \
	'set +e' \
	'while [ "$STATUS" -ne 0 ] && [ "$i" -lt 60 ]; do' \
	'    i=$((i + 1))' \
	'    "$SQLCMD" $SQLCMD_EXTRA_ARGS -t 1 -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" >/dev/null 2>&1' \
	'    STATUS=$?' \
	'    if [ "$STATUS" -ne 0 ]; then sleep 1; fi' \
	'done' \
	'set -e' \
	'if [ "$STATUS" -ne 0 ]; then' \
	'    echo "Error: MSSQL SERVER took more than sixty seconds to start up."' \
	'    exit 1' \
	'fi' \
	'echo "======= MSSQL SERVER STARTED ========"' \
	'"$SQLCMD" $SQLCMD_EXTRA_ARGS -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -Q "IF DB_ID(N'\''test'\'') IS NULL CREATE DATABASE [test];"' \
	'INIT_STATUS=$("$SQLCMD" $SQLCMD_EXTRA_ARGS -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d test -h -1 -W -Q "SET NOCOUNT ON; IF OBJECT_ID(N'\''dbo.GS_PERSONA'\'', N'\''U'\'') IS NULL SELECT 0 ELSE SELECT 1;" | tr -d "[:space:]")' \
	'if [ "$INIT_STATUS" = "1" ]; then' \
	'    echo "generate_service_sqlserver_test_suite.sql already initialized; skipping."' \
	'else' \
	'    "$SQLCMD" $SQLCMD_EXTRA_ARGS -S localhost -U sa -P "$MSSQL_SA_PASSWORD" -d test -i /usr/config/generate_service_sqlserver_test_suite.sql' \
	'fi' \
	'echo "======= MSSQL CONFIG COMPLETE ======="' \
	> /usr/config/configure-db.sh \
	&& chmod +x /usr/config/configure-db.sh

EXPOSE 1433

CMD /bin/bash -c "/usr/config/configure-db.sh & /opt/mssql/bin/sqlservr"


