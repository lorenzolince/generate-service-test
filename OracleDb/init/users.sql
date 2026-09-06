SET SERVEROUTPUT ON

DECLARE
	PROCEDURE ensure_user(p_username IN VARCHAR2, p_password IN VARCHAR2) IS
		user_count NUMBER;
	BEGIN
		SELECT COUNT(*)
		  INTO user_count
		  FROM ALL_USERS
		 WHERE USERNAME = UPPER(p_username);

		IF user_count = 0 THEN
			EXECUTE IMMEDIATE 'CREATE USER ' || p_username || ' IDENTIFIED BY ' || p_password;
		ELSE
			EXECUTE IMMEDIATE 'ALTER USER ' || p_username || ' IDENTIFIED BY ' || p_password || ' ACCOUNT UNLOCK';
		END IF;
	END;
BEGIN
	ensure_user('test', '123456');
END;
/

GRANT CONNECT TO test;
GRANT ALL PRIVILEGES TO test;

DECLARE
	datafile_name VARCHAR2(512) := '/u01/app/oracle/oradata/XE/system.dbf';
	target_size_bytes CONSTANT NUMBER := 943718400;
	current_size_bytes NUMBER;
BEGIN
	SELECT BYTES
	  INTO current_size_bytes
	  FROM DBA_DATA_FILES
	 WHERE FILE_NAME = datafile_name;

	IF current_size_bytes < target_size_bytes THEN
		EXECUTE IMMEDIATE 'ALTER DATABASE DATAFILE ''' || datafile_name || ''' RESIZE 900M';
	END IF;
END;
/
