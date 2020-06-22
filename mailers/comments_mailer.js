const nodeMailer = require('../config/nodemailer');

// another way of exporting a new method
exports.newComment = (comment) => {
    console.log("inside newComment mailer", comment);

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from: 'sankalpraigambhir@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Published',
        //html: '<h1>Yup your comment is now published</h1>' : Earlier
        html: htmlString
    }, (err, info) => {
        if(err){console.log("Error in sending the email", err); return;}
        
        console,log("Message sent!", info);

        return;
    });
} 