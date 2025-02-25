const forgotPasswordMail = (user, resetURL) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #d9534f;">🔐 Reset Your Password</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${user.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333; text-align: center;">
            We received a request to reset your password for your <b>Krushak</b> account.
        </p>

        <p style="font-size: 16px; color: #d9534f; font-weight: bold; text-align: center;">
            If you made this request, click the button below to reset your password:
        </p>

        <div style="text-align: center; margin: 20px 0;">
            <a href="${resetURL}" style="display: inline-block; padding: 12px 24px; background-color: #2d89ef; color: white; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px;">
                Reset Your Password 🔐
            </a>
        </div>

        <p style="font-size: 16px; color: #333; text-align: center;">
            This link will expire in 1 hour. If you did not request this, please ignore this email or 
            <a href="mailto:support@krushak.com" style="color: red;">contact our support team</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.com" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

module.exports = forgotPasswordMail ; 