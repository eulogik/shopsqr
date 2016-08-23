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
					next();
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
					next();
				});
			});
		}
		else
		{
			next();
		}
	});

	/* This remote method is for get the orders data group with createdAt */
	Order.getChartData = function(data, cb)
	{
		// console.log("Request Data "+data);
		if(data.range != undefined)
		{
			if(data.range == "days")
			{
				var groupQuery = { $group : {_id : { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" } },
     										 							count: { $sum: 1 }
      															}
    											}
			}
			else if(data.range == "months")
			{
				var groupQuery = { $group : {_id : { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
     										 							count: { $sum: 1 }
      															}
    											}
			}
			else
			{
				var groupQuery = { $group : {_id : { year: { $year: "$createdAt" } },
     										 							count: { $sum: 1 }
      															}
    											}
			}
		}

		var Orders = Order.getDataSource().connector.collection('Order');
		Orders.aggregate([ groupQuery ],function(err, groupByOrders)
		{
		  if(err)
		  {
				console.log(err);
				cb(null, err);
		  }
		  else
		  {
		  	// console.log(groupByOrders);
		  	cb(null, groupByOrders);
		  }
		});
	}

	Order.remoteMethod("getChartData",
	{
		accepts: {arg: "data", type: "object", http: {source: "body"}},
		returns: {arg: "output", type: "object", http: {source: "body"}}
	})

	/* This remote method is for get the orders data group with createdAt */
	Order.getSalesChartData = function(data, cb)
	{
		// console.log(data);
		if(data.range != undefined)
		{
			if(data.range == "days")
			{
				var groupQuery = { $group : {_id : { month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" }, year: { $year: "$createdAt" }, status : "$status"},
																			count: { $sum: 1 }
      															}
    											}
			}
			else if(data.range == "months")
			{
				var groupQuery = { $group : {_id : { month: { $month: "$createdAt" }, year: { $year: "$createdAt" }, status : "$status"},
     										 							count: { $sum: 1 }
      															}
    											}
			}
			else
			{
				var groupQuery = { $group : {_id : { year: { $year: "$createdAt" }, status : "$status" },
     										 							count: { $sum: 1 }
      															}
    											}
			}
		}
		
		var Orders = Order.getDataSource().connector.collection('Order');
		Orders.aggregate([ groupQuery ],function(err, groupBySales)
		{
		  if(err)
		  {
				console.log(err);
				cb(null, err);
		  }
		  else
		  {
		  	// console.log(groupBySales);
		  	cb(null, groupBySales);
		  }
		});
	}

	Order.remoteMethod("getSalesChartData",
	{
		accepts: {arg: "data", type: "object", http: {source: "body"}},
		returns: {arg: "output", type: "object", http: {source: "body"}}
	})
};
