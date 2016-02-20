module.exports = function(StockEntry) {

	/* Model hook for checking is any record is created, updated in StockEntry Model
		 If any stock entry is created then this function is updated the quantity of product variant */
	StockEntry.observe('after save', function(ctx, next)
	{
		// console.log("After Save triggered Model", ctx.Model.modelName);
		// console.log("After Save triggered instance", ctx.instance);
		
		/* This function is for finding the variant quantity and added current stock added of that particular variant */
		StockEntry.app.models.Variant.findById(ctx.instance.variantId, function(err, result)
		{
			if(err)
			{
				console.log(err);
			}
			else
			{
				// console.log(result);
				var totalQuantity = result.quantity + ctx.instance.quantity;

				/* This function is for updating the variant quantity when stock has added or updated of that particular variant */
				StockEntry.app.models.Variant.update({"id":ctx.instance.variantId},{"quantity":totalQuantity}, function(err, data)
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
			}
		});
	});

	/* Model hook for checking is any record is deleted from StockEntry Model to perform inside operation */
	// StockEntry.observe('before delete', function(ctx, next)
	// {
	// 	/* This function is for updating the variant quantity when stock has deleted(remove) of that particular variant */
	// 	StockEntry.app.models.Variant.update({"id":ctx.instance.variantId},{"quantity":0}, function(err, data)
	// 	{
	// 		if(err)
	// 		{
	// 			console.log(err);
	// 		}
	// 		else
	// 		{
	// 			next();
	// 		}
	// 	});
	// });
};