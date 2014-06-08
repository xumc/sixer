var WelcomeLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        var bRet = false;
        if (this._super()) {
            var bgSprite = cc.Sprite.create("background.jpg");
            bgSprite.setPosition(160,240);
            this.addChild(bgSprite);

            var logoSprite = cc.Sprite.create("logo.png");
            logoSprite.setPosition(160,320);
            this.addChild(logoSprite);

            var itemStartGame = cc.MenuItemImage.create(
                "btn/btnStartGameNor.png",
                "btn/btnStartGameDown.png",
                this.menuCallBack,
                this
            );
            itemStartGame.setPosition(160, 160);

            var menu = cc.Menu.create(itemStartGame);
            menu.setPosition(0,0);
            this.addChild(menu);

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