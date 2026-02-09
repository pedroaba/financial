CREATE TYPE "public"."finance_transaction_type" AS ENUM('income', 'expense', 'savings');--> statement-breakpoint
CREATE TABLE "finance_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "finance_transaction_type" NOT NULL,
	"category_id" uuid,
	"bucket_id" uuid,
	"amount" numeric(14, 2) NOT NULL,
	"description" text,
	"occurred_at" timestamp with time zone NOT NULL,
	"merchant" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_category_id_finance_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."finance_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finance_transactions" ADD CONSTRAINT "finance_transactions_bucket_id_finance_investment_buckets_id_fk" FOREIGN KEY ("bucket_id") REFERENCES "public"."finance_investment_buckets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "finance_transactions_user_occurred_idx" ON "finance_transactions" USING btree ("user_id","occurred_at");--> statement-breakpoint
CREATE INDEX "finance_transactions_user_category_idx" ON "finance_transactions" USING btree ("user_id","category_id");--> statement-breakpoint
CREATE INDEX "finance_transactions_user_bucket_idx" ON "finance_transactions" USING btree ("user_id","bucket_id");