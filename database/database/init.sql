CREATE ROLE somedev PASSWORD 'some_password' NOSUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;
CREATE DATABASE some_project;
GRANT ALL PRIVILEGES ON DATABASE some_project TO somedev;
CREATE SCHEMA public AUTHORIZATION somedev;