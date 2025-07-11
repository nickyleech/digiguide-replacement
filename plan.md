# TV Programme Listings Application - Complete Blueprint

## Project Overview

A comprehensive TV programme listings application designed to replace existing services like Digiguide.tv for the UK market. Built with modern web technologies, featuring multi-platform support, advanced analytics, and comprehensive admin capabilities.

## Core Requirements

- **British English** throughout the application
- **Mobile-first responsive design** with minimalistic UI
- **Multi-platform support**: Sky, Freeview, Freesat, Virgin Media
- **10-day programme window** starting with 3 channels
- **Freemium model** with basic and premium tiers
- **Comprehensive analytics** for user behaviour tracking
- **Full admin dashboard** for content and user management

## Technical Architecture

### Frontend Stack
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** for styling (following repository patterns)
- **React 19** with modern hooks and patterns
- **Lucide React** for consistent iconography
- **Chart.js/Recharts** for analytics dashboards

### Backend Stack
- **Next.js API Routes** for serverless functions
- **PostgreSQL** for primary database
- **Prisma ORM** for database operations
- **NextAuth.js** for authentication
- **Stripe** for payment processing
- **AWS S3** for file storage (channel logos)

### Core Dependencies
```json
{
  "next": "^15.3.4",
  "react": "^19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.17",
  "prisma": "^5.0.0",
  "next-auth": "^4.24.0",
  "stripe": "^14.0.0",
  "lucide-react": "^0.400.0",
  "recharts": "^2.8.0"
}
```

## Application Structure

```
tv-guide-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── layout.tsx
│   ├── (admin)/
│   │   ├── dashboard/page.tsx
│   │   ├── users/page.tsx
│   │   ├── channels/page.tsx
│   │   ├── platforms/page.tsx
│   │   ├── analytics/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── programmes/route.ts
│   │   ├── channels/route.ts
│   │   ├── analytics/route.ts
│   │   └── payments/route.ts
│   ├── guide/page.tsx
│   ├── pricing/page.tsx
│   ├── dashboard/page.tsx
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ProgrammeGrid/
│   │   ├── ProgrammeGrid.tsx
│   │   ├── ProgrammeCard.tsx
│   │   └── TimeSlot.tsx
│   ├── Navigation/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── Platform/
│   │   ├── PlatformSelector.tsx
│   │   └── ChannelSelector.tsx
│   ├── Admin/
│   │   ├── UserManager.tsx
│   │   ├── ChannelManager.tsx
│   │   ├── PlatformManager.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── PasswordReset.tsx
│   └── Common/
│       ├── Modal.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorBoundary.tsx
├── lib/
│   ├── db/
│   │   ├── prisma.ts
│   │   └── schema.prisma
│   ├── auth/
│   │   ├── config.ts
│   │   └── providers.ts
│   ├── analytics/
│   │   ├── tracker.ts
│   │   └── queries.ts
│   ├── payments/
│   │   └── stripe.ts
│   ├── api/
│   │   ├── programmes.ts
│   │   └── channels.ts
│   └── utils/
│       ├── date.ts
│       ├── format.ts
│       └── constants.ts
├── types/
│   ├── auth.ts
│   ├── programmes.ts
│   ├── channels.ts
│   └── analytics.ts
└── prisma/
    ├── schema.prisma
    └── migrations/
```

## Database Schema

### Core Tables

```sql
-- Users and Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    subscription_tier VARCHAR(20) DEFAULT 'free',
    platform_preference VARCHAR(20) DEFAULT 'freeview',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Platforms (Sky, Freeview, etc.)
CREATE TABLE platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true
);

-- Channels
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    category VARCHAR(50),
    description TEXT,
    archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Platform-Channel Mapping
CREATE TABLE channel_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id),
    platform_id UUID REFERENCES platforms(id),
    epg_number INTEGER,
    display_order INTEGER,
    active BOOLEAN DEFAULT true
);

-- Programmes
CREATE TABLE programmes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(50),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    episode_title VARCHAR(255),
    season_number INTEGER,
    episode_number INTEGER,
    rating VARCHAR(10)
);

-- Analytics Tables
CREATE TABLE user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50) NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE programme_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    programme_id UUID REFERENCES programmes(id),
    view_duration INTEGER,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

## Feature Specifications

### Core Features (Free Tier)
1. **Programme Grid View**
   - 10-day sliding window
   - 3 initial channels (BBC One, ITV, Channel 4)
   - Basic programme information
   - Current time indicator
   - Mobile-responsive grid

2. **Platform Selection**
   - Sky, Freeview, Freesat, Virgin Media
   - EPG number display
   - Channel logos
   - Platform-specific channel ordering

3. **User Authentication**
   - Email/password registration
   - Social login options
   - Password reset functionality
   - Basic user profile

### Premium Features (Paid Tier)
1. **Advanced Filtering**
   - Genre-based filtering
   - Favourite programmes
   - Programme reminders
   - Personalised recommendations

2. **Enhanced Interface**
   - Customisable grid layout
   - Export functionality
   - Programme ratings/reviews
   - Advanced search

### Admin Dashboard
1. **User Management**
   - View all users and subscription status
   - User activity monitoring
   - Support ticket management
   - Bulk user operations

2. **Channel Management**
   - Add/edit/archive channels
   - Logo upload and management
   - EPG number assignment
   - Channel categorisation

3. **Analytics Dashboard**
   - Real-time user statistics
   - Programme popularity metrics
   - Revenue and subscription tracking
   - Custom report generation

## Deployment Strategies

### Option 1: Vercel (Recommended)
**Best for:** Rapid deployment, automatic scaling, Next.js optimisation

```bash
# Deploy to Vercel
npm install -g vercel
vercel --prod

