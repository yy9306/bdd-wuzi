$(function(){
	var canvasS = 500;
    var row = 13;
    var blockS = canvasS/row;
    var size = 2;
    var qiziSize = 15;
    
    $('.tip-box').hide();
    $('#save-inside').hide();

	var canvas = $('#canvas').get(0);
    canvas.width = canvas.height = canvasS;
	var ctx = canvas.getContext('2d');
    

	var r = function(deg){
    	return (Math.PI/180)*deg;
    }

    var draw = function(){
        
        var img = new Image();
        img.src = 'images/bg.jpg';
        img.onload = function(){
        	var imgs = ctx.createPattern(img,'no-repeat');
        	ctx.fillStyle = imgs;
        	ctx.drawImage(img,-145,-380,795,1350);

    	var jg = blockS/2 + 0.5;
    	var lineWidth = canvasS - blockS;


    	ctx.save();
	    ctx.beginPath();
	    ctx.translate(jg,jg);
	    for( var i = 0; i < row; i++){
	    	ctx.moveTo(0,0);
		    ctx.lineTo(lineWidth,0);
		    ctx.translate(0,blockS);
	    }
	    ctx.stroke();
	    ctx.closePath();
	    ctx.restore();

        ctx.save();
	    ctx.beginPath();
	    ctx.translate(jg,jg);
	    for( var i = 0; i < row; i++){
	    	ctx.moveTo(0,0);
		    ctx.lineTo(0,lineWidth);
		    ctx.translate(blockS,0);
	    }
	    ctx.stroke();
	    ctx.closePath();
	    ctx.restore();
        
        var points = [3.5*blockS + 0.5, 11.5*blockS + 0.5];
        for( var i = 0; i < 2; i++){
        	for( var j = 0; j < 2; j++){
        		var x = points[i];
        		var y = points[j];
        		ctx.save();
		        ctx.beginPath();
	            ctx.arc(x,y,size,0,r(360));
	            ctx.fillStyle = 'black';
	            ctx.fill();
		        ctx.closePath();
			    ctx.restore();
        	}
        }
        
        ctx.save();
		ctx.beginPath();
	    ctx.arc(7.5*blockS + 0.5,7.5*blockS + 0.5,size,0,r(360));
	    ctx.fillStyle = 'black';
	    ctx.fill();
		ctx.closePath();
	    ctx.restore();


    }
    }
    draw();

    var drop = function( qizi ){
    	ctx.save();
    	ctx.beginPath();
    	ctx.translate((qizi.x + 0.5)*blockS + 0.5,(qizi.y + 0.5)*blockS + 0.5);
    	ctx.arc(0,0,qiziSize,0,r(360));
    	if( qizi.color === 1 ){
    		ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			ctx.shadowBlur = 2;
			ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    		ctx.fillStyle = 'black';
    		$('#white_play').get(0).play();
    	}else{
    		ctx.shadowOffsetX = 3;
			ctx.shadowOffsetY = 3;
			ctx.shadowBlur = 2;
			ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    		ctx.fillStyle = 'white';
    		$('#black_play').get(0).play();
    	}
    	ctx.fill();
    	ctx.closePath();
    	ctx.restore();
    }
    
    var panduan = function( qizi ){
    	var shuju = {};
	    $.each(All,function(k,v){
	      if( v.color === qizi.color ){
	        shuju[k] = v;
	      }
	    })
	    var shu = 1,hang=1,zuoxie=1,youxie=1;
	    var tx,ty;

	    // 行
	    tx = qizi.x; ty = qizi.y;
	    while ( shuju [ tx + '-' + (ty + 1) ]){
	      shu ++;ty++;
	    }
	    tx = qizi.x; ty = qizi.y;
	    while ( shuju [ tx + '-' + (ty - 1) ]){
	      shu ++; ty--;
	    }

	    //竖
	    tx = qizi.x ; ty = qizi.y;
	    while( shuju[ (tx+1) + '-' + ty ] ){
	      hang++;tx++;
	    }
	    tx = qizi.x ; ty = qizi.y;
	    while( shuju[ (tx-1) + '-' + ty ] ){
	      hang++;tx--;
	    }
        
        //左斜
	    tx = qizi.x ; ty = qizi.y;
	    while( shuju[ (tx-1) + '-' + (ty-1) ] ){
	      zuoxie++;tx--;ty--;
	    }
	    tx = qizi.x ; ty = qizi.y;
	    while( shuju[ (tx+1) + '-' + (ty+1) ] ){
	      zuoxie++;tx++;ty++;
	    }
        

        //右斜
	    tx = qizi.x ; ty = qizi.y;
	    while( shuju[ (tx+1) + '-' + (ty-1) ] ){
	      youxie++;tx++;ty--;
	    }
	    tx = qizi.x ; ty = qizi.y;
	    while( shuju[ (tx-1) + '-' + (ty+1) ] ){
	      youxie++;tx--;ty++;
	    }

	    if( shu >=5  || hang>=5 || zuoxie>=5 || youxie>=5){
	      return true;
	    }
	  }

    var  sign = true;
    var  All = {};
    var step = 1;
    
   
    $('#canvas').on('click',function(e){
        var x = Math.floor(e.offsetX/blockS);
        var y = Math.floor(e.offsetY/blockS);
        if( All[x + '-' + y]){
        	return;
        }
        var qizi;
	    if( sign ){
	      qizi = {x:x,y:y,color:1,step:step};
	      drop(qizi);
	      if( panduan(qizi) ){
	        $('.tip-box').show();
	      };
	    }else{
	      qizi = {x:x,y:y,color:0,step:step};
	      drop(qizi);
	      if( panduan(qizi) ){
	        $('.tip-box').show();
	      };
	    }
	    step += 1;
	    sign = !sign;
	    All[ x + '-' + y ] = qizi;
    })
    
    $('.hide').on('click',function(){
    	$('.tip-box').hide();
    })

    $('#goon').on('click',function(){
    	$('.tip-box').hide();
    	ctx.clearRect(0,0,600,600);
	    draw();
	    sign = true;
	    All = {};
	    step = 1;
    })

    $('#save').on('click',function(){
    	$('.tip-box').hide();
    	$('#save-inside').show();
    	ctx.save();
	    ctx.font = "20px consolas";
	    for( var i in All){
	      if( All[i].color === 1){
	          ctx.fillStyle = '#fff';
	      }else{
	        ctx.fillStyle = 'black';
	      }
	      ctx.textAlign = 'center';
	      ctx.textBaseline = 'middle';

	      ctx.fillText(All[i].step,
	        (All[i].x+0.5)*blockS,
	        (All[i].y+0.5)*blockS);
	    }
	    ctx.restore();
	    var image = canvas.toDataURL('image/jpg',1);
	    $('#save-inside').attr('href',image);
	    $('#save-inside').attr('download','save-qipu.png');

    })

    $('#game').on('click',function(){
    	$('.start').css('display','none');
    })

})