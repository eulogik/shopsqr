module.exports = function(Product) {

	/* This remote method is for finding the maximum and minimum price for selected brand */
	Product.getPriceRange = function(data, cb)
	{
		var range = {}; // Object for storing the min and max price value

		/* Here we find out the minimum salePrice of searched products */ 
		Product.find({where: {"brand": {inq: data}}, include: {relation: 'variants', scope: {order: "salePrice ASC", limit: 1}}}, function(err, productdata1)
		{
			/* Here this forEach loop is used because toJSON() doesn't work on returned array, it worked on object*/
			productdata1.forEach(function(record)
			{
				var r = record.toJSON();
				if(r.variants.length != 0)
				{
					range.min = r.variants[0].salePrice;
					//cb(null, range);
				}
			});
		});

		/* Here we find the maximun value of searched products */
		Product.find({where: {"brand": {inq: data}}, include: {relation: 'variants', scope: {order: "salePrice DESC", limit: 1}}}, function(err, productdata2)
		{
			/* Here this forEach loop is used because toJSON() doesn't work on returned array, it worked on object*/
			productdata2.forEach(function(record)
			{
				var r = record.toJSON();
				if(r.variants.length != 0)
				{
					range.max = r.variants[0].salePrice;
					if(range.min)
					{
						cb(null, range);
					}
				}
			});
		});
	}

	Product.remoteMethod(
	"getPriceRange",
	{
		accepts: {arg: "data", type: "array", http: {source: "body"}},
		returns: {arg: "output", type: "object", http: {source: "body"}}
	});

	Product.search = function(data, cb)
	{
		console.log(data);
		var searched = [];

		Product.find({where: {or:[{title: {like: data.search}},{brand: {like: data.search}}], include:{relation:'variants'}}, function(err, result)
		{
		
			if(result.length != 0)
			{
				result.forEach(function(record)
				{
					searched.push(record.toJSON());
					cb(null, result);
				});
			}
			// console.log(searched);
		});

		// Product.app.models.Variant.find({where: {label: {like: data.search}}, include:{relation:'product'}}, function(err, result)
		// {
		// 	if(result.length != 0)
		// 	{
		// 		result.forEach(function(record)
		// 		{
		// 			searched.push(record.toJSON());
		// 			cb(null, result);
		// 		});
		// 	}
		// 	console.log(searched);
		// })
	}

	Product.remoteMethod(
	"search",
	{
		accepts: {arg:"data", type: "object", http: {source: "body"}},
		returns: {arg:"output", type: "object", http: {source: "body"}}
	})
};
