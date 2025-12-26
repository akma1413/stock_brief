-- Add show_sources column to user_settings table
alter table "public"."user_settings" add column "show_sources" boolean not null default true;
