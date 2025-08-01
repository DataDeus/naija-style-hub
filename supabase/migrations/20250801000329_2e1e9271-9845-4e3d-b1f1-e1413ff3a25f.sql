-- Update role enum to include SUPERADMIN, ADMIN, and USER
DROP TYPE IF EXISTS user_role CASCADE;
CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'ADMIN', 'USER');

-- Update profiles table to use the new enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role,
ALTER COLUMN role SET DEFAULT 'USER'::user_role;

-- Create admin_store_assignments table for assigning admins to specific stores
CREATE TABLE public.admin_store_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(admin_id, store_id)
);

-- Enable RLS on admin_store_assignments
ALTER TABLE public.admin_store_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_store_assignments
CREATE POLICY "SUPERADMIN can manage all store assignments" 
ON public.admin_store_assignments 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'SUPERADMIN'
));

CREATE POLICY "Users can view their own store assignments" 
ON public.admin_store_assignments 
FOR SELECT 
USING (admin_id = auth.uid());

-- Update products policies to handle new role system
DROP POLICY IF EXISTS "Only admins can manage products" ON public.products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;

-- SUPERADMIN can manage all products
CREATE POLICY "SUPERADMIN can manage all products" 
ON public.products 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'SUPERADMIN'
));

-- ADMIN can only manage products in their assigned stores
CREATE POLICY "ADMIN can manage products in assigned stores" 
ON public.products 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'ADMIN'
  ) AND 
  EXISTS (
    SELECT 1 FROM public.admin_store_assignments 
    WHERE admin_id = auth.uid() AND store_id = products.store_id
  )
);

-- Products are viewable by everyone
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Update stores policies
DROP POLICY IF EXISTS "Only admins can manage stores" ON public.stores;
DROP POLICY IF EXISTS "Stores are viewable by everyone" ON public.stores;

-- SUPERADMIN can manage all stores
CREATE POLICY "SUPERADMIN can manage all stores" 
ON public.stores 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'SUPERADMIN'
));

-- Stores are viewable by everyone
CREATE POLICY "Stores are viewable by everyone" 
ON public.stores 
FOR SELECT 
USING (true);

-- Add trigger for updated_at on admin_store_assignments
CREATE TRIGGER update_admin_store_assignments_updated_at
BEFORE UPDATE ON public.admin_store_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();