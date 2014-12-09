var count = 0,
	totalSecond = 0,
	beforeIterator = 0,
	secNumber = 0,
	percent = 0;

var interval = function(){
	if(count < 100)
	{
		count ++;
	}
	postMessage({'cmd': 'pbar', "value": count});
	var iterations = parseInt(totalSecond * (count/100));
	if(iterations != beforeIterator){
		secNumber --;
		postMessage({'cmd': 'time', "value": secNumber});

		beforeIterator = iterations;
	}

	if(count >= 100 && secNumber <= 0){
		interval = null;
		postMessage({'cmd': 'timeout'});
		setTimeout(function(){
			me.responseAnswer();
		},1000)
	} 
	if(typeof interval == "function"){
		setTimeout(function(){
			interval();
		},percent)
	}
}

self.addEventListener('message', function(e) {
	var data = e.data;
  	switch (data.cmd) {
  		case "start":
  			interval();
  			totalSecond = data.totalSecond;
  			secNumber = totalSecond;
  			percent = data.percent;
  			break;
  		case "stop":
  			interval = null;
  			postMessage({'cmd': 'stop'});
  			break;
  	}
})