/**
 * New node file
 */
module.exports = function (context) {
	var util = require("./utils.js")();
	var fs = require('fs');
	
	return {	
		savePicCompResults: function(results) {
			saveImage(PIC_COMP, results.screenNumber, results.image);
			saveTitle(PIC_COMP, results.screenNumber, results.title);
		}
		
	};

	function saveImage(testID, screenNumber, image) {
    	var b64string = image.replace(/^data:image\/png;base64,/,"");
    	var buf = new Buffer(b64string, 'base64');
    	saveResult(testID, screenNumber, buf, ".png");
	}
	
	function saveTitle(testID, screenNumber, title) {
    	saveResult(testID, screenNumber, title, ".txt");
    	context.db.savePicCompResults(context.session.TeamID, {screenNumber: screenNumber, title:title, path: ""});
	}
	
	function saveResult(testID, screenNumber, data, ext) {
		context.db.getResultsPath(writeFile, {data: data, ext: ext, testID: testID, 
			screen: screenNumber});
	}
	
	function writeFile(path, args) {		
		var path = path+"/"+context.session.TeamID+"/"+args.testID;
		if (!fs.existsSync(path))
			fs.mkdirSync(path);
		fs.writeFile(path+"/"+args.screen+args.ext, args.data, 
				function(err) {if (err) throw err;});
	}
};