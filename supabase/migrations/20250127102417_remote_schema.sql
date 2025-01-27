

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";








ALTER SCHEMA "public" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Etf" (
    "id" integer NOT NULL,
    "etf_symbol" "text" NOT NULL,
    "etf_name" "text" NOT NULL,
    "crypto_name" "text" NOT NULL,
    "crypto_symbol" "text" NOT NULL,
    "company_name" "text" NOT NULL
);


ALTER TABLE "public"."Etf" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Etf_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Etf_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Etf_id_seq" OWNED BY "public"."Etf"."id";



CREATE TABLE IF NOT EXISTS "public"."Transaction" (
    "id" integer NOT NULL,
    "etf_id" integer NOT NULL,
    "amount" double precision NOT NULL,
    "date" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Transaction" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."Transaction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Transaction_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."Transaction_id_seq" OWNED BY "public"."Transaction"."id";



CREATE TABLE IF NOT EXISTS "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."_prisma_migrations" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Etf" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Etf_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Transaction" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Transaction_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Etf"
    ADD CONSTRAINT "Etf_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "unique_etf_date" UNIQUE ("etf_id", "date");



CREATE UNIQUE INDEX "Etf_etf_symbol_key" ON "public"."Etf" USING "btree" ("etf_symbol");



CREATE UNIQUE INDEX "Transaction_etf_id_date_key" ON "public"."Transaction" USING "btree" ("etf_id", "date");



CREATE INDEX "idx_etf_symbol_company" ON "public"."Etf" USING "btree" ("etf_symbol", "company_name");



ALTER TABLE ONLY "public"."Transaction"
    ADD CONSTRAINT "Transaction_etf_id_fkey" FOREIGN KEY ("etf_id") REFERENCES "public"."Etf"("id") ON UPDATE CASCADE ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;



























































































































































































































RESET ALL;
