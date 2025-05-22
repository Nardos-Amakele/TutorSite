const { google } = require("googleapis");
const {oAuth2Client} = require("../config/google_Oauth");

const calendar = google.calendar({ version: "v3", oAuth2Client });

async function createGoogleMeet({ summary, description, startTime, endTime, attendees }) {
  const event = {
    summary,
    description,
    start: {
      dateTime: startTime,
      timeZone: "UTC",
    },
    end: {
      dateTime: endTime,
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

  return response.data;
}

const deleteGoogleMeetEvent = async (eventId) => {
  const calendarId = "primary"; // or your specific calendar ID
  await calendar.events.delete({
    calendarId,
    eventId,
  });
};

module.exports = { createGoogleMeet, deleteGoogleMeetEvent };
