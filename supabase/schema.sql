-- Auto Syria - Supabase Database Schema
-- تشغيل في SQL Editor في Supabase

-- حذف السياسات القديمة (إذا كانت موجودة)
DROP POLICY IF EXISTS "Admin can insert cars" ON cars;
DROP POLICY IF EXISTS "Admin can update cars" ON cars;
DROP POLICY IF EXISTS "Admin can delete cars" ON cars;
DROP POLICY IF EXISTS "Admin can view sell requests" ON sell_requests;
DROP POLICY IF EXISTS "Admin can update sell requests" ON sell_requests;
DROP POLICY IF EXISTS "Admin can delete sell requests" ON sell_requests;

CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_number SERIAL UNIQUE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  mileage INTEGER,
  governorate TEXT NOT NULL,
  fuel_type TEXT DEFAULT 'بنزين' CHECK (fuel_type IN ('بنزين', 'ديزل', 'كهرباء', 'هايبرد')),
  transmission TEXT DEFAULT 'عادي' CHECK (transmission IN ('عادي', 'أوتوماتيك', 'CVT')),
  engine_cc INTEGER,
  color TEXT,
  description TEXT,
  phone TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars (featured DESC, created_at DESC);

CREATE TABLE IF NOT EXISTS sell_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  expected_price NUMERIC NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available cars"
  ON cars FOR SELECT USING (status = 'available');

CREATE POLICY "Admin can insert cars"
  ON cars FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update cars"
  ON cars FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete cars"
  ON cars FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public can submit sell requests"
  ON sell_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view sell requests"
  ON sell_requests FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update sell requests"
  ON sell_requests FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete sell requests"
  ON sell_requests FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view brands"
  ON brands FOR SELECT USING (true);

CREATE POLICY "Admin can insert brands"
  ON brands FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update brands"
  ON brands FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete brands"
  ON brands FOR DELETE USING (auth.role() = 'authenticated');

-- ========== ADS (إعلانات) ==========

CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  position TEXT NOT NULL CHECK (position IN ('home_between_cards', 'search_sidebar', 'car_detail_sidebar')),
  alt_text TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active ads"
  ON ads FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can insert ads"
  ON ads FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin can update ads"
  ON ads FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can delete ads"
  ON ads FOR DELETE USING (auth.role() = 'authenticated');

-- Also: create storage bucket ad-images (via Supabase UI: Storage → New Bucket → ad-images → Public)

CREATE OR REPLACE FUNCTION increment_ad_views(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET views = views + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE ads SET clicks = clicks + 1 WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
