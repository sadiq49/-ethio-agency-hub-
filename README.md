# Ethio Agency Hub - Agency Management System

## Overview

Ethio Agency Hub is a comprehensive management system designed for Ethiopian employment agencies that deploy workers abroad. The platform streamlines the entire worker deployment process, from registration to return, while ensuring compliance with government regulations and improving operational efficiency.

## Key Features

### Worker Management
- **Registration**: Comprehensive worker onboarding with document collection
- **CV Generator**: Create professional CVs for workers with customizable templates
- **CV Database**: Searchable database of workers for easy matching with employers
- **Training Management**: Track worker training programs and certifications
- **Status Tracking**: Real-time monitoring of worker deployment status

### Document Processing
- **MOLS Submission**: Streamlined Ministry of Labor submissions
- **Visa Management**: End-to-end visa application processing
- **Missing Report**: Track and manage cases of missing workers
- **Cross-Match**: Verify document authenticity and consistency

### Travel Management
- **Ticket Arrangement**: Manage flight bookings and itineraries
- **Departure Preparation**: Comprehensive pre-departure checklists
- **Today Flying**: Track workers departing on the current day

### Additional Modules
- **Hajj & Umrah**: Specialized management for religious pilgrimages
- **Institutions**: Manage relationships with government bodies, banks, and medical facilities
- **Agents**: Track foreign agent relationships and performance
- **Reports**: Comprehensive analytics and reporting
- **Automation**: Workflow automation for repetitive tasks

## Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/ethio-agency-hub.git
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── documents/         # Document management routes
│   ├── workers/          # Worker management routes
│   ├── travel/           # Travel management routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── dashboard/        # Dashboard components
│   ├── layout/          # Layout components
│   └── ui/              # UI components
├── lib/                 # Utility functions
└── public/             # Static assets
```

## Security Features

- Role-based access control
- Secure document handling
- Audit trail for all operations
- Data encryption

## Compliance

- MOLS regulations adherence
- International labor law compliance
- Document verification standards
- Worker protection measures

## Best Practices

- Regular data backups
- Document version control
- Secure communication channels
- Regular system updates

## Support

For support and inquiries:
- Email: [support@example.com]
- Phone: [phone-number]
- Hours: [working-hours]

## License

[License Type] - See LICENSE file for details

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request