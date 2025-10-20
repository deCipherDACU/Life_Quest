# 🎮 LifeQuest RPG - Gamified Life Management

Transform your daily tasks into an epic RPG adventure! LifeQuest RPG is a comprehensive life management application that gamifies productivity through character progression, boss battles, achievements, and rewards.

## ✨ Features

### 🎯 **Core Gameplay**
- **Task Management** - Create, complete, and track tasks with XP/coin rewards
- **Character Progression** - Level up, earn skill points, and develop abilities
- **Boss Battles** - Weekly challenges that require task completion to defeat
- **Achievement System** - Unlock achievements across various categories
- **Rewards Shop** - Redeem coins and gems for real-life treats

### 🧠 **AI-Powered Features**
- **Smart Timetable Generator** - AI-optimized daily schedules
- **AI Coach** - Personalized guidance and task recommendations
- **Habit Stacking** - Intelligent habit formation suggestions
- **Weekly Insights** - AI-generated progress analysis

### 📱 **Productivity Tools**
- **Pomodoro Timer** - Focus sessions with RPG integration
- **Journal System** - Daily reflection with XP rewards
- **Weekly Reviews** - Structured progress evaluation
- **Special Quests** - Dynamic dungeon-style challenges
- **Breathing Exercises** - Mindfulness with gamification

### 🔧 **Technical Features**
- **Real-time Sync** - Firebase-powered cross-device synchronization
- **Offline Support** - Works offline with automatic sync
- **Data Migration** - Seamless transition from localStorage to cloud
- **Authentication** - Secure user accounts and profiles
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase project
- Google AI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/deCipherDACU/Life_Quest.git
   cd Life_Quest/life_quest_2-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase and Google AI credentials in `.env.local`

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Initialize the backend** (optional)
   ```bash
   npm run setup-backend
   ```

Visit `http://localhost:9002` to start your adventure!

## 🏗️ Architecture

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Smooth animations

### Backend
- **Firebase Auth** - User authentication
- **Firestore** - Real-time NoSQL database
- **Firebase Storage** - File storage for avatars and media
- **Next.js API Routes** - Server-side endpoints

### AI Integration
- **Google Genkit** - AI workflow orchestration
- **Google Gemini** - Large language model for coaching
- **Custom AI Flows** - Specialized AI features

## 📚 Documentation

- **[Backend Setup Guide](BACKEND_SETUP.md)** - Complete Firebase configuration
- **[Mock Data Removal](MOCK_DATA_REMOVAL.md)** - Clean architecture transition
- **[Project Blueprint](docs/blueprint.md)** - Original design specifications

## 🎨 Design System

### Color Palette
- **Primary**: Vibrant Purple (`#A076F4`) - Magic and ambition
- **Background**: Light Lavender (`#E6E0F8`) - Calming magical vibe
- **Accent**: Blue Violet (`#7683F4`) - Interactive elements

### Typography
- **Headlines**: Space Grotesk - Modern, techy feel
- **Body**: Inter - Clean, readable text

### Theme
RPG-inspired design with custom icons, progress bars, badges, and gamified UI elements.

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type checking
- `npm run setup-backend` - Initialize Firebase backend

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── context/            # React context providers
├── lib/                # Utilities and services
├── hooks/              # Custom React hooks
└── ai/                 # AI flows and configurations
```

## 🌟 Key Features Deep Dive

### Character System
- **5 Skill Trees**: Strength, Endurance, Agility, Intelligence, Perception
- **Equipment System**: Weapons, armor, helmets, shields
- **Inventory Management**: Collectible items and rewards
- **Health & Debuffs**: Consequences for missed tasks

### Task Management
- **Categories**: Education, Career, Health, Mental Wellness, Finance, Social, Hobbies, Home
- **Difficulty Levels**: Easy, Medium, Hard with appropriate rewards
- **Task Types**: Daily, Weekly, Monthly, One-time
- **Streak Tracking**: Maintain consistency for bonus rewards

### Boss Battle System
- **Weekly Bosses**: Unique enemies with different resistances
- **Attack Patterns**: Dynamic challenges based on task completion
- **Phase System**: Bosses get stronger as health decreases
- **Rewards**: XP, coins, and gems for victories

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Firebase** - Backend infrastructure
- **Google AI** - AI-powered features
- **Radix UI** - Accessible components
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization

## 🐛 Issues & Support

Found a bug or have a feature request? Please open an issue on GitHub.

## 🚀 Deployment

The app is ready for deployment on:
- **Vercel** (recommended for Next.js)
- **Firebase Hosting**
- **Netlify**
- Any Node.js hosting platform

---

**Start your adventure today and turn your life into an epic RPG quest!** 🎮✨
