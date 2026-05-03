# Digital Health Dashboard - Project TODO

## Database & Schema
- [x] Create repositories table with GitHub metadata
- [x] Create repository_stats table for cached GitHub stats
- [x] Create repository_intelligence table for LLM summaries and scores
- [x] Create metrics_technical table for KPI data
- [x] Create metrics_financial table for revenue/valuation data
- [x] Create metrics_impact table for lives touched, cost saved, etc.
- [x] Create action_plan_items table for 30-day milestones

## Backend - GitHub Integration
- [x] Implement GitHub API client for fetching public repos
- [x] Implement repository stats fetcher (stars, commits, issues)
- [x] Implement LLM-powered repo intelligence (purpose, category, health score)
- [x] Create tRPC procedure to sync repositories from GitHub
- [x] Create tRPC procedure to fetch cached repository data with filtering
- [x] Create tRPC procedure to search repositories by name/description
- [x] Create tRPC procedure to filter by category tags

## Backend - Metrics & Action Plan
- [x] Create tRPC procedure to fetch technical metrics
- [x] Create tRPC procedure to fetch financial metrics
- [x] Create tRPC procedure to fetch impact metrics
- [x] Create tRPC procedure to fetch action plan items

## Frontend - Design System
- [x] Define cyberpunk color palette (dark backgrounds, neon accents)
- [x] Create global CSS variables for neon colors
- [x] Design sidebar navigation component
- [x] Create dashboard layout wrapper with sidebar

## Frontend - Pages & Components
- [x] Implement Repos page with repository browser
- [x] Implement repository filtering by category
- [x] Implement repository search functionality
- [x] Implement Metrics page (Technical KPIs)
- [x] Implement Financial Metrics panel
- [x] Implement Impact Metrics panel
- [x] Implement Action Plan Tracker page
- [x] Implement Foundation Overview page
- [x] Create repository card component with neon styling

## Testing
- [x] Write tests for GitHub API integration
- [ ] Write tests for LLM intelligence generation
- [x] Write tests for repository filtering and search
- [x] Write tests for metrics data fetching
- [x] Write tests for action plan tracking

## Deployment
- [ ] Create public GitHub repository
- [ ] Push all files to GitHub
- [ ] Test all dashboard features
- [ ] Verify GitHub API integration works
- [ ] Verify LLM intelligence generation works
