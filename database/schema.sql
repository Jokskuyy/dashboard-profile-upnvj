-- ============================================
-- PostgreSQL Database Schema
-- Dashboard Profile UPNVJ
-- ============================================

-- Drop tables if exists (untuk development)
DROP TABLE IF EXISTS analytics_stats CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS pageviews CASCADE;
DROP TABLE IF EXISTS sessions_analytics CASCADE;
DROP TABLE IF EXISTS visitors CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS asset_details CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS students_summary CASCADE;
DROP TABLE IF EXISTS accreditations CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS professors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS faculties CASCADE;

-- ============================================
-- CORE ACADEMIC TABLES
-- ============================================

-- Faculties Table
CREATE TABLE faculties (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL, -- Hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculty_id VARCHAR(50) NOT NULL,
    professors_count INTEGER DEFAULT 0,
    color VARCHAR(7),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

-- Professors Table
CREATE TABLE professors (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    faculty_id VARCHAR(50) NOT NULL,
    department_id VARCHAR(100),
    expertise TEXT[], -- PostgreSQL array for multiple expertise
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Programs Table
CREATE TABLE programs (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    level VARCHAR(10) NOT NULL, -- S1, S2, S3, D3, D4, etc.
    faculty_id VARCHAR(50) NOT NULL,
    students_count INTEGER DEFAULT 0,
    color VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

-- Accreditations Table
CREATE TABLE accreditations (
    id VARCHAR(100) PRIMARY KEY,
    program_id VARCHAR(100),
    program_name VARCHAR(255) NOT NULL,
    level VARCHAR(10) NOT NULL,
    accreditor VARCHAR(100) NOT NULL,
    valid_until DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE SET NULL
);

-- Students Summary Table (Aggregated by Faculty)
CREATE TABLE students_summary (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(50) NOT NULL UNIQUE,
    total_students INTEGER DEFAULT 0,
    undergraduate INTEGER DEFAULT 0,
    graduate INTEGER DEFAULT 0,
    postgraduate INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id) ON DELETE CASCADE
);

-- ============================================
-- ASSETS & FACILITIES TABLES
-- ============================================

-- Assets Categories Table
CREATE TABLE assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    count INTEGER DEFAULT 0,
    icon VARCHAR(50), -- Icon name for frontend
    color VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Asset Details Table
CREATE TABLE asset_details (
    id VARCHAR(100) PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    room VARCHAR(100),
    building VARCHAR(255),
    capacity INTEGER,
    equipment TEXT[], -- PostgreSQL array
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- ============================================
-- ADMIN & AUTHENTICATION TABLES
-- ============================================

-- Admins Table
CREATE TABLE admins (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hashed password (bcrypt)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'admin', -- super_admin, admin, editor, viewer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Admin Sessions Table
CREATE TABLE sessions (
    id VARCHAR(100) PRIMARY KEY,
    admin_id VARCHAR(100) NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    ip_address VARCHAR(45), -- IPv6 compatible
    user_agent TEXT,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- ============================================
-- ANALYTICS TABLES
-- ============================================

-- Visitors Table
CREATE TABLE visitors (
    visitor_id VARCHAR(100) PRIMARY KEY,
    first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_type VARCHAR(20), -- desktop, mobile, tablet
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    language VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions Analytics Table
CREATE TABLE sessions_analytics (
    session_id VARCHAR(100) PRIMARY KEY,
    visitor_id VARCHAR(100) NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE CASCADE
);

-- Pageviews Table
CREATE TABLE pageviews (
    id BIGSERIAL PRIMARY KEY,
    visitor_id VARCHAR(100) NOT NULL,
    session_id VARCHAR(100),
    page VARCHAR(500) NOT NULL,
    referrer TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions_analytics(session_id) ON DELETE SET NULL
);

-- Events Table
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    visitor_id VARCHAR(100) NOT NULL,
    session_id VARCHAR(100),
    event_name VARCHAR(100) NOT NULL,
    event_data JSONB, -- JSON data for flexible event properties
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES sessions_analytics(session_id) ON DELETE SET NULL
);

-- Analytics Stats Table (Pre-aggregated daily stats)
CREATE TABLE analytics_stats (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_visitors INTEGER DEFAULT 0,
    total_pageviews INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2), -- Percentage
    avg_session_duration INTEGER, -- Seconds
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Faculty & Department Indexes
CREATE INDEX idx_departments_faculty_id ON departments(faculty_id);
CREATE INDEX idx_professors_faculty_id ON professors(faculty_id);
CREATE INDEX idx_professors_department_id ON professors(department_id);
CREATE INDEX idx_professors_email ON professors(email);
CREATE INDEX idx_programs_faculty_id ON programs(faculty_id);
CREATE INDEX idx_programs_level ON programs(level);
CREATE INDEX idx_accreditations_program_id ON accreditations(program_id);
CREATE INDEX idx_accreditations_status ON accreditations(status);
CREATE INDEX idx_accreditations_valid_until ON accreditations(valid_until);
CREATE INDEX idx_students_summary_faculty_id ON students_summary(faculty_id);

-- Assets Indexes
CREATE INDEX idx_asset_details_asset_id ON asset_details(asset_id);

-- Admin Indexes
CREATE INDEX idx_sessions_admin_id ON sessions(admin_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_token ON sessions(token);

-- Analytics Indexes
CREATE INDEX idx_pageviews_visitor_id ON pageviews(visitor_id);
CREATE INDEX idx_pageviews_session_id ON pageviews(session_id);
CREATE INDEX idx_pageviews_timestamp ON pageviews(timestamp);
CREATE INDEX idx_pageviews_page ON pageviews(page);
CREATE INDEX idx_events_visitor_id ON events(visitor_id);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_event_name ON events(event_name);
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_sessions_analytics_visitor_id ON sessions_analytics(visitor_id);
CREATE INDEX idx_sessions_analytics_started_at ON sessions_analytics(started_at);
CREATE INDEX idx_analytics_stats_date ON analytics_stats(date);

-- JSONB Index for event_data (GIN index for better JSON query performance)
CREATE INDEX idx_events_event_data ON events USING GIN (event_data);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON faculties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professors_updated_at BEFORE UPDATE ON professors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accreditations_updated_at BEFORE UPDATE ON accreditations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_summary_updated_at BEFORE UPDATE ON students_summary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asset_details_updated_at BEFORE UPDATE ON asset_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_visitors_updated_at BEFORE UPDATE ON visitors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analytics_stats_updated_at BEFORE UPDATE ON analytics_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: Faculty Overview with Statistics
CREATE OR REPLACE VIEW faculty_overview AS
SELECT 
    f.id,
    f.name,
    f.short_name,
    f.color,
    COUNT(DISTINCT d.id) as total_departments,
    COUNT(DISTINCT pr.id) as total_professors,
    COUNT(DISTINCT pg.id) as total_programs,
    COALESCE(s.total_students, 0) as total_students,
    COALESCE(s.undergraduate, 0) as undergraduate_students,
    COALESCE(s.graduate, 0) as graduate_students,
    COALESCE(s.postgraduate, 0) as postgraduate_students
FROM faculties f
LEFT JOIN departments d ON f.id = d.faculty_id
LEFT JOIN professors pr ON f.id = pr.faculty_id
LEFT JOIN programs pg ON f.id = pg.faculty_id
LEFT JOIN students_summary s ON f.id = s.faculty_id
GROUP BY f.id, f.name, f.short_name, f.color, s.total_students, s.undergraduate, s.graduate, s.postgraduate;

-- View: Active Accreditations
CREATE OR REPLACE VIEW active_accreditations AS
SELECT 
    a.*,
    p.name as full_program_name,
    p.faculty_id,
    f.name as faculty_name
FROM accreditations a
LEFT JOIN programs p ON a.program_id = p.id
LEFT JOIN faculties f ON p.faculty_id = f.id
WHERE a.status = 'active' AND a.valid_until >= CURRENT_DATE
ORDER BY a.valid_until ASC;

-- View: Daily Analytics Summary
CREATE OR REPLACE VIEW daily_analytics AS
SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT visitor_id) as unique_visitors,
    COUNT(*) as total_pageviews,
    COUNT(DISTINCT page) as unique_pages
FROM pageviews
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- View: Popular Pages
CREATE OR REPLACE VIEW popular_pages AS
SELECT 
    page,
    COUNT(*) as pageview_count,
    COUNT(DISTINCT visitor_id) as unique_visitors
FROM pageviews
WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY page
ORDER BY pageview_count DESC
LIMIT 20;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON TABLE faculties IS 'Stores faculty/department information';
COMMENT ON TABLE departments IS 'Stores department information within faculties';
COMMENT ON TABLE professors IS 'Stores professor/lecturer information';
COMMENT ON TABLE programs IS 'Stores academic programs (S1, S2, S3, D3, etc.)';
COMMENT ON TABLE accreditations IS 'Stores program accreditation information';
COMMENT ON TABLE students_summary IS 'Aggregated student counts by faculty';
COMMENT ON TABLE assets IS 'Categories of campus assets and facilities';
COMMENT ON TABLE asset_details IS 'Detailed information about specific assets';
COMMENT ON TABLE admins IS 'Administrator accounts';
COMMENT ON TABLE sessions IS 'Admin session management with JWT tokens';
COMMENT ON TABLE visitors IS 'Website visitor tracking';
COMMENT ON TABLE sessions_analytics IS 'Visitor session tracking for analytics';
COMMENT ON TABLE pageviews IS 'Individual page view tracking';
COMMENT ON TABLE events IS 'Custom event tracking (clicks, interactions, etc.)';
COMMENT ON TABLE analytics_stats IS 'Pre-aggregated daily analytics statistics';
