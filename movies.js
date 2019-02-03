var base;
function initialize () {
	getBasePath();
}

function sendRequest () {
	document.getElementById("description").innerHTML = "";
	document.getElementById("movie").innerHTML = "";
	document.getElementById("img").innerHTML = "";
	document.getElementById("credits").innerHTML = "";
	var xhr = new XMLHttpRequest();
	var query = encodeURI(document.getElementById("form-input").value);
	xhr.open("GET", "proxy.php?method=/3/search/movie&query=" + query);
	xhr.setRequestHeader("Accept","application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var json = JSON.parse(this.responseText);
			var str = "<ol>";
			for (i=0;i<json.results.length;i++){
				str = str+"<li id='"+json.results[i].id+"' onclick='getCredits(this);getDescription(this);'>"+json.results[i].title+"</li><label class='results'>"+json.results[i].release_date+"</label>"
			}
			str = str+"</ol>"
			document.getElementById("output").innerHTML = str;
		}
	};
	xhr.send(null);
}

function getDescription(element){
	
	var id = element.id;
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "proxy.php?method=/3/movie/" + id);
	xhr.setRequestHeader("Accept","application/json");
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			var json = JSON.parse(this.responseText);
			var str;
			if (json.poster_path==null){
				str	= "<img src='default.png' width='185px' height='277px'>";
			}
			else{
				str	= "<img src='"+base+json.poster_path+"'>";
			}
			document.getElementById("img").innerHTML = str;
			str = "<label class='title'>"+json.title+"</label>";
			str = str+"<label class='genres'>";
			for (i=0;i<json.genres.length;i++){
				if(i<json.genres.length-1){
					str = str+json.genres[i].name+",";
				}
				else{
					str = str+json.genres[i].name;
				}
			}
			str+="</label>";
			document.getElementById("movie").innerHTML = str;
			str = "<label class='overview'>"+json.overview+"</label>";
			document.getElementById("description").innerHTML = str;
		}
	};
	xhr.send(null);
}

function getBasePath(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
	if (this.readyState == 4) {
			base = JSON.parse(this.responseText);
			//base = base.images.base_url+base.images.poster_sizes[base.images.poster_sizes.length-1];
			base = base.images.base_url+base.images.poster_sizes[2];
		}
	};
	xhr.open("GET", "proxy.php?method=/3/configuration");
	xhr.send(null);	
}

function getCredits(element){
	var id = element.id;
	console.log("Id2"+id); 
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (this.readyState==4){
			var cast = JSON.parse(this.responseText);		
			var c = "";
			var j = Math.min(5,cast.cast.length); 
			for(i=0;i<j;i++){
				c = c+cast.cast[i].name+",";
			}
			credits = c.substr(0,c.length-1);
			console.log(credits);
			document.getElementById("credits").innerHTML = credits;
		}
	}
	xhr.open("GET","proxy.php?method=/3/movie/"+id+"/credits");
	xhr.send(null);
}