module.exports = function(Cart) {

	Cart.viewCart = function(data, cb)
	{

		cb(null, data);
	}
	Cart.remoteMethod(
		"viewCart",
		{
			accepts: {arg: 'data', type: 'object', 'http': {source: 'body'}},
      returns: {arg: 'output', type: 'object', 'http': {source: 'body'}}
		});

};
