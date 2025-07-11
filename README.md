# digiguide.tv - Premium UK TV Listings

A sophisticated and beautiful TV programme listings application designed to replace existing services like Digiguide.tv for the UK market. Built with modern web technologies and featuring a stunning, mobile-first design.

## 🌟 Features

### Core Features
- **Multi-Platform Support**: Works with Sky, Freeview, Virgin Media, and Freesat
- **10-Day Programme Guide**: View listings up to 10 days in advance
- **Mobile-First Design**: Stunning interface optimised for all devices
- **Real-Time Updates**: Live programme tracking with current time indicators
- **Advanced Search**: Find programmes by title, description, or genre
- **Smart Filtering**: Filter by genre, channel, and platform

### Premium Features
- **Programme Reminders**: Never miss your favourite shows
- **Personalised Recommendations**: Discover new content based on your preferences
- **Favourites Management**: Save and organise your preferred programmes and channels
- **Advanced Analytics**: Track your viewing habits and preferences
- **Export Functionality**: Export programme schedules in various formats

### Admin Features
- **User Management**: Comprehensive user administration
- **Channel Management**: Add, edit, and manage channels and EPG numbers
- **Platform Configuration**: Manage platform-specific settings
- **Analytics Dashboard**: Business intelligence and user behaviour insights

## 🚀 Technology Stack

- **Frontend**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Lucide React for consistent iconography
- **Build Tool**: Next.js optimized build system

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tv-guide-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## 📱 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Design Features

### Beautiful UI/UX
- **Gradient Backgrounds**: Stunning blue gradient designs
- **Smooth Animations**: CSS transitions and hover effects
- **Card-Based Layout**: Clean, modern card components
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Live Indicators**: Real-time programme status with animated badges

### Mobile-First Approach
- **Touch-Friendly**: Large touch targets and intuitive gestures
- **Responsive Design**: Perfect on phones, tablets, and desktops
- **Fast Loading**: Optimized for mobile networks
- **Accessible**: WCAG compliant design principles

## 🔧 Project Structure

```
tv-guide-app/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── guide/              # TV guide interface
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── ProgrammeGrid.tsx   # Main TV guide grid
│   │   ├── ProgrammeCard.tsx   # Individual programme display
│   │   ├── PlatformSelector.tsx # Platform switching
│   │   ├── DateNavigation.tsx  # Date picker and navigation
│   │   ├── ChannelHeader.tsx   # Channel information display
│   │   └── TimeSlots.tsx       # Time grid component
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript definitions
│       └── index.ts            # Type definitions
├── public/                     # Static assets
├── tailwind.config.js          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── tsconfig.json              # TypeScript configuration
```

## 🌐 Pages

### Homepage (`/`)
- **Hero Section**: Compelling call-to-action with platform showcase
- **Feature Highlights**: Key application benefits
- **Pricing Tiers**: Free and Premium subscription options
- **Modern Design**: Gradient backgrounds and smooth animations

### TV Guide (`/guide`)
- **Programme Grid**: Interactive time-based programme listings
- **Platform Selector**: Switch between Sky, Freeview, Virgin Media, Freesat
- **Date Navigation**: 10-day sliding window with intuitive controls
- **Search & Filter**: Advanced programme discovery tools
- **Live Tracking**: Real-time current programme indicators

## 🎯 Key Components

### ProgrammeGrid
The main interface for viewing TV programmes with:
- Grid and list view modes
- Real-time current time indicator
- Interactive programme cards
- Advanced filtering options

### ProgrammeCard
Individual programme display with:
- Compact and detailed view variants
- Live status indicators
- Favourite and reminder functionality
- Genre and rating badges

### PlatformSelector
Platform switching interface featuring:
- Smooth dropdown animations
- Visual platform indicators
- EPG number display

## 🚀 Deployment

The application is optimized for deployment on:

- **Vercel** (Recommended): Zero-config deployment
- **Netlify**: Static site hosting
- **AWS**: Full-stack deployment
- **DigitalOcean**: App Platform deployment

## 🔮 Future Enhancements

- **Authentication System**: User accounts and preferences
- **Payment Integration**: Stripe subscription management
- **Database Integration**: PostgreSQL for user data
- **API Integration**: Real TV listings data
- **Push Notifications**: Programme reminders
- **Progressive Web App**: Offline functionality
- **Admin Dashboard**: Content management system

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Please contact the maintainers for contribution guidelines.

---

Built with ❤️ for UK television enthusiasts.