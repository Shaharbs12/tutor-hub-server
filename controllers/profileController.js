const { User, Tutor, Student, Subject } = require('../models');
const bcrypt = require('bcryptjs');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let profile = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'icon', 'color']
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Add type-specific data
    if (profile.userType === 'tutor') {
      const tutorData = await Tutor.findOne({
        where: { userId },
        include: [
          {
            model: Subject,
            as: 'subjects',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });
      profile.dataValues.tutorProfile = tutorData;
    } else if (profile.userType === 'student') {
      const studentData = await Student.findOne({
        where: { userId },
        include: [
          {
            model: Subject,
            as: 'preferredSubjects',
            attributes: ['id', 'name', 'icon']
          }
        ]
      });
      profile.dataValues.studentProfile = studentData;
    }

    res.json({
      message: 'Profile retrieved successfully',
      profile
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      bio,
      currentPassword,
      newPassword
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set new password' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
    }

    // Update basic info
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    // Return updated profile without password
    const updatedProfile = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Email already in use' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Upload profile image (placeholder - would need file upload middleware)
const uploadProfileImage = async (req, res) => {
  try {
    // This is a placeholder implementation
    // In a real app, you'd use multer or similar for file uploads
    const userId = req.user.id;
    const { imageUrl } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.json({
      message: 'Profile image updated successfully',
      profileImage: imageUrl
    });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
};

// Get tutor schedule
const getTutorSchedule = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can access schedule' });
    }

    const tutor = await Tutor.findOne({
      where: { userId },
      attributes: ['availability', 'hourlyRate', 'experienceYears']
    });

    if (!tutor) {
      return res.status(404).json({ error: 'Tutor profile not found' });
    }

    res.json({
      message: 'Schedule retrieved successfully',
      schedule: {
        availability: tutor.availability || [],
        hourlyRate: tutor.hourlyRate,
        experienceYears: tutor.experienceYears
      }
    });
  } catch (error) {
    console.error('Get tutor schedule error:', error);
    res.status(500).json({ error: 'Failed to retrieve schedule' });
  }
};

// Update tutor schedule
const updateTutorSchedule = async (req, res) => {
  try {
    const userId = req.user.id;
    const { availability, hourlyRate, experienceYears } = req.body;

    if (req.user.userType !== 'tutor') {
      return res.status(403).json({ error: 'Only tutors can update schedule' });
    }

    const tutor = await Tutor.findOne({ where: { userId } });
    if (!tutor) {
      return res.status(404).json({ error: 'Tutor profile not found' });
    }

    if (availability) tutor.availability = availability;
    if (hourlyRate) tutor.hourlyRate = hourlyRate;
    if (experienceYears) tutor.experienceYears = experienceYears;

    await tutor.save();

    res.json({
      message: 'Schedule updated successfully',
      schedule: {
        availability: tutor.availability,
        hourlyRate: tutor.hourlyRate,
        experienceYears: tutor.experienceYears
      }
    });
  } catch (error) {
    console.error('Update tutor schedule error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

// Get student preferences
const getStudentPreferences = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.userType !== 'student') {
      return res.status(403).json({ error: 'Only students can access preferences' });
    }

    const student = await Student.findOne({
      where: { userId },
      include: [
        {
          model: Subject,
          as: 'preferredSubjects',
          attributes: ['id', 'name', 'icon']
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    res.json({
      message: 'Preferences retrieved successfully',
      preferences: {
        gradeLevel: student.gradeLevel,
        learningStyle: student.learningStyle,
        preferredSubjects: student.preferredSubjects || []
      }
    });
  } catch (error) {
    console.error('Get student preferences error:', error);
    res.status(500).json({ error: 'Failed to retrieve preferences' });
  }
};

// Update student preferences
const updateStudentPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { gradeLevel, learningStyle, preferredSubjectIds } = req.body;

    if (req.user.userType !== 'student') {
      return res.status(403).json({ error: 'Only students can update preferences' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    if (gradeLevel) student.gradeLevel = gradeLevel;
    if (learningStyle) student.learningStyle = learningStyle;

    await student.save();

    // Update preferred subjects if provided
    if (preferredSubjectIds && Array.isArray(preferredSubjectIds)) {
      await student.setPreferredSubjects(preferredSubjectIds);
    }

    // Return updated preferences
    const updatedStudent = await Student.findOne({
      where: { userId },
      include: [
        {
          model: Subject,
          as: 'preferredSubjects',
          attributes: ['id', 'name', 'icon']
        }
      ]
    });

    res.json({
      message: 'Preferences updated successfully',
      preferences: {
        gradeLevel: updatedStudent.gradeLevel,
        learningStyle: updatedStudent.learningStyle,
        preferredSubjects: updatedStudent.preferredSubjects || []
      }
    });
  } catch (error) {
    console.error('Update student preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

// Add subject to student preferences
const addStudentSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectId, proficiencyLevel = 'beginner', learningGoal } = req.body;

    if (req.user.userType !== 'student') {
      return res.status(403).json({ error: 'Only students can add subjects' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Add subject to student preferences
    await student.addPreferredSubject(subject, {
      through: {
        proficiencyLevel,
        learningGoal
      }
    });

    res.json({
      message: 'Subject added to preferences successfully',
      subject: {
        id: subject.id,
        name: subject.name,
        icon: subject.icon,
        proficiencyLevel,
        learningGoal
      }
    });
  } catch (error) {
    console.error('Add student subject error:', error);
    res.status(500).json({ error: 'Failed to add subject to preferences' });
  }
};

// Remove subject from student preferences
const removeStudentSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectId } = req.params;

    if (req.user.userType !== 'student') {
      return res.status(403).json({ error: 'Only students can remove subjects' });
    }

    const student = await Student.findOne({ where: { userId } });
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Check if subject exists
    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Remove subject from student preferences
    await student.removePreferredSubject(subject);

    res.json({
      message: 'Subject removed from preferences successfully'
    });
  } catch (error) {
    console.error('Remove student subject error:', error);
    res.status(500).json({ error: 'Failed to remove subject from preferences' });
  }
};

// Update user's primary subject
const updateUserSubject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { subjectId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if subject exists if provided
    if (subjectId) {
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found' });
      }
    }

    // Update user's subject
    await user.update({ subjectId: subjectId || null });

    // Return updated profile with subject
    const updatedProfile = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Subject,
          as: 'subject',
          attributes: ['id', 'name', 'icon', 'color']
        }
      ]
    });

    res.json({
      message: 'Subject updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Update user subject error:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getTutorSchedule,
  updateTutorSchedule,
  getStudentPreferences,
  updateStudentPreferences,
  addStudentSubject,
  removeStudentSubject,
  updateUserSubject
};