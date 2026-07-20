-- =============================================================================
-- DENAH KAMPUS 2D: map, marker gedung, node jalan, dan edge navigasi
-- Aman dijalankan pada database yang sudah memakai 001_full_setup.sql.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.campus_maps (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_width INT NOT NULL CHECK (image_width > 0),
    image_height INT NOT NULL CHECK (image_height > 0),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_campus_maps_single_active
    ON public.campus_maps (is_active)
    WHERE is_active = TRUE;

CREATE TABLE IF NOT EXISTS public.campus_map_nodes (
    id BIGSERIAL PRIMARY KEY,
    map_id BIGINT NOT NULL REFERENCES public.campus_maps(id) ON DELETE CASCADE,
    label TEXT,
    node_type TEXT NOT NULL CHECK (node_type IN ('path', 'building_entrance', 'gate')),
    x DOUBLE PRECISION NOT NULL CHECK (x BETWEEN 0 AND 1),
    y DOUBLE PRECISION NOT NULL CHECK (y BETWEEN 0 AND 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.campus_map_edges (
    id BIGSERIAL PRIMARY KEY,
    map_id BIGINT NOT NULL REFERENCES public.campus_maps(id) ON DELETE CASCADE,
    from_node_id BIGINT NOT NULL REFERENCES public.campus_map_nodes(id) ON DELETE CASCADE,
    to_node_id BIGINT NOT NULL REFERENCES public.campus_map_nodes(id) ON DELETE CASCADE,
    bidirectional BOOLEAN NOT NULL DEFAULT TRUE,
    accessible BOOLEAN NOT NULL DEFAULT TRUE,
    weight DOUBLE PRECISION CHECK (weight IS NULL OR weight > 0),
    CHECK (from_node_id <> to_node_id),
    UNIQUE (map_id, from_node_id, to_node_id)
);

CREATE TABLE IF NOT EXISTS public.campus_map_building_points (
    id BIGSERIAL PRIMARY KEY,
    map_id BIGINT NOT NULL REFERENCES public.campus_maps(id) ON DELETE CASCADE,
    gedung_id INT NOT NULL REFERENCES public.gedung(id) ON DELETE CASCADE,
    marker_x DOUBLE PRECISION NOT NULL CHECK (marker_x BETWEEN 0 AND 1),
    marker_y DOUBLE PRECISION NOT NULL CHECK (marker_y BETWEEN 0 AND 1),
    entrance_node_id BIGINT REFERENCES public.campus_map_nodes(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (map_id, gedung_id)
);

CREATE INDEX IF NOT EXISTS idx_campus_map_nodes_map ON public.campus_map_nodes(map_id);
CREATE INDEX IF NOT EXISTS idx_campus_map_edges_map ON public.campus_map_edges(map_id);
CREATE INDEX IF NOT EXISTS idx_campus_map_edges_from ON public.campus_map_edges(from_node_id);
CREATE INDEX IF NOT EXISTS idx_campus_map_edges_to ON public.campus_map_edges(to_node_id);
CREATE INDEX IF NOT EXISTS idx_campus_map_buildings_map ON public.campus_map_building_points(map_id);
CREATE INDEX IF NOT EXISTS idx_campus_map_buildings_gedung ON public.campus_map_building_points(gedung_id);

ALTER TABLE public.campus_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_map_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_map_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_map_building_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS campus_maps_public_select ON public.campus_maps;
DROP POLICY IF EXISTS campus_maps_auth_all ON public.campus_maps;
CREATE POLICY campus_maps_public_select ON public.campus_maps
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY campus_maps_auth_all ON public.campus_maps
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS campus_map_nodes_public_select ON public.campus_map_nodes;
DROP POLICY IF EXISTS campus_map_nodes_auth_all ON public.campus_map_nodes;
CREATE POLICY campus_map_nodes_public_select ON public.campus_map_nodes
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY campus_map_nodes_auth_all ON public.campus_map_nodes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS campus_map_edges_public_select ON public.campus_map_edges;
DROP POLICY IF EXISTS campus_map_edges_auth_all ON public.campus_map_edges;
CREATE POLICY campus_map_edges_public_select ON public.campus_map_edges
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY campus_map_edges_auth_all ON public.campus_map_edges
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS campus_map_building_points_public_select ON public.campus_map_building_points;
DROP POLICY IF EXISTS campus_map_building_points_auth_all ON public.campus_map_building_points;
CREATE POLICY campus_map_building_points_public_select ON public.campus_map_building_points
    FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY campus_map_building_points_auth_all ON public.campus_map_building_points
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.campus_maps (
    slug,
    nama,
    image_url,
    image_width,
    image_height,
    is_active
) VALUES (
    'pondok-labu-2d',
    'Kampus Pondok Labu',
    '/maps/denah-2d-grass-bright.png',
    1662,
    946,
    TRUE
)
ON CONFLICT (slug) DO UPDATE SET
    nama = EXCLUDED.nama,
    image_url = EXCLUDED.image_url,
    image_width = EXCLUDED.image_width,
    image_height = EXCLUDED.image_height,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

COMMENT ON TABLE public.campus_maps IS 'Master gambar denah kampus 2D';
COMMENT ON TABLE public.campus_map_nodes IS 'Titik belokan, persimpangan, gerbang, dan pintu gedung';
COMMENT ON TABLE public.campus_map_edges IS 'Jalur yang dapat dilewati di antara dua node denah';
COMMENT ON TABLE public.campus_map_building_points IS 'Posisi pointer dan pintu masuk gedung pada denah';
