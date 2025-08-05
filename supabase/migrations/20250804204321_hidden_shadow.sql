/*
  # Seed Initial Data for TCG Lean Coach

  1. Sample Data
    - Insert sample courses
    - Insert sample videos
    - Insert sample users for testing

  2. Admin Setup
    - No need for admin table since we use hardcoded credentials
*/

-- Insert sample courses
INSERT INTO courses (title, description, duration, lessons_count, is_premium, order_index) VALUES
('Lean Basics', 'Fundamental principles of Lean methodology', '2 hours', 8, false, 1),
('Six Sigma Belt Overview', 'Understanding the Six Sigma belt system', '3 hours', 12, false, 2),
('DMAIC Process', 'Define, Measure, Analyze, Improve, Control', '4 hours', 16, true, 3),
('5S & Kaizen', 'Workplace organization and continuous improvement', '2.5 hours', 10, true, 4),
('Agile for Continuous Improvement', 'Integrating Agile practices with Lean principles', '3.5 hours', 14, true, 5);

-- Insert sample videos
INSERT INTO videos (title, description, youtube_id, category, duration, views_count, rating, is_premium) VALUES
('Introduction to Lean Methodology', 'Basic introduction to Lean principles', 'dQw4w9WgXcQ', 'courses', '15:30', 2300, 4.8, false),
('Client Success Story - Manufacturing', 'Real-world implementation case study', 'dQw4w9WgXcQ', 'testimonials', '8:45', 1800, 4.9, false),
('Daily Motivation - Mystic Myra Speaks', 'Inspirational content for continuous improvement', 'dQw4w9WgXcQ', 'inspiration', '5:20', 3100, 4.7, false),
('DMAIC Process Explained', 'Deep dive into the DMAIC methodology', 'dQw4w9WgXcQ', 'courses', '22:15', 1500, 4.6, true),
('Advanced Kaizen Techniques', 'Professional-level Kaizen implementation', 'dQw4w9WgXcQ', 'courses', '18:30', 950, 4.8, true);