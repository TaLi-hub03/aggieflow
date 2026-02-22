const nodemailer = require("nodemailer");

// Create transporter using Gmail (or you can use other services)
// To use Gmail, you'll need to create an App Password: https://support.google.com/accounts/answer/185833
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send a welcome email to a new team member
 * @param {string} memberEmail - Email address of the new member
 * @param {string} memberName - Name of the new member
 * @param {string} teamName - Name of the team (optional)
 */
async function sendWelcomeEmail(memberEmail, memberName, teamName = "AggieFlow Team") {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: memberEmail,
      subject: `Welcome to ${teamName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to ${teamName}! 🎉</h2>
          
          <p>Hi <strong>${memberName}</strong>,</p>
          
          <p>You've been added as a team member to <strong>${teamName}</strong>. You can now:</p>
          
          <ul style="line-height: 1.8;">
            <li>View and manage team events and calendar</li>
            <li>Create, assign, and track tasks</li>
            <li>Collaborate with your team members</li>
            <li>Monitor team workload and activity</li>
          </ul>
          
          <p>
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Get Started
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #64748b;">
            If you have any questions, please contact your team admin.
          </p>
          
          <p style="font-size: 12px; color: #64748b;">
            Best regards,<br>
            <strong>AggieFlow Team</strong>
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send notification email when a task is assigned
 * @param {string} memberEmail - Email of the member
 * @param {string} memberName - Name of the member
 * @param {string} taskTitle - Title of the task
 * @param {string} assignedBy - Name of person who assigned
 */
async function sendTaskAssignmentEmail(memberEmail, memberName, taskTitle, assignedBy = "Team") {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: memberEmail,
      subject: `New Task Assigned: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Task Assigned</h2>
          
          <p>Hi <strong>${memberName}</strong>,</p>
          
          <p><strong>${assignedBy}</strong> has assigned you a new task:</p>
          
          <div style="background: #f8fafc; padding: 16px; border-left: 4px solid #3b82f6; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #1e293b;">${taskTitle}</h3>
          </div>
          
          <p>
            <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/tasks" 
               style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px;">
              View Task
            </a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="font-size: 12px; color: #64748b;">
            AggieFlow Team Task Management
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Task assignment email sent:", info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending task assignment email:", error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendWelcomeEmail,
  sendTaskAssignmentEmail,
};
