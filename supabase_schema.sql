-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('car', 'bike')),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT4 NOT NULL,
  price NUMERIC NOT NULL,
  mileage INT4 NOT NULL,
  image_url TEXT,
  description TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  fuel TEXT,
  transmission TEXT,
  district TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Create policies for listings
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can insert listings" ON listings;
CREATE POLICY "Only admins can insert listings" ON listings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update listings" ON listings;
CREATE POLICY "Only admins can update listings" ON listings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete listings" ON listings;
CREATE POLICY "Only admins can delete listings" ON listings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at on listings
DROP TRIGGER IF EXISTS set_updated_at ON listings;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON listings
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
-- ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL, -- Cell phone number
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INITIAL ADMINS (Password defaults to 'admin123' for setup, should be changed)
INSERT INTO public.admins (username, name, password_hash)
VALUES 
('9849575114', 'Syed Younus', 'admin123'),
('9949904505', 'P. Satyanarayana', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- RLS for Admins (Only allow reading by authenticated admins if needed, but for custom auth we handle this app-side)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read for login" ON public.admins;
CREATE POLICY "Public read for login" ON public.admins FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin update own" ON public.admins;
CREATE POLICY "Admin update own" ON public.admins FOR UPDATE USING (true); -- Simplified for this custom flow

-- OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    discount_text TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INITIAL OFFER
INSERT INTO public.offers (title, description, discount_text)
VALUES ('Grand Opening Offer', 'Get instant registration discount on all cars and bikes.', 'Up to ₹10,000 Off')
ON CONFLICT DO NOTHING;

-- RLS for Offers
ALTER TABLE public.offers DISABLE ROW LEVEL SECURITY;
-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    listing_id UUID REFERENCES public.listings ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Enable RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites" ON public.favorites
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own favorites" ON public.favorites;
CREATE POLICY "Users can insert their own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can delete their own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Update listings table with seller_id
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES auth.users(id);

-- Update RLS for listings to allow users to insert their own
DROP POLICY IF EXISTS "Users can insert their own listings" ON public.listings;
CREATE POLICY "Users can insert their own listings" ON public.listings
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can update their own listings" ON public.listings;
CREATE POLICY "Users can update their own listings" ON public.listings
    FOR UPDATE USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Users can delete their own listings" ON public.listings;
CREATE POLICY "Users can delete their own listings" ON public.listings
    FOR DELETE USING (auth.uid() = seller_id);

-- INQUIRIES / CONTACT FORM TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    interested_in TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert inquiries (public form)
DROP POLICY IF EXISTS "Anyone can insert inquiries" ON public.inquiries;
CREATE POLICY "Anyone can insert inquiries" ON public.inquiries
    FOR INSERT WITH CHECK (true);

-- Allow reading/updating only for admins (or public if no strict auth is set up yet)
DROP POLICY IF EXISTS "Public can read inquiries" ON public.inquiries;
CREATE POLICY "Public can read inquiries" ON public.inquiries
    FOR SELECT USING (true); -- Note: In a production app, restrict to admins

DROP POLICY IF EXISTS "Public can update inquiries" ON public.inquiries;
CREATE POLICY "Public can update inquiries" ON public.inquiries
    FOR UPDATE USING (true); -- Note: In a production app, restrict to admins

-- SALES HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.sales_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID,
    type TEXT NOT NULL CHECK (type IN ('car', 'bike')),
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    price BIGINT NOT NULL,
    sold_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sales_history ENABLE ROW LEVEL SECURITY;

-- Only admins should read/write sales history (for now allowing all for simplicity)
DROP POLICY IF EXISTS "Public can manage sales history" ON public.sales_history;
CREATE POLICY "Public can manage sales history" ON public.sales_history
    FOR ALL USING (true);
