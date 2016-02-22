module.exports = function(Product) {

	/* This remote method is for finding the maximum and minimum price for selected brand */
	Product.getPriceRange = function(data, cb)
	{
		console.log(data);
		Product.find({include: 'varient'}, function(err, result)
		{
			console.log(result);
			/* forEach loop for finding the max and min value in number of brands is being query */ 

			cb(null, result);
		})
	}
	Product.remoteMethod(
		"getPriceRange",
		{
			accepts: {arg:"data", type:"array", http:{source:"body"}},
			returns: {arg:"output", type:"object", http:{source:"body"}}
		});
};
