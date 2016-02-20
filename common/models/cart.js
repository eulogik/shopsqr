module.exports = function(Cart) {

	Cart.viewCart = function(data, cb)
	{
		// console.log(data);
		var cart = {};
		Cart.app.models.Variant.findById(data.variantId, function(err, variantdata)
		{
			Cart.app.models.Product.findById(variantdata.productId, function(err, productdata)
			{
				cart.productTitle = productdata.title;
				cart.productDesc = productdata.description;
				cart.variantLabel = variantdata.label;
				cart.variantPrice = variantdata.price;
				cart.productSalePrice = variantdata.salePrice;
				cb(null, cart);
			});
		});
	}
	Cart.remoteMethod(
		"viewCart",
		{
			accepts: {arg: 'data', type: 'object', 'http': {source: 'body'}},
      returns: {arg: 'output', type: 'object', 'http': {source: 'body'}}
		});

};
