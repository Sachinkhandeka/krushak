const profileUpdateMail = (user) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #2d89ef;">🔄 Profile Update Confirmation</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${user.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333; text-align: center;">
            We wanted to let you know that your profile details have been successfully updated on the <b>Krushak Platform</b>.
        </p>

        <h3 style="color: #2d89ef;">Your Updated Details:</h3>
        <ul style="font-size: 16px; color: #333; padding-left: 20px;">
            <li><b>Display Name:</b> ${user.displayName}</li>
            <li><b>Email:</b> ${user.email}</li>
        </ul>

        <p style="font-size: 16px; color: #d9534f; text-align: center;">
            If you did not make these changes, please <a href="mailto:krushak.co.in@gmail.com" style="color: red;">contact our support team</a> immediately.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.com" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

module.exports = profileUpdateMail ; 