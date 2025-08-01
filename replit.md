# Razor Sharp Fashion - Replit Migration

## Project Overview
This is a fashion retail management system called "Razor Sharp Fashion" that was successfully migrated from Lovable to Replit. The application features a storefront where customers can browse products across multiple store locations in Nigeria (Lagos, Abuja, Port Harcourt).

## Architecture
- **Frontend**: React with TypeScript using Vite
- **Backend**: Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (client-side routing)
- **UI**: shadcn/ui components with Tailwind CSS
- **Query Management**: TanStack Query

## Database Schema
- **stores**: Store locations with name, location, address, phone
- **products**: Product catalog with store associations, pricing, categories
- **profiles**: User profiles with role-based access (SUPERADMIN, ADMIN, USER)
- **admin_store_assignments**: Admin-to-store relationships

## API Routes
- `GET /api/stores` - List all stores
- `GET /api/stores/:id` - Get specific store
- `POST /api/stores` - Create new store
- `GET /api/products` - List all products (with optional store_id filter)
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/profiles/:id` - Get user profile
- `POST /api/profiles` - Create user profile

## Migration Status
✅ Successfully migrated from Supabase to PostgreSQL
✅ Replaced React Router with Wouter
✅ Implemented server-side API with proper security
✅ Removed authentication system for initial launch
✅ Created sample data for testing

## Recent Changes
- **2025-08-01**: Completed migration from Lovable to Replit
- Migrated from Supabase to PostgreSQL with Drizzle ORM
- Simplified application by removing auth system initially
- Created API endpoints for stores and products
- Added sample data for 3 stores and 75 products
- Added "Add Product" functionality with store selection form
- Enhanced storefront with product filtering by store and search

## User Preferences
- Focus on core functionality first
- Ensure security with proper client/server separation
- Use modern React patterns with TypeScript
- Maintain clean, maintainable code structure