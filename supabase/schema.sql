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
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  created_at TIMESTAMPTZ DEFAULT now()
);

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

ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE sell_requests ENABLE ROW LEVEL SECURITY;

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
