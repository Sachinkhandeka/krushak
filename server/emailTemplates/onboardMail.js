const welcomeMail = (user) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #2d89ef;">🌱 Welcome to Krushak! 🚜</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${user.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333; text-align: center;">
            We are thrilled to have you join <b>Krushak</b>, your one-stop platform for renting farm equipment and enhancing your agricultural experience.
        </p>

        <div style="text-align: center; margin: 20px 0;">
            <a href="https://krushak.com/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #2d89ef; color: white; font-size: 16px; font-weight: bold; text-decoration: none; border-radius: 5px;">
                Start Exploring 🚀
            </a>
        </div>

        <p style="font-size: 16px; color: #333;">
            If you have any questions, feel free to reach out to our support team at 
            <a href="mailto:support@krushak.com" style="color: red;">support@krushak.com</a>.
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.com" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

module.exports = welcomeMail ; 