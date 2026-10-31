# NutriVision AI - AI Nutritionist Web Application

## Overview

NutriVision AI is a personal AI nutritionist web application that analyzes food photos to provide nutritional information and health ratings. Users upload images of meals, and the application uses AI to identify food items, calculate nutritional content, and provide health assessments with suggestions in Bahasa Indonesia. The application features a modern, mobile-responsive interface designed for health and wellness.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **UI Library**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes
- **State Management**: React Query for server state, React Context for theme management
- **Routing**: Wouter for lightweight client-side routing
- **Design System**: Custom color palette focused on health/wellness aesthetics with green primary colors

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **File Upload**: Multer middleware for handling image uploads with 10MB size limit
- **API Structure**: RESTful endpoints with `/api/analyze-food` for nutrition analysis
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Storage**: In-memory storage implementation with interface for future database integration

### AI Integration
- **Vision AI**: Google Gemini 2.5 Flash with Vision API for comprehensive food image recognition
- **Detailed Analysis**: Provides health score (1-10), quality assessment, complete macronutrients with percentages, vitamins & minerals with daily value percentages, health benefits, diet tips, meal context, and portion advice
- **Response Format**: Structured JSON responses with all analysis in Bahasa Indonesia
- **Confidence Scoring**: AI provides confidence levels (0-100%) for food identification accuracy

### Data Models
- **Users**: Basic user management with username/password authentication
- **Nutrition Analysis**: Comprehensive nutritional data storage including macronutrients, micronutrients, ratings, and suggestions
- **Health Scoring**: Algorithm considering protein+fiber density, sugar/sodium limits, and daily protein targets

### UI/UX Design
- **Mobile-First**: Responsive design optimized for mobile devices
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Loading States**: Multi-stage progressive loading (10%→30%→70%→90%→100%) with stage-specific messaging
- **Animations**: Framer Motion animations including staggered fade-ins, scale effects, and smooth state transitions
- **Visual Design**: Gradient backgrounds, hover-elevate effects on cards, decorative elements, and modern glass morphism
- **Image Preview**: Immediate image preview during analysis using Data URLs for fast visual feedback
- **Error Handling**: User-friendly error messages and fallback states
- **Theme Support**: Light/dark mode with persistent user preferences
- **Analysis History**: localStorage-based history feature storing last 10 analyses with persistent Data URL images, with QuotaExceeded fallback
- **Icon System**: Consistent lucide-react icons throughout (no emojis) for professional appearance

## External Dependencies

### AI Services
- **Google Gemini API**: Gemini 2.5 Flash with Vision capabilities for detailed food image analysis and comprehensive nutritional estimation
- **API Key Management**: Environment variable configuration (GEMINI_API_KEY) for Gemini authentication

### Database
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL database service
- **Schema Management**: Drizzle Kit for database migrations and schema updates

### Development Tools
- **Vite**: Fast build tool with HMR and TypeScript support
- **ESBuild**: JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### UI Components
- **Radix UI**: Accessible component primitives for complex UI elements
- **Lucide React**: Icon library for consistent iconography (Ruler, Flame, BarChart3, AlertTriangle, Heart, etc.)
- **Framer Motion**: Animation library for smooth UI transitions, staggered effects, and micro-interactions
- **Class Variance Authority**: Utility for component variant management
- **React Hook Form**: Form state management with validation

### Fonts & Assets
- **Google Fonts**: Inter and Outfit font families via CDN
- **Image Assets**: Placeholder images and illustrations for upload areas

### Utilities
- **Date-fns**: Date manipulation and formatting
- **clsx & tailwind-merge**: CSS class name utilities
- **Zod**: Schema validation for API requests and responses