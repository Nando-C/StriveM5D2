import sgMail from '@sendgrid/mail'

export const sendEmail = async recipientAddress => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: recipientAddress,
        from: process.env.SENDER_EMAIL,
        subject: "New Post Created Successfully",
        text: "Testing the mail function from the backend",

    }

    await sgMail.send(msg)

}