var MainLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
        if( 'touches' in sys.capabilities )
            this.setTouchEnabled(true);
        else if ('mouse' in sys.capabilities )
            this.setMouseEnabled(true);
    },
    init:function () {
	    var bRet = false;
	    if (this._super()) {
		    draw = cc.DrawNode.create();
	        this.addChild( draw, 10 );
	        this.winSize = cc.Director.getInstance().getWinSize();
	        this.margin = this.winSize.width / 12;
	        this.cellSize = this.margin * 2;

            //玩家属性
            this.currentUser = 1;
            this.players = {
            	1: {chessColor: cc.c4f(1,0,0,1), dColor: "红色"}, 
                2: {chessColor: cc.c4f(0,1,0,1), dColor: "绿色"}
            };

            //初始化棋局
            this.chessboard = [
            	[1, 2, 1, 1, 1, 2],
            	[1, 2, 1, 1, 1, 2],
            	[1, 2, 1, 1, 1, 2],
	        	[1, 2, 1, 1, 1, 2],
            	[1, 2, 1, 1, 1, 2],
            	[0, 0, -1, 0, 0, 1]
            ];

            this.toEatNumber = 0;
            this.mStatus = 'put';

	        bRet = true;
        }
        this.tip = "现在轮到" + this.players[this.currentUser].dColor + "下棋了", "Impact";
        this.refresh();

        return bRet;
    },
    onMouseUp: function (event) {
        var location = event.getLocation();
        var x = parseInt(location.x / this.cellSize);
        var y = parseInt((this.winSize.height - location.y) / this.cellSize);

        console.log(x + "  " + y);

        if(x > 5 || y > 5 || x < 0 || y < 0){return;}

        if(this.mStatus == 'eat'){
            if(this.toEatNumber > 0 && this.chessboard[y][x] == (this.currentUser == 1 ? 2 : 1)){
               this.chessboard[y][x] = -1;
               this.toEatNumber--;
            }
            if(this.toEatNumber <= 0){
                this.mStatus = 'put';
                this.currentUser = this.currentUser == 1 ? 2 : 1;
            }
          
        }else if(this.mStatus == 'put'){
            if(this.chessboard[y][x] != 0){
                this.tip = "不能放在这里";
                this.refresh();
                return;
            }else{
                this.chessboard[y][x] = this.currentUser;
                this.judge(y, x);
                if(this.toEatNumber > 0){
                  this.mStatus = 'eat';
                  this.tip = "现在进入吃模式，你可以点选" + this.toEatNumber + "个对方棋子";
                  this.refresh();
                  return;
                }
                this.currentUser = this.currentUser == 1 ? 2 : 1;
            }
        }
        if(this.allPostionHasChess()){
            this.tip = "和棋了";
            this.refresh();
            return;
        }

        this.tip = "现在轮到" + this.players[this.currentUser].dColor + "下棋了", "Impact";
        this.refresh();

    },
    onTouchEnded: function(touch, event){
    	
    },
    judge: function(curPositionY, curPositionX){
        if(this.chessboard[curPositionY])
        var allYLine = true;
        for(var i=0;i< 6; i++){
            if(this.chessboard[curPositionY][i] != this.currentUser){
               allYLine = false; 
            }
        }
        if(allYLine)
            this.toEatNumber++;

        var allXLine = true;
        for(var j=0;j< 6;j++){
            if(this.chessboard[j][curPositionX] != this.currentUser){
                allXLine = false;
            }
        }
        if(allXLine)
            this.toEatNumber++;

    },
    refresh: function(){
        draw.clear();
	    //draw棋盘
        //先draw水平线
        var hStart = this.margin;
        var hEnd = this.winSize.width - this.margin;
        for(var i = 0;i<6;i++){
            draw.drawSegment(cc.p(this.margin, this.winSize.height - this.margin - this.cellSize*i), cc.p(hEnd,this.winSize.height - this.margin - this.cellSize*i), 1, cc.c4f(1, 1, 1, 1));
        }
        //再draw垂直线
        var vStart = this.winSize.height - this.margin;
        var vEnd = this.winSize.height - this.margin - this.cellSize * 5;
        for(var j=0;j<6; j++){
			draw.drawSegment(cc.p(this.margin + this.cellSize*j, vStart), cc.p(this.margin + this.cellSize*j, vEnd), 1, cc.c4f(1, 1, 1, 1));
	    }
    	//显示棋子
        for(var s=0;s<6;s++){
        	for(var t=0;t<6;t++){
                if(this.chessboard[s][t] == -1){
                   draw.drawDot( cc.p(this.margin + t * this.cellSize, this.winSize.height - this.margin - s * this.cellSize), 10, cc.c4f(0,0,1,1));
               }else if(this.chessboard[s][t] != 0){
                   draw.drawDot( cc.p(this.margin + t * this.cellSize, this.winSize.height - this.margin - s * this.cellSize), 10, this.players[this.chessboard[s][t]].chessColor);
               }
        	}
        }
        //tip label
        this.removeChild(this.lblTip);
        this.lblTip = cc.LabelTTF.create(this.tip, "Impact", 30);
        this.addChild(this.lblTip, 5);
        this.lblTip.setPosition(this.winSize.width/2, 100);
        this.lblTip.setOpacity(200);
    },
    allPostionHasChess: function(){
        var ret = true;
        for(var s=0;s<6;s++){
            for(var t=0;t<6;t++){
                if(this.chessboard[s][t] == 0){
                   ret = false;
                   break;  
                }
            }
        }
        return ret;    
    }
});