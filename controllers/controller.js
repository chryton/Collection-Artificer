
module.exports = {
	test: function (req, res) {
		return res.status(200).json({'success': true, 'res': 'test'});
	}
	
};