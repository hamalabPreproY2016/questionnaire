var count = 5;
var meter = $("meter");
var isAngry = false;
var StartTime = 0;
var isRunning = false;
var State = 0;
var timer;
var expTime;
dateFormat = {
  fmt : {
    "yyyy": function(date) { return date.getFullYear() + ''; },
    "MM": function(date) { return ('0' + (date.getMonth() + 1)).slice(-2); },
    "dd": function(date) { return ('0' + date.getDate()).slice(-2); },
    "hh": function(date) { return ('0' + date.getHours()).slice(-2); },
    "mm": function(date) { return ('0' + date.getMinutes()).slice(-2); },
    "ss": function(date) { return ('0' + date.getSeconds()).slice(-2); }
  },
  format:function dateFormat (date, format) {
    var result = format;
    for (var key in this.fmt)
      result = result.replace(key, this.fmt[key](date));
    return result;
  }
};
var countup = function(){
	rt = Date.now() - StartTime;
	$("#elapsedTime").text("経過時間 : " + parseInt(rt / 1000) + "秒" );
	if (rt > expTime){
		State = changeState(1);
	}
	$(".list").append('<td>　</td>');
	last = $(".list td:last");
	if (isAngry){
		last.addClass("is-angry");
	} else {
		last.addClass("not-angry");
	}
	last.attr('data-time', rt);
	last.opentip((rt / 1000).toString(), { delay: 0 });
	$(".scroll").scrollLeft($(".list").width());
	last.on('click', function(){
		console.log("hi");
		if ($(this).attr("class") === "is-angry")
		{
			$(this).removeClass("is-angry");
			$(this).addClass("not-angry");
		} else {
			$(this).removeClass("not-angry");
			$(this).addClass("is-angry");
		}
	});
}
var changeState = function(s){
		switch(s){
			case 0: // 評価開始
				StartTime = Date.now();
				expTime = (parseInt($("#minutes").val()) * 60 + parseInt($("#seconds").val()) ) * 1000;
				timer = setInterval(countup, 1000);
				$("#Start").text("評価停止");
				s = 1;
			break;
			case 1: // 評価停止
				clearInterval(timer);
				$("#Start").text("評価再開");
				s = 2;
			break;
			case 2: // 評価再開
				// 開始時間に再開を押すまでの時間をプラスする
				StartTime = Date.now() - $(".list td:last").data("time");
				timer = setInterval(countup, 1000);
				$("#Start").text("評価停止");
				s = 1;
			break;
			case -1: // 初期化
				clearInterval(timer);
				$("#Start").text("評価開始");
				$(".list td").remove();
				s = 0;
			break;
		}
		return s;
}
$(function(){
	$("#fileName").val(dateFormat.format(new Date(), 'yyyy-MM-dd-hh-mm-ss'))
	$(".angry-toggle").on('keydown', function(){
		isAngry = true;
		console.log("push");
	});
	$(".angry-toggle").on('keyup', function(){
		isAngry = false;
		console.log("up");
	});
	$("#Start").on('click', function()
	{
		State = changeState(State);
	});
	$("#Init").on('click', function(){
		State = changeState(-1);
	});
	$("#download").on('click', function(){
		var type =  $('input[name="type"]:checked').val();
		var fileName = $("#fileName").val() + "-" + type + ".csv";
		var csv = "";
		$(".list td").each(
			function(index, element){
				time = $(element).data("time");
				isAngry = $(element).hasClass("is-angry");
				
				obj = {"time" : time.toString(), "value" : isAngry};
				csv += time.toString() + "," + (isAngry? 1 : 0) + "\n";
			}
		);
	console.log(fileName);
		$("#download").attr("download", fileName);
		var blob = new Blob([ csv ], { "type" : "text/csv" });
		if (window.navigator.msSaveBlob) { 
			window.navigator.msSaveBlob(blob, fileName); 

			// msSaveOrOpenBlobの場合はファイルを保存せずに開ける
			window.navigator.msSaveOrOpenBlob(blob, fileName); 
		} else {
			document.getElementById("download").href = window.URL.createObjectURL(blob);
		}
	})

});
