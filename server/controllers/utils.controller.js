var nodeMailer = require('nodemailer')

exports.mail = (id) => {
    console.log("In Mail", id)
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'lekya.sheral05@gmail.com',
            pass: 'ryandee05'
        }
    });
    let mailOptions = {
        from: '"TPO BVRIT Hyderabad" <xxxxx@bvrithyderabad.edu.in>', // sender address
       
     to :id+'@bvrithyderabad.edu.in',
   subject : 'Placement Portal:Registrated Successfully.',
    text : 'You have successfully submitted the initial Registration Form. Your profile will be updated after the details are verified by you',
    html :  'You have successfully submitted the initial Registration Form. Your profile will be updated after the details are verified by you',
    //  to: req.body.to, // list of receivers
    //     subject: req.body.subject, // Subject line
    //     text: req.body.body, // plain text body
    //     html: req.body.html // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
            // res.render('index');
        });
    }
  