# Design Guidelines: AI Nutritionist Web Application

## Design Approach: Reference-Based
**Inspiration Sources**: Health and nutrition apps like MyFitnessPal, Lose It!, and Cronometer, combined with modern food photography apps like Foodvisor and Yazio.

**Key Design Principles**:
- Clean, health-focused aesthetic that builds trust and credibility
- Visual hierarchy that guides users through the food analysis journey
- Emotional connection through appealing food photography and positive reinforcement

## Core Design Elements

### Color Palette
**Light Mode**:
- Primary: 142 69% 58% (fresh green for health/wellness)
- Background: 0 0% 98% (clean white/off-white)
- Success: 120 60% 50% (vibrant green for "Sangat Baik")
- Warning: 45 100% 60% (warm yellow for "Baik") 
- Error: 0 70% 55% (coral red for "Kurang")

**Dark Mode**:
- Primary: 142 50% 65% (lighter green for contrast)
- Background: 220 13% 8% (deep charcoal)
- Surface: 220 13% 12% (elevated surfaces)
- Text: 0 0% 95% (high contrast text)

### Typography
**Google Fonts via CDN**:
- Primary: Inter (400, 500, 600) for UI elements and body text
- Display: Outfit (600, 700) for headings and nutrition values
- Sizes: Text-sm to text-4xl scale, emphasizing readability on mobile

### Layout System  
**Tailwind Spacing**: Use units of 2, 4, 6, 8, and 12 for consistent spacing (p-4, m-6, gap-8, etc.)
- Mobile-first approach with generous padding
- Card-based layout for nutrition information
- Centered content with max-width constraints

### Component Library

**Core UI Elements**:
- Upload area: Large, dashed border zone with prominent camera icon
- Cards: Rounded corners (rounded-xl), subtle shadows, clean borders
- Buttons: Rounded-lg with appropriate sizing for touch targets
- Progress indicators: Circular for image processing, linear for health scores

**Navigation**: 
- Simple header with app title in Bahasa Indonesia
- Minimal navigation focusing on core upload functionality

**Forms**:
- Clean upload interface with drag-drop visual feedback  
- File input styling matching overall aesthetic

**Data Displays**:
- Nutrition cards with icon-value pairs
- Color-coded health rating badges
- Visual macro breakdown (simple bar charts or circles)

**Overlays**:
- Loading modal during image analysis
- Success/error states with appropriate messaging in Bahasa Indonesia

## Images
No large hero image needed. Focus on:
- **Uploaded food photos**: Full-width display with rounded corners
- **Icons**: Use Heroicons for consistent iconography (camera, nutrition symbols, checkmarks)
- **Placeholder graphics**: Simple illustrations for empty states

## Mobile-First Considerations
- Touch-friendly upload area (minimum 44px touch targets)
- Swipe-friendly nutrition cards
- Clear visual hierarchy for small screens
- Optimized image preview sizing

## Health Rating Visual Treatment
- **Sangat Baik**: Green background with checkmark icon
- **Baik**: Yellow background with neutral icon  
- **Kurang**: Red background with warning icon
- Each rating includes supportive messaging in Bahasa Indonesia

## Content Strategy
- Concise, encouraging language throughout
- Clear nutritional data presentation
- Helpful suggestions without being prescriptive
- Medical disclaimer prominently displayed

This design creates a trustworthy, modern health application that makes nutrition tracking feel approachable and encouraging rather than clinical or overwhelming.