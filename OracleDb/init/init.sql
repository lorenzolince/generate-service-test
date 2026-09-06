SET DEFINE ON
SET SERVEROUTPUT ON
SET SQLBLANKLINES ON
WHENEVER SQLERROR EXIT SQL.SQLCODE

PROMPT Configuring Oracle test user...
@/scripts/users.sql

CONNECT test/123456

SET DEFINE ON
SET SERVEROUTPUT ON
SET SQLBLANKLINES ON
WHENEVER SQLERROR EXIT SQL.SQLCODE

PROMPT Preparing Generate Service init control table...
BEGIN
    EXECUTE IMMEDIATE '
        CREATE TABLE GS_INIT_CONTROL (
            SCRIPT_NAME VARCHAR2(128) NOT NULL,
            EXECUTED_AT TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
            CONSTRAINT PK_GS_INIT_CONTROL PRIMARY KEY (SCRIPT_NAME)
        )';
EXCEPTION
    WHEN OTHERS THEN
        IF SQLCODE != -955 THEN
            RAISE;
        END IF;
END;
/

COLUMN gs_data_script NEW_VALUE gs_data_script NOPRINT
SELECT CASE
           WHEN (
               (SELECT COUNT(*) FROM GS_INIT_CONTROL WHERE SCRIPT_NAME = 'generate_service_oracle_test_suite.sql') +
               (SELECT COUNT(*) FROM USER_TABLES WHERE TABLE_NAME = 'GS_PERSONA')
           ) > 0 THEN 'noop.sql'
           ELSE 'generate_service_oracle_test_suite.sql'
       END AS gs_data_script
  FROM DUAL;

PROMPT Running Generate Service Oracle dataset when needed...
@/scripts/&gs_data_script

SET DEFINE ON

MERGE INTO GS_INIT_CONTROL dst
USING (SELECT 'generate_service_oracle_test_suite.sql' AS SCRIPT_NAME FROM DUAL) src
    ON (dst.SCRIPT_NAME = src.SCRIPT_NAME)
 WHEN NOT MATCHED THEN
        INSERT (SCRIPT_NAME) VALUES (src.SCRIPT_NAME);
COMMIT;