# Environment variables needed:
# DATABASE_URL
# NEXTAUTH_SECRET
# STRIPE_SECRET_KEY
# AWS_ACCESS_KEY_ID
# AWS_SECRET_ACCESS_KEY
```

**Pros:**
- Automatic deployments from Git
- Built-in CDN and edge functions
- Excellent Next.js integration
- Free tier available

**Cons:**
- Function execution time limits
- Less control over server configuration

### Option 2: AWS Full Stack
**Best for:** Enterprise deployment, full control, complex requirements

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/tvguide
    depends_on:
      - db
      - redis
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=tvguide
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

**Infrastructure Requirements:**
- EC2 instances (t3.medium minimum)
- RDS PostgreSQL (db.t3.micro for development)
- S3 bucket for file storage
- CloudFront CDN
- Application Load Balancer

### Option 3: DigitalOcean App Platform
**Best for:** Simple deployment, cost-effective, managed services

```yaml
# .do/app.yaml
name: tv-guide-app
services:
- name: web
  source_dir: /
  github:
    repo: your-username/tv-guide-app
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  
databases:
- name: tv-guide-db
  engine: PG
  version: "15"
  
static_sites:
- name: assets
  source_dir: /public
```

## Environment Configuration

### Development Environment
```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma generate

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/tvguide"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Payment Processing
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# File Storage
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_BUCKET_NAME="tv-guide-assets"
AWS_REGION="eu-west-2"

# External API
TV_LISTINGS_API_KEY="your-api-key"
TV_LISTINGS_API_URL="https://api.provider.com"
```

## Security Considerations

### Authentication & Authorization
- JWT tokens with secure refresh mechanism
- Role-based access control (user, admin, super-admin)
- API rate limiting and request validation
- HTTPS enforcement in production

### Data Protection
- GDPR compliance for EU users
- Data encryption at rest and in transit
- Regular security audits
- Secure file upload validation

### Payment Security
- PCI DSS compliance through Stripe
- Secure webhook handling
- No storage of sensitive payment data
- Regular security assessments

## Performance Optimisation

### Frontend Optimisation
- Image optimisation for channel logos
- Lazy loading for programme data
- Component memoization
- Bundle splitting and code splitting

### Backend Optimisation
- Database query optimisation
- Redis caching for frequently accessed data
- API response caching
- Database connection pooling

### CDN Strategy
- Static asset delivery through CDN
- API response caching
- Image transformation and optimisation
- Global edge locations

## Monitoring and Analytics

### Application Monitoring
- Real-time error tracking (Sentry)
- Performance monitoring (APM)
- Uptime monitoring
- Custom metrics dashboard

### Business Analytics
- User engagement tracking
- Feature usage analytics
- Revenue and subscription metrics
- A/B testing framework

## Maintenance and Operations

### Backup Strategy
- Automated daily database backups
- File storage backup to separate region
- Point-in-time recovery capability
- Disaster recovery procedures

### Update Process
- Staged deployment pipeline
- Automated testing and validation
- Blue-green deployment strategy
- Rollback procedures

### Support Infrastructure
- Centralised logging system
- User support ticket system
- Documentation and knowledge base
- On-call rotation for critical issues

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- Project setup and initial architecture
- Database schema implementation
- Basic authentication system
- Core programme grid component

### Phase 2: Core Features (Weeks 3-4)
- Platform selector implementation
- Channel management system
- Programme API integration
- Basic admin dashboard

### Phase 3: Premium Features (Weeks 5-6)
- Payment integration
- Advanced filtering
- User preferences system
- Analytics implementation

### Phase 4: Enhancement (Weeks 7-8)
- Performance optimisation
- Advanced admin features
- Mobile app considerations
- Third-party integrations

## Cost Estimation

### Development Costs
- Initial development: 6-8 weeks
- Ongoing maintenance: 20% of development cost annually
- Third-party services: £200-500/month (depending on scale)

### Infrastructure Costs (Monthly)
- **Vercel Pro**: £20-100 (depending on usage)
- **AWS Full Stack**: £50-200 (t3.medium + RDS)
- **DigitalOcean**: £25-100 (App Platform + Database)

### Scaling Considerations
- Horizontal scaling for increased load
- Database read replicas for performance
- CDN expansion for global reach
- API rate limiting and caching strategies

This comprehensive blueprint provides a complete roadmap for building and deploying a professional TV programme listings service that can compete with established players in the UK market.