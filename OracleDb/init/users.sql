CREATE USER test identified by 123456;
GRANT CONNECT TO test;
GRANT ALL PRIVILEGES TO test;
/
ALTER DATABASE
DATAFILE '/u01/app/oracle/oradata/XE/system.dbf' 
RESIZE 900m;
/

   



