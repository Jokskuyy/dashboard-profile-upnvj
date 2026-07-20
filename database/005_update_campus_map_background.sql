-- Gunakan aset denah dengan background rumput tanpa mengubah koordinat navigasi.
UPDATE public.campus_maps
SET image_url = '/maps/denah-2d-grass-bright.png',
    image_width = 1662,
    image_height = 946,
    updated_at = NOW()
WHERE slug = 'pondok-labu-2d';
