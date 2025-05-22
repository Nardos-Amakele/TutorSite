const { google } = require("googleapis");
const { oAuth2Client } = require("../config/google_Oauth");

// Initialize calendar API with authenticated client
const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

// Function to create a Google Meet meeting
async function createGoogleMeet({ summary, description, startTime, endTime, attendees }) {
  try {
    if (!summary || !startTime || !endTime || !attendees) {
      throw new Error("Missing required fields for meeting creation");
    }

    // Convert time strings to full ISO timestamps
    const startDateTime = new Date(startTime).toISOString();
    const endDateTime = new Date(endTime).toISOString();

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: endDateTime,
        timeZone: "UTC",
      },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    if (!response.data || !response.data.hangoutLink) {
      throw new Error("Failed to create Google Meet meeting");
    }

    return {
      id: response.data.id,
      hangoutLink: response.data.hangoutLink,
      startTime: response.data.start.dateTime,
      endTime: response.data.end.dateTime,
      attendees: response.data.attendees
    };
  } catch (error) {
    console.error("Error creating Google Meet meeting:", error);
    throw new Error(`Failed to create Google Meet meeting: ${error.message}`);
  }
}

// Function to delete a Google Meet meeting
const deleteGoogleMeetEvent = async (eventId) => {
  try {
    if (!eventId) {
      throw new Error("Event ID is required for deletion");
    }

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return true;
  } catch (error) {
    console.error("Error deleting Google Meet meeting:", error);
    throw new Error(`Failed to delete Google Meet meeting: ${error.message}`);
  }
};

// Function to get calendar events for a time range
const getCalendarEvents = async (timeMin, timeMax) => {
  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items;
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }
};

// Function to update a calendar event
const updateCalendarEvent = async (eventId, updates) => {
  try {
    if (!eventId) {
      throw new Error("Event ID is required for update");
    }

    const response = await calendar.events.update({
      calendarId: "primary",
      eventId,
      resource: updates,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw new Error(`Failed to update calendar event: ${error.message}`);
  }
};

module.exports = {
  createGoogleMeet,
  deleteGoogleMeetEvent,
  getCalendarEvents,
  updateCalendarEvent
};
