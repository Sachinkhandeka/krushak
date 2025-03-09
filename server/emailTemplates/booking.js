const bookingConfirmationEmail = (user, owner, equipment) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #2d89ef;">📌 Equipment Booking Confirmed 🚜</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${user.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333;">
            You have successfully booked <strong>${equipment.name}</strong>.
        </p>

        <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <p><strong>📌 Equipment:</strong> ${equipment.name}</p>
            <p><strong>💰 Price:</strong> ₹${equipment.pricing[0].price} / ${equipment.pricing[0].unit}</p>
            <p><strong>👤 Owner:</strong> ${owner.displayName}</p>
            <p><strong>📞 Contact:</strong> <a href="tel:${owner.phone}" style="color: green; font-weight: bold;">${owner.phone}</a></p>
        </div>

        <p>If you have any issues, contact our support at <a href="mailto:support@krushak.com" style="color: red;">support@krushak.com</a></p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.co.in" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

const ownerBookingNotificationEmail = (user, owner, equipment) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #2d89ef;">🔔 New Booking Received 🚜</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${owner.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333;">
            Your equipment <strong>${equipment.name}</strong> has been booked.
        </p>

        <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <p><strong>📌 Equipment:</strong> ${equipment.name}</p>
            <p><strong>💰 Price:</strong> ₹${equipment.pricing[0].price} / ${equipment.pricing[0].unit}</p>
            <p><strong>👤 User:</strong> ${user.displayName}</p>
            <p><strong>📞 Contact:</strong> <a href="tel:${user.phone}" style="color: green; font-weight: bold;">${user.phone}</a></p>
        </div>

        <p>Please contact the user for further communication.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.co.in" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

const adminBookingNotificationEmail = (user, owner, equipment) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #d9534f;">📢 New Booking Alert 🚜</h2>
            <p style="font-size: 16px; color: #333;">Hello Admin,</p>
        </div>

        <p style="font-size: 16px; color: #333;">
            A new equipment booking has been made.
        </p>

        <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-top: 10px;">
            <p><strong>📌 Equipment:</strong> ${equipment.name}</p>
            <p><strong>💰 Price:</strong> ₹${equipment.pricing[0].price} / ${equipment.pricing[0].unit}</p>
            <p><strong>👤 User:</strong> ${user.displayName} | 📞 <a href="tel:${user.phone}" style="color: green;">${user.phone}</a></p>
            <p><strong>👨‍🌾 Owner:</strong> ${owner.displayName} | 📞 <a href="tel:${owner.phone}" style="color: green;">${owner.phone}</a></p>
        </div>

        <p>Log in to the admin panel for more details.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.co.in" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};

const bookingStatusUpdateEmail = (user, owner, equipment, status) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
        <div style="text-align: center;">
            <h2 style="color: #f0ad4e;">🔔 Booking ${status} 🚜</h2>
            <p style="font-size: 16px; color: #333;">Dear <b>${user.displayName}</b>,</p>
        </div>

        <p style="font-size: 16px; color: #333;">
            Your booking for <strong>${equipment.name}</strong> has been <b>${status}</b>.
        </p>

        <p>If you have any questions, contact our support team at <a href="mailto:support@krushak.com" style="color: red;">support@krushak.com</a>.</p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        
        <p style="text-align: center; font-size: 12px; color: #777;">
            🚜 Happy Farming! 🚜 <br>
            <b>Krushak Team</b> | <a href="https://krushak.com" style="color: #2d89ef; text-decoration: none;">www.krushak.com</a>
        </p>
    </div>
    `;
};


module.exports = {
    bookingConfirmationEmail,
    ownerBookingNotificationEmail,
    adminBookingNotificationEmail,
    bookingStatusUpdateEmail
}
