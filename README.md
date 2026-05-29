# LearnHub - Premium EdTech Frontend

A modern, premium EdTech frontend website built with HTML, Tailwind CSS CDN, and Vanilla JavaScript. Designed to run directly with Live Server - no npm required.

## Features

- **Modern UI Design**: Glassmorphism effects, floating cards, smooth animations
- **Fully Responsive**: Works on all devices - mobile, tablet, desktop
- **Multiple Pages**: Complete website with all essential pages
- **Interactive Elements**: Animated counters, accordions, carousels, tabs
- **Premium Animations**: Fade-in effects, hover animations, smooth transitions
- **Dark/Light Themes**: Consistent color scheme throughout

## Pages Included

### Main Pages
1. **index.html** - Homepage with hero section, features, exam categories, live classes
2. **courses.html** - Browse all courses with filters and search
3. **course-detail.html** - Individual course page with curriculum, reviews
4. **mocktests.html** - Mock tests listing with categories
5. **mocktest-detail.html** - Mock test details with instructions
6. **liveclasses.html** - Live and upcoming classes schedule
7. **studymaterial.html** - Study materials and PDFs
8. **pricing.html** - Subscription plans and pricing

### User Pages
9. **login.html** - User login page
10. **signup.html** - New user registration
11. **forgotpassword.html** - Password recovery
12. **dashboard.html** - User dashboard with progress
13. **profile.html** - User profile management

### Information Pages
14. **about.html** - About the company
15. **contact.html** - Contact form and information
16. **faq.html** - Frequently asked questions

## Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS (CDN)** - Utility-first CSS framework
- **Vanilla JavaScript** - No frameworks required
- **Font Awesome** - Icons
- **Google Fonts (Inter)** - Typography

## How to Run

### Option 1: Live Server (Recommended)
1. Open VS Code
2. Install "Live Server" extension
3. Open the `public` folder
4. Right-click on `index.html`
5. Select "Open with Live Server"

### Option 2: Direct Browser
1. Navigate to the `public` folder
2. Double-click on `index.html`
3. The website will open in your browser

### Option 3: Python HTTP Server
```bash
cd public
python -m http.server 8000
```
Then visit `http://localhost:8000`

## Project Structure

```
public/
├── css/
│   └── style.css          # Custom styles and animations
├── js/
│   └── script.js          # JavaScript functionality
├── index.html             # Homepage
├── courses.html           # Courses listing
├── course-detail.html     # Course details
├── mocktests.html         # Mock tests listing
├── mocktest-detail.html   # Mock test details
├── liveclasses.html       # Live classes
├── studymaterial.html     # Study materials
├── pricing.html           # Pricing plans
├── login.html             # Login page
├── signup.html            # Sign up page
├── forgotpassword.html    # Password recovery
├── dashboard.html         # User dashboard
├── profile.html           # User profile
├── about.html             # About page
├── contact.html           # Contact page
├── faq.html               # FAQ page
└── README.md              # This file
```

## Features Breakdown

### Homepage (index.html)
- Hero section with floating progress cards
- Animated statistics counters
- Feature highlights with icons
- Popular exam categories
- Live classes preview
- Testimonials carousel
- Footer with links

### Courses Page
- Category filters (SSC, Banking, UPSC, etc.)
- Search functionality
- Course cards with pricing
- Rating and enrollment info

### Mock Tests
- Test categories
- Difficulty levels
- Detailed instructions
- Leaderboard preview

### Dashboard
- Progress tracking
- Recent activity
- Performance analytics
- Quick access to courses

### Authentication
- Login with email/password
- Social login buttons (UI only)
- Password recovery flow
- User registration

## Customization

### Colors
The primary colors can be modified in the Tailwind classes:
- Primary: `indigo-600`, `indigo-700`
- Secondary: `purple-600`, `purple-700`
- Accent: `yellow-400`, `green-600`

### Fonts
Using Google Fonts Inter. To change:
1. Update the font link in each HTML file
2. Modify the `font-inter` class

### Images
Currently using Unsplash placeholder images. Replace URLs with your own images.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Credits

- **Tailwind CSS** - https://tailwindcss.com
- **Font Awesome** - https://fontawesome.com
- **Google Fonts** - https://fonts.google.com
- **Unsplash** - https://unsplash.com (placeholder images)

## License

This project is free to use for educational and commercial purposes.

---

Built with love for aspiring students preparing for competitive exams.
