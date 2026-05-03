CREATE TABLE `action_plan_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`week` int NOT NULL,
	`day` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`completed` int NOT NULL DEFAULT 0,
	`priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `action_plan_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics_financial` (
	`id` int AUTO_INCREMENT NOT NULL,
	`revenue` varchar(64),
	`ebitda` varchar(64),
	`grants` varchar(64),
	`sponsorships` varchar(64),
	`valuation` varchar(64),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metrics_financial_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics_impact` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lives_touched` varchar(64),
	`healthcare_cost_saved` varchar(64),
	`open_source_contributors` varchar(64),
	`countries_with_free_access` varchar(64),
	`research_publications` varchar(64),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metrics_impact_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics_technical` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fhir_transactions_annual` varchar(64),
	`api_calls_annual` varchar(64),
	`data_stored` varchar(64),
	`uptime` varchar(64),
	`latency` varchar(64),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `metrics_technical_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repositories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`github_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`full_name` varchar(255) NOT NULL,
	`description` text,
	`url` varchar(512) NOT NULL,
	`visibility` enum('public','private') NOT NULL,
	`language` varchar(64),
	`last_updated` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`synced_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `repositories_id` PRIMARY KEY(`id`),
	CONSTRAINT `repositories_github_id_unique` UNIQUE(`github_id`)
);
--> statement-breakpoint
CREATE TABLE `repository_intelligence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`repository_id` int NOT NULL,
	`purpose` text,
	`category` varchar(64),
	`health_score` int,
	`tags` varchar(512),
	`generated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `repository_intelligence_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `repository_stats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`repository_id` int NOT NULL,
	`star_count` int NOT NULL DEFAULT 0,
	`fork_count` int NOT NULL DEFAULT 0,
	`open_issues_count` int NOT NULL DEFAULT 0,
	`watchers` int NOT NULL DEFAULT 0,
	`last_commit_date` timestamp,
	`commit_count` int NOT NULL DEFAULT 0,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `repository_stats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `repository_intelligence` ADD CONSTRAINT `repository_intelligence_repository_id_repositories_id_fk` FOREIGN KEY (`repository_id`) REFERENCES `repositories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `repository_stats` ADD CONSTRAINT `repository_stats_repository_id_repositories_id_fk` FOREIGN KEY (`repository_id`) REFERENCES `repositories`(`id`) ON DELETE no action ON UPDATE no action;