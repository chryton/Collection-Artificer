(function(){
	$('input[type="submit"]').on("click", function(e){
		e.preventDefault();
		var inputData = $('form input#searchtermfield');
		console.log(inputData);
	});
	$('form').on("focus", function(){
		console.log('words')
	})
});