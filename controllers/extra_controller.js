import Lead from "../models/LeadModel.js";

export const myController = async (req, res) => {
  const { id, dateTime } = req.body; // Extracting Lead ID and dateTime from request body

  // Validate input
  if (!id) {
    return res.status(400).json({ error: 'Please provide a valid Lead ID' });
  }

  if (!dateTime) {
    return res.status(400).json({ error: 'Please provide a valid date and time' });
  }

  try {
    // Find the Lead record based on the provided lead ID
    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    // Create a Date object in UTC from the provided dateTime
    const scheduledTimeUTC = new Date(dateTime);
    if (isNaN(scheduledTimeUTC.getTime())) { // Check if scheduledTime is valid
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Convert to IST (UTC+5:30)
    const scheduledTimeIST = new Date(scheduledTimeUTC.getTime() + 5.5 * 60 * 60 * 1000);

    // Calculate 10 minutes before the scheduled time in IST
    const triggerTime = new Date(scheduledTimeIST.getTime() - 10 * 60000); // 10 minutes

    // Calculate the delay in milliseconds
    const delay = triggerTime.getTime() - Date.now();

    if (delay <= 0) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    // Schedule the function to call 10 minutes before the scheduled time
    setTimeout(async () => {
      try {
        console.log('Automatically calling the API 10 minutes before the scheduled time');
        
        // Trigger the controller manually
        const response = await myController({ body: { id } }, { json: console.log });
        console.log('API triggered:', response);
      } catch (error) {
        console.error('Error triggering API:', error);
      }
    }, delay);

    res.json({
      message: 'API scheduled successfully',
      scheduledFor: triggerTime.toISOString(),
    });

  } catch (error) {
    console.error('Error fetching Lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
