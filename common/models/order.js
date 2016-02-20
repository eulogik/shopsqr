module.exports = function(Order) {

	/* Model hook for checking is any Order is created or updated in Order Model 
		 If any Order is created then this function is created a stock entry with (-ve) quantity 
		 which is being purchased by customer */
	Order.observe('after save', function(ctx, next)
	{
		if(ctx.instance.status == "pending")
		{
			ctx.instance.cart.forEach(function(record)
			{
				var stockdata = {
		    "quantity": (0-record.quantity),
		    "createdBy": record.customerId,
		    "createdAt": new Date(),
		    "note": "product purchased with quantity "+record.quantity,
		    "variantId": record.variantId
			  }
				Order.app.models.stockEntry.create(stockdata, function(err, data)
				{
					if(err)
					{
						console.log(err);
					}
					else
					{
						next();
					}
				});
			});
		}
		else if(ctx.instance.status == "cancelled")
		{
			ctx.instance.cart.forEach(function(record)
			{
				var stockdata = {
		    "quantity": record.quantity,
		    "createdBy": record.customerId,
		    "createdAt": new Date(),
		    "note": "product cancelled (returned) with quantity "+record.quantity,
		    "variantId": record.variantId
			  }
				Order.app.models.stockEntry.create(stockdata, function(err, data)
				{
					if(err)
					{
						console.log(err);
					}
					else
					{
						next();
					}
				});
			});
		}
		else
		{
			next();
		}
	});
};
