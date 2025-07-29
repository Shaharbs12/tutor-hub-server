-- Insert default subjects based on Figma designs
INSERT INTO subjects (name, name_he, icon, color, is_active) VALUES
('Math', 'מתמטיקה', '📊', '#4A90E2', TRUE),
('English', 'אנגלית', '📖', '#F5A623', TRUE),
('Programming', 'תכנות', '💻', '#7B68EE', TRUE),
('Physics', 'פיזיקה', '⚛️', '#50E3C2', TRUE),
('Chemistry', 'כימיה', '🧪', '#BD10E0', TRUE),
('French', 'צרפתית', '🇫🇷', '#B8E986', TRUE);

-- Insert sample tutors and students (for development/testing)
-- Note: In production, these would be created through registration

-- Sample users (passwords are hashed version of 'password123')
INSERT INTO users (email, password_hash, user_type, first_name, last_name, phone, city, language_preference) VALUES
('margarita@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor', 'Margarita', 'Cohen', '050-1234567', 'Tel Aviv', 'en'),
('shahrukh@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor', 'Shahrukh', 'Ahmed', '052-9876543', 'Jerusalem', 'en'),
('max@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'tutor', 'Max', 'Johnson', '054-5555555', 'Haifa', 'en'),
('student1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'John', 'Doe', '053-1111111', 'Tel Aviv', 'en'),
('student2@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student', 'Jane', 'Smith', '058-2222222', 'Jerusalem', 'he');

-- Insert tutor profiles
INSERT INTO tutors (user_id, bio, experience_years, hourly_rate, rating, total_reviews, total_students, is_verified) VALUES
(1, 'Experienced math tutor with a passion for helping students excel. Specializing in algebra, calculus, and statistics.', 8, 150.00, 5.00, 45, 120, TRUE),
(2, 'Professional English teacher with 5 years of experience. Expert in grammar, literature, and conversation.', 5, 120.00, 3.50, 28, 85, TRUE),
(3, 'Software developer and programming instructor. Teaches Python, JavaScript, and web development.', 3, 200.00, 2.00, 12, 35, FALSE);

-- Insert student profiles
INSERT INTO students (user_id, grade_level, learning_goals, preferred_learning_style) VALUES
(4, '10th Grade', 'Improve math skills for SAT preparation', 'visual'),
(5, '12th Grade', 'Master English writing and literature analysis', 'reading');

-- Link tutors with subjects
INSERT INTO tutor_subjects (tutor_id, subject_id, skill_level) VALUES
(1, 1, 'expert'),      -- Margarita - Math
(1, 4, 'advanced'),    -- Margarita - Physics
(2, 2, 'expert'),      -- Shahrukh - English
(2, 6, 'intermediate'), -- Shahrukh - French
(3, 3, 'expert'),      -- Max - Programming
(3, 1, 'intermediate'); -- Max - Math