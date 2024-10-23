import Meeting from "../models/meeting.js";



export const createMeeting = async (req, res) => {
  try {
    const { topic, meetingDate, startTime, endTime, isOnline, location } = req.body;

    // Validate input
    if (!topic || !meetingDate || !startTime || !endTime || isOnline === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }




    // Create a new meeting
    const meeting = await Meeting.create({
      topic,
      meetingDate,
      startTime,
      endTime,
      isOnline,
      location,
    });

    return res.status(201).json({
      success: true,
      message: 'Meeting created successfully',
      data: meeting,
    });
  } catch (error) {
    // Debugging: Log error details
    console.error('Error creating meeting:', error);

    return res.status(500).json({
      success: false,
      message: 'Error creating meeting',
      error,
    });
  }
};



  

// Get all meetings
export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.findAll();
    return res.status(200).json({ success: true, data: meetings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching meetings', error });
  }
};

// Get a specific meeting by ID
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }
    return res.status(200).json({ success: true, data: meeting });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching meeting', error });
  }
};

// Update a meeting
export const updateMeeting = async (req, res) => {
  try {
    const { topic, meetingDate, startTime, endTime, participants, isOnline, location } = req.body;
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    await meeting.update({
      topic,
      meetingDate,
      startTime,
      endTime,
      participants,
      isOnline,
      location,
    });
    return res.status(200).json({ success: true, message: 'Meeting updated successfully', data: meeting });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating meeting', error });
  }
};

// Delete a meeting
export const deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByPk(req.params.id);
    if (!meeting) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    await meeting.destroy();
    return res.status(200).json({ success: true, message: 'Meeting deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting meeting', error });
  }
};
