-- Example queries for Tutor Hub database

-- 1. Get all tutors with their subjects and ratings
SELECT 
    u.first_name,
    u.last_name,
    u.city,
    t.rating,
    t.hourly_rate,
    t.experience_years,
    s.name as subject_name
FROM users u
JOIN tutors t ON u.id = t.user_id
JOIN tutor_subjects ts ON t.id = ts.tutor_id
JOIN subjects s ON ts.subject_id = s.id
WHERE u.user_type = 'tutor'
ORDER BY t.rating DESC, t.total_reviews DESC;

-- 2. Get tutors by subject with minimum rating
SELECT 
    u.first_name,
    u.last_name,
    t.rating,
    t.hourly_rate,
    t.total_reviews
FROM users u
JOIN tutors t ON u.id = t.user_id
JOIN tutor_subjects ts ON t.id = ts.tutor_id
JOIN subjects s ON ts.subject_id = s.id
WHERE s.name = 'Math' AND t.rating >= 4.0
ORDER BY t.rating DESC;

-- 3. Get recent conversations with last messages
SELECT 
    c.id as conversation_id,
    student.first_name as student_name,
    tutor.first_name as tutor_name,
    s.name as subject,
    c.last_message_at,
    c.status
FROM conversations c
JOIN users student ON c.student_user_id = student.id
JOIN users tutor ON c.tutor_user_id = tutor.id
LEFT JOIN subjects s ON c.subject_id = s.id
ORDER BY c.last_message_at DESC;

-- 4. Get tutor reviews with student names (non-anonymous only)
SELECT 
    tutor_user.first_name as tutor_name,
    student.first_name as student_name,
    r.rating,
    r.review_text,
    r.created_at,
    s.name as subject
FROM reviews r
JOIN tutors t ON r.tutor_id = t.id
JOIN users tutor_user ON t.user_id = tutor_user.id
JOIN users student ON r.student_user_id = student.id
LEFT JOIN subjects s ON r.subject_id = s.id
WHERE r.is_anonymous = 0
ORDER BY r.created_at DESC;

-- 5. Get subject popularity (number of tutors teaching each subject)
SELECT 
    s.name,
    s.name_he,
    COUNT(ts.tutor_id) as tutor_count,
    AVG(t.rating) as avg_rating
FROM subjects s
LEFT JOIN tutor_subjects ts ON s.id = ts.subject_id
LEFT JOIN tutors t ON ts.tutor_id = t.id
GROUP BY s.id, s.name, s.name_he
ORDER BY tutor_count DESC;

-- 6. Get student learning preferences summary
SELECT 
    preferred_learning_style,
    COUNT(*) as student_count
FROM students
WHERE preferred_learning_style IS NOT NULL
GROUP BY preferred_learning_style;

-- 7. Get message count by conversation
SELECT 
    c.id as conversation_id,
    student.first_name as student_name,
    tutor.first_name as tutor_name,
    COUNT(m.id) as message_count,
    MAX(m.created_at) as last_message
FROM conversations c
JOIN users student ON c.student_user_id = student.id
JOIN users tutor ON c.tutor_user_id = tutor.id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, student.first_name, tutor.first_name
ORDER BY last_message DESC;

-- 8. Get tutors with availability and rates by city
SELECT 
    u.city,
    u.first_name,
    u.last_name,
    t.hourly_rate,
    t.rating,
    t.availability_schedule
FROM users u
JOIN tutors t ON u.id = t.user_id
WHERE u.user_type = 'tutor'
ORDER BY u.city, t.hourly_rate;

-- 9. Complex query: Find best tutors for a subject in a specific city
SELECT 
    u.first_name,
    u.last_name,
    u.city,
    t.rating,
    t.hourly_rate,
    t.total_reviews,
    t.experience_years,
    t.is_verified
FROM users u
JOIN tutors t ON u.id = t.user_id
JOIN tutor_subjects ts ON t.id = ts.tutor_id
JOIN subjects s ON ts.subject_id = s.id
WHERE s.name = 'Math' 
    AND u.city = 'Tel Aviv'
    AND t.rating >= 4.0
    AND t.total_reviews >= 10
ORDER BY t.rating DESC, t.total_reviews DESC, t.hourly_rate ASC
LIMIT 5;