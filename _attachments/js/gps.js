function gps() {

	this.convertToDec = function (lat, lon) {

		deg = typeof lat[0] === "string" ? parse(lat[0]) : lat[0];
		min = typeof lat[1] === "string" ? parse(lat[1]) : lat[1];
		sec = typeof lat[2] === "string" ? parse(lat[2]) : lat[2];

		var coord = {};
		
		coord.latitude =  deg + min/60 + sec/3600;

		deg = typeof lon[0] === "string" ? parse(lon[0]) : lon[0];
		min = typeof lon[1] === "string" ? parse(lon[1]) : lon[1];
		sec = typeof lon[2] === "string" ? parse(lon[2]) : lon[2];
		
		coord.longitude =  deg + min/60 + sec/3600;

		return coord;
	}

	parse = function (str) {
		var div = str.split('/');
		
		return parseFloat(div[0]) / parseFloat(div[1]);
	}
}

