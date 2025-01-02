CREATE TABLE "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp1" timestamp DEFAULT now() NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "customerId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customerId_customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;