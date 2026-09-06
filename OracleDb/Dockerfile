FROM wnameless/oracle-xe-11g-r2

RUN mkdir -p /scripts

COPY init/* /scripts/

RUN mv /scripts/init.sql /docker-entrypoint-initdb.d/init.sql
