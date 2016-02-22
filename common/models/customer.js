module.exports = function(Customer) {

	/* When Customer registered then this remote method will send an email to registered customer */
  Customer.afterRemote('create', function(context, customer, next) {
    Customer.app.models.Email.send({
      to: customer.email,
      from: "sumit.khajanchi@eulogik.com",
      subject: 'Welcome to ShopSQR',
      html: '<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="border-collapse:collapse;background-color:#f5f8fa;text-align:center;"><tr><td align="center" class="framepadding" style="padding-left:30px;padding-right:30px;"><table class="frame" border="0" cellspacing="0" cellpadding="0" align="center" style="border-collapse:collapse;background-color:#f5f8fa;width:600px;min-width:320px;text-align:center;" align="center"><tr><td style="font-size:15px;font-family:Arial,sans-serif;line-height:18px;"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0" align="left" style="border-collapse:collapse;background-color:rgb(33,150,243);text-align:left;"><tr><td><h2 style="color:#fff">&nbsp;&nbsp;&nbsp; ShopSQR</h2></td></tr></table></td></tr><tr><td><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="left" style="border-collapse:collapse;text-align:left;"><tr><td class="bodypadding" style="padding:30px;font-size:15px;font-family:Arial,sans-serif;line-height:18px;color:#66757f;"><table width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" align="left" style="border-collapse:collapse;text-align:left;"><tr>Hello '+customer.firstName+',<br><br>Welcome to ShopSQR! <br>Thanks for signing up in ShopSQR. You can find attractive deals here !<br> Cheers!<br> ShopSQR<br><center><br><br><div></div></center></td></tr></table></td></tr></table></td></tr><tr><td></td></tr><tr><td bgcolor="#f5f8fa">&nbsp;</td></tr></table></td></tr></table>'
      }, function(err) { 
      if (err) 
        return console.log('> error on sending email');
      console.log('> sending welcome message to: ', customer.email);
    });
    next();
  });
};
