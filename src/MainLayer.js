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
            	1: {chessColor: cc.c4f(1,0,0,1), dColor: "红色", eatNum: 0}, 
                2: {chessColor: cc.c4f(0,1,0,1), dColor: "绿色", eatNum: 0}
            };

            //初始化棋局
            this.chessboard = [
            	[1, 1, 1, 1, 1, 1],
            	[1, 1, 0, 1, 1, 1],
            	[1, 2, 1, 0, 2, 1],
	        	[1, 2, 1, 0, 2, 1],
            	[1, 2, 1, 1, 1, 1],
            	[1, 2, 1, 1, 1, 1]
            ];

            this.toEatNumber = 0;
            this.mStatus = 'put';

	        bRet = true;
        }
        this.tip = "现在轮到" + this.players[this.currentUser].dColor + "下棋了";
        this.refresh();

        return bRet;
    },
    onMouseUp: function (event) {
        var location = event.getLocation();
        var x = parseInt(location.x / this.cellSize);
        var y = parseInt((this.winSize.height - location.y) / this.cellSize);

        if(x > 5 || y > 5 || x < 0 || y < 0){return;}

        if(this.mStatus == 'eat'){
            if(this.toEatNumber > 0 && this.chessboard[y][x] == (this.currentUser == 1 ? 2 : 1)){
               this.chessboard[y][x] = -1;
               this.toEatNumber--;
               this.players[this.currentUser].eatNum++;
               this.tip = "现在进入吃模式，你可以点选" + this.toEatNumber + "个对方棋子";
            }
            if(this.toEatNumber <= 0){
                this.mStatus = 'put';
                this.currentUser = this.currentUser == 1 ? 2 : 1;
                this.tip = "现在轮到" + this.players[this.currentUser].dColor + "下棋了";
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
                this.tip = "现在轮到" + this.players[this.currentUser].dColor + "下棋了";
            }
        }
        if(this.allPostionHasChess()){
            if(this.players[1].eatNum > this.players[2].eatNum){
                this.tip = "红方赢了";
            }else if(this.players[1].eatNum > this.players[2].eatNum){
                this.tip = "绿方赢了";
            }else{
                this.tip = "和棋了";
            }
            this.refresh();
            var resultLayer = new ResultLayer;
            cc.Director.getInstance().getRunningScene().addChild(resultLayer,99);
            return;
        }

        this.refresh();

    },
    onTouchEnded: function(touch, event){
    	
    },
    judge: function(cy, cx){
        //横
        if(this._isAllSix([cy,0],[cy,1],[cy,2],[cy,3],[cy,4],[cy,5])){
            this.toEatNumber++;
        }
        //竖
        if(this._isAllSix([0, cx],[1, cx],[2, cx],[3, cx],[4, cx],[5, cx])){
            this.toEatNumber++;
        }
        //竖日
        if(this._isAllSix([cy-2,cx-1],[cy-2,cx],[cy-1,cx-1],[cy-1,cx],[cy,cx-1],[cy,cx])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy-2,cx],[cy-2,cx+1],[cy-1,cx],[cy-1,cx+1],[cy,cx],[cy,cx+1])){
            this.toEatNumber++;
        } 
        if(this._isAllSix([cy-1,cx-1],[cy-1,cx],[cy,cx-1],[cy,cx],[cy+1,cx-1],[cy+1,cx])){
            this.toEatNumber++;
        } 
        if(this._isAllSix([cy-1,cx],[cy-1,cx+1],[cy,cx],[cy,cx+1],[cy+1,cx],[cy+1,cx+1])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy,cx-1],[cy,cx],[cy+1,cx-1],[cy+1,cx],[cy+2,cx-1],[cy+2,cx])){
            this.toEatNumber++;
        } 
        if(this._isAllSix([cy,cx],[cy,cx+1],[cy+1,cx],[cy+1,cx+1],[cy+2,cx],[cy+2,cx+1])){
            this.toEatNumber++;
        }
        //横日
        if(this._isAllSix([cy-1,cx-2],[cy,cx-2],[cy-1,cx-1],[cy,cx-1],[cy-1,cx],[cy,cx])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy,cx-2],[cy+1,cx-2],[cy,cx-1],[cy+1,cx-1],[cy,cx],[cy+1,cx])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy-1,cx-1],[cy,cx-1],[cy-1,cx],[cy,cx],[cy-1,cx+1],[cy,cx+1])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy,cx-1],[cy+1,cx-1],[cy,cx],[cy+1,cx],[cy,cx+1],[cy+1,cx+1])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy-1,cx],[cy,cx],[cy-1,cx+1],[cy,cx+1],[cy-1,cx+2],[cy,cx+2])){
            this.toEatNumber++;
        }
        if(this._isAllSix([cy,cx],[cy+1,cx],[cy,cx+1],[cy+1,cx+1],[cy,cx+2],[cy+1,cx+2])){
            this.toEatNumber++;
        }

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
        var tip = "红方：" + this.players[1].eatNum + "\t绿方：" + this.players[2].eatNum + "\n" + this.tip;
        this.lblTip = cc.LabelTTF.create(tip, "Impact", 16);
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
    },
    _isAllSix: function(a1,a2,a3,a4,a5,a6){
        var args = [a1,a2,a3,a4,a5,a6];
        for(var p in args){
            var iy = args[p][0];
            var ix = args[p][1];
            if(iy<0||iy>5||ix<0||ix>5){return false;}
            if(this.chessboard[args[p][0]][args[p][1]] != this.currentUser){
                return false;
            }
        }
        return true;
    }
});