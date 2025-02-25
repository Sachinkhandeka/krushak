const changePasswordMail = (user) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #d9534f;">🔒 Password Changed Successfully</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${user.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333; text-align: center;">
            We wanted to inform you that your password has been successfully changed on the <b>Krushak Platform</b>.
        </p>

        <p style="font-size: 16px; color: #d9534f; font-weight: bold; text-align: center;">
            If you did not request this change, please 
            <a href="mailto:support@krushak.com" style="color: red;">contact our support team</a> immediately.
        </p>

        <div style="text-align: center; margin: 20px 0;">
            <a href="https://krushak.com/login" style="display: inline-block; padding: 12px 24px; background-color: #2d89ef; color: white; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px;">
                Login to Your Account
            </a>
        </div>

        <p style="font-size: 16px; color: #333; text-align: center;">
            For security reasons, we recommend keeping your password safe and updating it regularly.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.com" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

module.exports = changePasswordMail ; 