
const MailCollection = require('../models/Mail');
const UserCollection = require('../models/User')

exports.sendMail = async (req, res) => {
   const { to, body, file, subject } = req.body;
   try {
      const { email } = req.user
      let user = await UserCollection.findOne({ email })
      let friend = await UserCollection.findOne({ email: to });
      let data = await MailCollection.create({
         from: email,
         to,
         body,
         file,
         subject
      })

      user.sendMails.push(data._id)
      friend.recieveMails.push(data._id)
      await user.save()
      await friend.save()
      res.status(201).json({ message: "mail sent successfully" })
   } catch (error) {
      res.status(500).json({ message: "error in sending mail", error: error.message })
   }
}


exports.getSentmail = async (req, res) => {
   const { _id, email } = req.user;


   try {
      // let sentMails = await MailCollection.find({from:email});
      let user = await UserCollection.findOne({ email }).populate('sendMails')
      res.status(200).json({ sentMails: user.sendMails })
   } catch (error) {
      res.status(500).json({ error: error.message, message: "error in getting sent mails" })
   }

}

exports.getRecievedMail = async (req, res) => {
   const { _id, email } = req.user;


   try {
      // let sentMails = await MailCollection.find({from:email});
      let user = await UserCollection.findOne({ email }).populate('recieveMails')
      res.status(200).json({ sentMails: user.recieveMails })
   } catch (error) {
      res.status(500).json({ error: error.message, message: "error in getting sent mails" })
   }
}
exports.deleteSentMail = async (req, res) => {
   let _id = req.params._id;
   let { email } = req.user;

   try {
      let user = await UserCollection.findOne({ email });
      user.sendMails.pull(_id)
      await user.save()
      res.status(200).json({ message: "mail deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: "error in deleting mail", error: error.message })
   }

}
exports.deleteRecieveMail = async (req, res) => {
   let _id = req.params._id;
   let { email } = req.user;

   try {
      let user = await UserCollection.findOne({ email });
      user.recieveMails.pull(_id)
      await user.save()
      res.status(200).json({ message: "mail deleted successfully" });
   } catch (error) {
      res.status(500).json({ message: "error in deleting mail", error: error.message })
   }

}




