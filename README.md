# Digital Health Dashboard Orchestrator

A **dark cyberpunk-themed dashboard** for the **Global Digital Health Foundation**, featuring real-time GitHub repository monitoring, LLM-powered intelligence, and comprehensive metrics tracking.

## 🌐 Features

### Repository Browser
- **Real-time GitHub Integration**: Fetches all public repositories from the onegayunicorn organization
- **LLM-Powered Intelligence**: Automatically generates purpose summaries, category suggestions, and health scores for each repository
- **Advanced Filtering**: Filter repositories by category (quantum, health, AI, telecom, infrastructure, data, security, web, mobile)
- **Search Functionality**: Search repositories by name, description, or full name
- **Cached Statistics**: Stores GitHub stats (stars, forks, issues, commits) in the database for efficient dashboard display

### Metrics Dashboard
- **Technical Metrics**: FHIR transactions, API calls, data storage, uptime, and latency
- **Financial Metrics**: Revenue, EBITDA, grants, sponsorships, and valuation targets
- **Impact Metrics**: Lives touched, healthcare cost saved, open-source contributors, countries with free access, and research publications

### Action Plan Tracker
- **30-Day Milestone Tracking**: Week-by-week execution plan with completion status
- **Priority Levels**: High, medium, and low priority indicators
- **Progress Visualization**: Real-time progress bars and completion counts

### Foundation Overview
- **Mission Statement**: Core purpose and vision of the Global Digital Health Foundation
- **Core Pillars**: Global access, open source, quantum-ready, community-driven, patient-centric, impact-focused
- **Technical Infrastructure**: Repository count, applications, AI agents, and bots
- **Legal Structure**: Nonprofit foundation + two for-profit entities
- **Market Opportunity**: Addressable market and competitive advantages
- **Financial Projections**: 5-year growth targets

## 🎨 Design System

### Cyberpunk Aesthetic
- **Dark Background**: Deep purple/blue theme (`oklch(0.08 0.01 280)`)
- **Neon Accents**: Four primary neon colors
  - **Cyan** (`oklch(0.75 0.3 200)`): Primary accent
  - **Magenta** (`oklch(0.7 0.3 330)`): Secondary accent
  - **Lime** (`oklch(0.8 0.3 130)`): Success/positive indicator
  - **Purple** (`oklch(0.7 0.3 290)`): Interactive elements

### Components
- **Sidebar Navigation**: Collapsible sidebar with four main sections
- **Neon Glow Effects**: Box shadows and borders with neon colors
- **Responsive Grid**: Mobile-first responsive design
- **Dark Cards**: Semi-transparent cards with neon borders

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **tRPC** for type-safe API calls
- **Wouter** for client-side routing
- **Shadcn/UI** components

### Backend
- **Express.js** server
- **tRPC** procedures for data fetching and mutations
- **Drizzle ORM** for database management
- **GitHub API** integration for repository data
- **LLM Integration** for repository intelligence

### Database
- **MySQL/TiDB** for persistent storage
- **Tables**: repositories, repository_stats, repository_intelligence, metrics_technical, metrics_financial, metrics_impact, action_plan_items

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm package manager
- MySQL/TiDB database
- GitHub personal access token (for API access)

### Installation

```bash
# Clone the repository
git clone https://github.com/onegayunicorn/digital-health-dashboard-orchestrator.git
cd digital-health-dashboard-orchestrator

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run migrations
pnpm drizzle-kit migrate

# Start development server
pnpm dev
```

### Environment Variables
```env
DATABASE_URL=mysql://user:password@localhost:3306/dhfo_dashboard
JWT_SECRET=your-secret-key
VITE_APP_ID=your-oauth-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

## 📊 API Endpoints

### Repositories
- `GET /api/trpc/repos.list` - List all repositories
- `POST /api/trpc/repos.syncRepositories` - Sync repositories from GitHub
- `POST /api/trpc/repos.search` - Search repositories
- `POST /api/trpc/repos.filterByCategory` - Filter by category
- `POST /api/trpc/repos.filterByTags` - Filter by tags

### Metrics
- `GET /api/trpc/metrics.getTechnical` - Get technical metrics
- `GET /api/trpc/metrics.getFinancial` - Get financial metrics
- `GET /api/trpc/metrics.getImpact` - Get impact metrics
- `GET /api/trpc/metrics.getActionPlan` - Get action plan items

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage
```

## 📁 Project Structure

```
digital-health-dashboard-orchestrator/
├── client/                          # Frontend React application
│   ├── src/
│   │   ├── pages/                  # Page components
│   │   ├── components/             # Reusable components
│   │   ├── lib/                    # Utilities and helpers
│   │   ├── App.tsx                 # Main app component
│   │   └── index.css               # Global styles with cyberpunk theme
│   └── index.html
├── server/                          # Backend Express server
│   ├── routers/                    # tRPC routers
│   ├── github.ts                   # GitHub API client
│   ├── llm-intelligence.ts         # LLM-powered intelligence
│   ├── db.ts                       # Database queries
│   └── routers.ts                  # Main router
├── drizzle/                         # Database schema and migrations
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # SQL migrations
├── shared/                          # Shared types and constants
├── package.json
├── tsconfig.json
└── README.md
```

## 🔄 Data Flow

1. **Repository Sync**: Click "Sync Repositories" to fetch from GitHub
2. **GitHub API**: Fetches repository metadata and statistics
3. **LLM Intelligence**: Generates purpose, category, and health score
4. **Database Caching**: Stores all data for efficient retrieval
5. **Dashboard Display**: Renders repositories with filtering and search

## 🛠️ Development

### Adding New Features
1. Update database schema in `drizzle/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Apply migration: `pnpm drizzle-kit migrate`
4. Add database queries in `server/db.ts`
5. Create tRPC procedures in `server/routers/*.ts`
6. Build frontend components in `client/src/pages/` or `client/src/components/`

### Code Quality
- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting
- Vitest for unit testing

## 📈 Performance

- **Cached Repository Data**: Reduces GitHub API calls
- **Optimized Queries**: Indexed database tables
- **Client-Side Filtering**: Fast local search and filtering
- **Lazy Loading**: Components load on demand

## 🔐 Security

- **OAuth Authentication**: Manus OAuth integration
- **Protected Procedures**: Role-based access control
- **Environment Variables**: Sensitive data in .env files
- **HTTPS**: All API calls use HTTPS

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the Global Digital Health Foundation team.

## 🌟 Acknowledgments

- **onegayunicorn** organization for the GitHub repositories
- **Global Digital Health Foundation** for the mission and vision
- **Manus** for the infrastructure and deployment platform

---

**Built with ❤️ for the Global Digital Health Foundation**
