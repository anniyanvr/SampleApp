//ask if adaptive m3u8 file

if (!String.prototype.endsWith) 
{
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}


function tryToPlay(name) 
{
	fetch("streams/"+ name +"_adaptive.m3u8", {method:'HEAD'})
	.then(function(response) {
		if (response.status == 200) {
			// adaptive m3u8 exists,play it
			initializePlayer(name+"_adaptive", "m3u8");
		}
		else 
		{
			//adaptive m3u8 not exists, try m3u8 exists.
			fetch("streams/"+ name +".m3u8", {method:'HEAD'})
			.then(function(response) {
				if (response.status == 200) {
					//m3u8 exists, play it
					initializePlayer(name, "m3u8");
				}
				else {
					//no m3u8 exists, try vod file
					fetch("streams/"+ name +".mp4", {method:'HEAD'})
					.then(function(response) {
						if (response.status == 200) {
							//mp4 exists, play it
							initializePlayer(name, "mp4");
						}
						else {
							console.log("No stream found");
							setTimeout(function() { tryToPlay(name); }, 5000);

						}
					}).catch(function(err) {
						console.log("Error: " + err);
					});

				}
			}).catch(function(err) {
				console.log("Error: " + err);
			});
		}
	}).catch(function(err) {
		console.log("Error: " + err);
	});
}

function isMobile() { 
	if( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
	)
	{
		return true;
	}
	else {
		return false;
	}
}