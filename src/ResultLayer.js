var ResultLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var itemRestart =cc.MenuItemImage.create(
                "btnResultRestart.png",
                "btnResultRestartDown.png",
                this.menuCallBack,
                this);
            itemRestart.setPosition(160, 160);

            var resultMenu = cc.Menu.create(itemRestart);
            resultMenu.setPosition(0,0);
            this.addChild(resultMenu);

            bRet = true;
        }
        return bRet;
    },
    menuCallBack:function(sender){
        var nextScene = cc.Scene.create();
        var nextLayer = new MainLayer;
        nextScene.addChild(nextLayer);
        cc.Director.getInstance().replaceScene(cc.TransitionSlideInT.create(0.4, nextScene));
    }
});
