import nodemailer from 'nodemailer';

export const kirimEmail = (dataEmail) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, 
        requireTLS:true,
        auth: {
          user: "#",
          pass: "jn7jnAPss4f63QBp6D",
        },
      });
      return(
        transporter.sendMail(dataEmail)
        .then(info => console.log(`email terkirim: ${info.messageId}`))
        .catch(err => console.log(`terjadi kesalahan: ${err}`))
      )
};