
FROM mcr.microsoft.com/mssql/server:2017-latest
MAINTAINER Lorenzo Lince<lorenzolince@gmail.com>
# Create a config directory
RUN mkdir -p /usr/config
WORKDIR /usr/config

# Bundle config source
COPY . /usr/config
RUN echo '#!/bin/bash' > configure-db.sh
RUN echo 'echo $MSSQL_SA_PASSWORD' >> configure-db.sh
RUN echo 'export STATUS=1' >> configure-db.sh
RUN echo 'i=0' >> configure-db.sh
RUN echo 'while [[ $STATUS -ne 0 ]] && [[ $i -lt 30 ]]; do' >> configure-db.sh
RUN echo 'i=$i+1' >> configure-db.sh
RUN echo 'echo "################################## MSSQL_SA_PASSWORD ####################################"' >> configure-db.sh
RUN echo 'sleep 1' >> configure-db.sh
RUN echo '/opt/mssql-tools/bin/sqlcmd -t 1 -U sa -P $MSSQL_SA_PASSWORD -Q "select 1" >> /dev/null' >> configure-db.sh
RUN echo 'STATUS=$?' >> configure-db.sh
RUN echo 'done' >> configure-db.sh
RUN echo 'if [ $STATUS -ne 0 ]; then' >> configure-db.sh
RUN echo 'echo "Error: MSSQL SERVER took more than thirty seconds to start up."' >> configure-db.sh
RUN echo 'exit 1' >> configure-db.sh
RUN echo 'fi' >> configure-db.sh
RUN echo 'echo "======= MSSQL SERVER STARTED ========" ' >> configure-db.sh
RUN echo '/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P $MSSQL_SA_PASSWORD -i SQLSERVER_TEST.sql' >> configure-db.sh
RUN echo 'echo "======= MSSQL CONFIG COMPLETE =======" ' >> configure-db.sh
# Grant permissions for to our scripts to be executable
RUN chmod +x /usr/config/entrypoint.sh
RUN chmod +x /usr/config/configure-db.sh
RUN ls
EXPOSE 1433
CMD /bin/bash ./entrypoint.sh


