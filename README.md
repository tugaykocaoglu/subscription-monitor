# SubMonitor 💳

A modern, full-stack subscription management application built with Next.js 16, Supabase, and Shadcn UI. Track your recurring subscriptions, manage renewal reminders, and gain insights into your spending patterns.

## ✨ Features

### Core Functionality

- **Subscription Management**: Add, edit, and delete subscriptions with detailed information
- **Smart Reminders**: Configurable reminders before subscription renewals (email, SMS, push)
- **Dashboard Analytics**: Real-time overview of spending, upcoming renewals, and category breakdown
- **Dark Mode**: Full theme support with light, dark, and system modes

### User Experience

- **Modern UI**: Clean, responsive interface built with Shadcn UI components
- **Authentication**: Secure email/password authentication with Supabase Auth
- **Profile Management**: User profile dropdown with quick navigation
- **Protected Routes**: Middleware-based route protection

### Analytics & Insights

- **Spending Overview**: Monthly and yearly spending projections
- **Category Breakdown**: Visual spending distribution by category
- **Renewal Tracking**: Upcoming renewals with urgency highlighting
- **Billing Cycle Normalization**: Accurate monthly cost calculations across all billing cycles

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tugaykocaoglu/subscription-monitor.git
   cd subscription-monitor
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   CRON_SECRET=your_secret_for_cron_jobs
   ```

4. **Set up the database**

   Run the migration file in your Supabase SQL Editor:

   - Navigate to your Supabase project dashboard
   - Go to SQL Editor
   - Copy and paste the contents of `supabase/migrations/20240101000000_init.sql`
   - Run the migration

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
subscription-monitor/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── api/               # API routes (cron jobs)
│   │   └── auth/              # Auth callback
│   ├── components/            # React components
│   │   ├── layout/           # Layout components (header, nav, profile)
│   │   ├── reminders/        # Reminder-related components
│   │   ├── subscriptions/    # Subscription components
│   │   └── ui/               # Shadcn UI components
│   ├── lib/                   # Utility functions
│   │   ├── supabase/         # Supabase client configurations
│   │   └── utils/            # Helper functions
│   └── server/                # Server-side code
│       ├── actions/          # Server actions
│       └── queries/          # Database queries
├── supabase/
│   └── migrations/           # Database migrations
└── public/                   # Static assets
```

## 🔑 Environment Variables

| Variable                        | Description                              | Required |
| ------------------------------- | ---------------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Your Supabase project URL                | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key              | Yes      |
| `CRON_SECRET`                   | Secret token for cron job authentication | Yes      |

## 📊 Database Schema

The application uses the following main tables:

- **subscriptions**: Core subscription data
- **subscription_providers**: Catalog of subscription providers
- **categories**: Subscription categories
- **reminder_rules**: User-defined reminder preferences
- **notification_jobs**: Queued notification tasks

See `supabase/migrations/20240101000000_init.sql` for the complete schema.

## 🔔 Cron Jobs

The application includes a cron endpoint for processing reminders:

```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/reminders
```

Set up a cron service (e.g., Vercel Cron, GitHub Actions, or cron-job.org) to call this endpoint periodically.

## 🎨 Customization

### Brand Colors

Update the primary brand color in `src/app/globals.css`:

```css
:root {
  --primary: #00a120; /* Your brand color */
}
```

### Theme

Modify theme configuration in `src/components/theme-provider.tsx` and `src/app/globals.css`.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Tugay Kocaoğlu**

- GitHub: [@tugaykocaoglu](https://github.com/tugaykocaoglu)

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Vercel](https://vercel.com/) for deployment platform

---

Built with ❤️ using Next.js and TypeScript
