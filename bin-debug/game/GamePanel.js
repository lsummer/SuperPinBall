var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var CONST_SCORE_HIGHEST = "playBall score highest"; //最高分数
var GamePanel = { rank: null, over: null, game: null };
var GameMain = (function (_super) {
    __extends(GameMain, _super);
    function GameMain() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // 实例化单例获取方法
    GameMain.getInstance = function () {
        if (!GameMain.instance) {
            GameMain.instance = new GameMain();
        }
        return GameMain.instance;
    };
    GameMain.prototype.initView = function () {
        //this.createBgGradientFill();
        this.panelWelcome = new Welcome();
        this.addChild(this.panelWelcome);
        //面板－主要逻辑处理
        this.panelGame = new GameControl;
        this.panelGame.addEvent(MoonEvent.OVER, this.onOver, this);
        // this.addChild(this.panelGame);
        GamePanel.game = this.panelGame;
        //面板－设置
        this.panelSet = new GameSet;
        this.panelSet.addEvent(MoonEvent.PLAY, this.onSetHandler, this);
        this.panelSet.addEvent(MoonEvent.CHANGE, this.onSetHandler, this);
        //面板－开始
        this.panelStart = new GameStart;
        this.panelStart.addEvent(moon.MoonEvent.START, this.start, this);
        // this.addChild(this.panelStart);
        this.panelQues = new QuesScreen;
        //面板－结束
        this.panelOver = new GameOver;
        this.panelOver.addEvent(moon.MoonEvent.START, this.start, this);
        //this.addChild(this.panelOver);
        //按钮－设置
        this.setBtn = new moon.SetButton;
        this.setBtn.x = 100;
        this.setBtn.y = 100;
        this.setBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.openSetPanel, this);
        //this.addChild(this.setBtn);
        this.Adver_Init(); // 广告类型的初始化
        //读取历史最高分
        GameData.scoreHighest = Number(moon.BasicGameStorage.localRead(CONST_SCORE_HIGHEST));
    };
    GameMain.prototype.Adver_Init = function () {
        GameData.gameType = control.SequenceRandom.randomSequence();
        GameData.gameType = control.SequenceRandom.randomSequence();
        GameData.uploadMessage = [];
        GameData.gameIndex = 0;
        GameData.gameType = [4].concat(GameData.gameType);
        console.log("游戏类型序列是：", GameData.gameType);
        this.getRankList();
    };
    GameMain.prototype.getRankList = function () {
        var request = new egret.HttpRequest();
        request.withCredentials = true;
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("//icontinua.com/ftf/minigame/getRankList2", egret.HttpMethod.GET);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
    };
    GameMain.prototype.onGetComplete = function (event) {
        var request = event.currentTarget;
        console.log("get data : ", JSON.parse(request.response).data);
        GameData.RankList = JSON.parse(request.response).data;
    };
    GameMain.prototype.onGetIOError = function (event) {
        console.log(event);
        if (!this.responseLabel) {
            this.responseLabel = new egret.TextField();
        }
        this.responseLabel.size = 18;
        this.responseLabel.text = event.data.toString() + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
    };
    GameMain.prototype.onGetProgress = function (event) {
        console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        // SceneMange.getInstance().changeScene("endScene");
        if (!this.responseLabel) {
            this.responseLabel = new egret.TextField();
        }
        this.responseLabel.size = 18;
        this.responseLabel.text = Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
    };
    GameMain.prototype.AddPanel = function (panel) {
        this.removeChildren();
        this.addChild(this[panel]);
        if (panel == "panelGame") {
            this.panelStart = new GameStart;
            this.panelStart.addEvent(moon.MoonEvent.START, this.start, this);
            this.addChild(this["panelStart"]);
        }
    };
    return GameMain;
}(moon.BasicGameMain));
__reflect(GameMain.prototype, "GameMain");
var Welcome = (function (_super) {
    __extends(Welcome, _super);
    function Welcome() {
        var _this = _super.call(this) || this;
        console.log("执行");
        _this.stageH = egret.MainContext.instance.stage.stageHeight;
        _this.stageW = egret.MainContext.instance.stage.stageWidth;
        _this.createBackGroundImage();
        _this.createWelcome();
        _this.beginButton();
        return _this;
    }
    Welcome.prototype.createWelcome = function () {
        var textF = new egret.TextField();
        textF.text = "Welcome";
        textF.width = this.stageW - 20;
        textF.textColor = 0x000000;
        textF.bold = true;
        textF.x = 10;
        textF.size = 40;
        textF.textAlign = egret.HorizontalAlign.CENTER;
        textF.y = 40;
        var textLittle = new egret.TextField();
        textLittle.text = "本次实验旨在";
        textLittle.width = this.stageW - 20;
        textLittle.textColor = 0x000000;
        textLittle.size = 25;
        textLittle.bold = false;
        textLittle.x = 10;
        textLittle.textAlign = egret.HorizontalAlign.CENTER;
        textLittle.y = textF.y + 70;
        var textLittle1 = new egret.TextField();
        textLittle1.text = "探讨在小游戏中投放不同形式的广告给用户带来的影响";
        textLittle1.width = this.stageW - 20;
        textLittle1.textColor = 0x000000;
        textLittle1.size = 30;
        textLittle1.bold = false;
        textLittle1.x = 10;
        textLittle1.textAlign = egret.HorizontalAlign.CENTER;
        textLittle1.y = textLittle.y + 60;
        var tip = new egret.TextField();
        tip.text = "tip";
        tip.textColor = 0x8B814C;
        tip.width = this.stageW / 2;
        tip.size = 30;
        tip.x = this.stageW / 2;
        tip.bold = false;
        tip.y = textLittle.y + this.stageH / 7;
        tip.textAlign = egret.HorizontalAlign.LEFT;
        var shp = new egret.Shape();
        shp.graphics.lineStyle(4, 0x8B814C);
        shp.graphics.beginFill(0x7FFF00, 1);
        shp.graphics.drawCircle(this.stageW / 2 - 15, tip.y + tip.height / 2, 11);
        shp.graphics.endFill();
        this.addChild(shp);
        var show1 = new egret.TextField();
        show1.text = "1、请您关闭手机，保持实验过程的专注；\n";
        show1.width = this.stageW;
        show1.textColor = 0x000000;
        show1.size = 20;
        show1.bold = false;
        show1.x = this.stageW / 10;
        show1.y = tip.y + 60;
        var show155 = new egret.TextField();
        show155.text = "2、刚开始，您会试玩一局；\n";
        show155.width = this.stageW;
        show155.textColor = 0x000000;
        show155.size = 20;
        show155.bold = false;
        show155.x = this.stageW / 10;
        show155.y = show1.y + 60;
        var show15 = new egret.TextField();
        show15.text = "3、整个实验过程大概耗时30-40分钟。\n";
        show15.width = this.stageW;
        show15.textColor = 0x000000;
        show15.size = 20;
        show15.bold = false;
        show15.x = this.stageW / 10;
        show15.y = show155.y + 60;
        this.addChild(textF);
        this.addChild(textLittle);
        this.addChild(textLittle1);
        this.addChild(tip);
        this.addChild(shp);
        this.addChild(show1);
        this.addChild(show155);
        this.addChild(show15);
        this.createInput();
    };
    Welcome.prototype.createBackGroundImage = function () {
        var bg = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill(0xDCDCDC); //0xE6E6FA
        bg.graphics.drawRect(0, 0, this.stageW, this.stageH);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    Welcome.prototype.createInput = function () {
        var background = new eui.Image();
        //新建一个输入框
        var myEditableText = new eui.EditableText();
        //指定图片素材，这里使用上面的图片，并放入相应文件夹下
        background.source = "resource/assets/checkbox_unselect.png";
        //指定图片的九宫格，我们可以复习一下前面章节的内容
        background.scale9Grid = new egret.Rectangle(1.5, 1.5, 20, 20);
        //指定其宽和高，用来当做背景.
        background.width = 500;
        background.height = 60;
        background.x = (this.stageW - background.width) / 2;
        background.y = this.stageH / 2 + 120;
        var txt = new egret.TextField();
        txt.text = "请输入您的名字：";
        txt.x = background.x;
        txt.y = background.y - 60;
        txt.textColor = 0x000000;
        this.addChild(txt);
        //将背景添加到显示列表
        this.addChild(background);
        //指定默认文本，用户可以自己输入，也可以将其删除
        myEditableText.text = "";
        //指定文本的颜色。
        myEditableText.textColor = 0x2233cc;
        //指定我们的文本输入框的宽和高
        myEditableText.width = background.width;
        myEditableText.height = background.height;
        //设置我们的文本左边距为零
        myEditableText.left = 40;
        myEditableText.x = background.x;
        myEditableText.y = background.y;
        //将他添加到显示列表
        this.addChild(myEditableText);
        myEditableText.wordWrap = true;
        //添加监听，监听用户的输入
        myEditableText.addEventListener(egret.Event.CHANGE, this.onChang, this);
    };
    Welcome.prototype.onChang = function (e) {
        egret.log(e.target.text);
        this.usr_name = e.target.text;
    };
    Welcome.prototype.beginButton = function () {
        var beginB = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageW / 2 - beginB.width / 2;
        beginB.y = this.stageH - beginB.height - 200;
        var textInButton = new egret.TextField();
        textInButton.text = "我已阅读，开始";
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height / 2 - textInButton.height / 2) - 5;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;
        this.addChild(beginB);
        this.addChild(textInButton);
        beginB.touchEnabled = true;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginButtonTap, this);
    };
    Welcome.prototype.beginButtonTap = function (evt) {
        if (!this.usr_name) {
            this.usr_name = "unknown" + Math.floor(Math.random() * 100).toString();
        }
        GameData.uploadUser["names"] = this.usr_name;
        this.removeChildren();
        this.createTimeScreen();
    };
    Welcome.prototype.createTimeScreen = function () {
        this.createBackGroundImage();
        var progere = new TransferScreen("第 1/3 部分 - 预实验", "试玩一局", "panelGame");
        GameData.preGame = true;
        this.addChild(progere);
    };
    return Welcome;
}(egret.Sprite));
__reflect(Welcome.prototype, "Welcome");
/**切换场景界面**/
var TransferScreen = (function (_super) {
    __extends(TransferScreen, _super);
    function TransferScreen(pro, discribe, jumpsceen) {
        var _this = _super.call(this) || this;
        _this.intervalDuration = 1000; // duration between intervals, in milliseconds
        _this.timeCount = 5;
        _this.radius = 11; // 圆的半径
        _this.stageH = egret.MainContext.instance.stage.stageHeight;
        _this.stageW = egret.MainContext.instance.stage.stageWidth;
        _this.createBackground();
        _this.jumpScreen = jumpsceen;
        // this.createProgress(pro);
        // var progre: Progress = new Progress(pro);
        // this.addChild(progre);
        _this.createMainFrame(discribe);
        _this.createTimer();
        return _this;
    }
    TransferScreen.prototype.createBackground = function () {
        var bg = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill(0xDCDCDC); //0xE6E6FA
        bg.graphics.drawRect(0, 0, this.stageW, this.stageH);
        bg.graphics.endFill();
        bg.touchEnabled = true;
        this.addChild(bg);
    };
    TransferScreen.prototype.createMainFrame = function (discribe) {
        var next = new egret.TextField();
        next.text = "接下来,您将...";
        next.width = this.stageW;
        next.textColor = 0x000000;
        next.size = 20;
        next.textAlign = egret.HorizontalAlign.CENTER;
        next.bold = false;
        next.y = this.stageH / 4;
        var instrustion = discribe;
        var insru = new egret.TextField();
        insru.text = instrustion;
        insru.width = this.stageW;
        insru.textColor = 0x000000;
        insru.size = 30;
        insru.textAlign = egret.HorizontalAlign.CENTER;
        insru.bold = false;
        insru.y = next.y + 60;
        this.addChild(next);
        this.addChild(insru);
        if (discribe == "开始 2 组正式实验") {
            var instrustion = "每组 6 局";
            var insru_ = new egret.TextField();
            insru_.text = instrustion;
            insru_.width = this.stageW;
            insru_.textColor = 0x000000;
            insru_.size = 25;
            insru_.textAlign = egret.HorizontalAlign.CENTER;
            insru_.bold = false;
            insru_.y = insru.y + 60;
            this.addChild(insru_);
        }
    };
    TransferScreen.prototype.createTimer = function () {
        //创建一个计时器对象
        this.SetIntervalExample();
        var countdown = new egret.TextField();
        countdown.text = "开始倒计时";
        countdown.size = 15;
        countdown.textAlign = egret.HorizontalAlign.CENTER;
        countdown.y = this.stageH / 2 - 80;
        countdown.width = this.stageW;
        countdown.textColor = 0x000000;
        this.addChild(countdown);
        var shp = new egret.Shape();
        shp.graphics.lineStyle(4, 0x8B814C);
        shp.graphics.beginFill(0xDCDCDC, 1);
        shp.graphics.drawCircle(this.stageW / 2, this.stageH / 2, 40);
        shp.graphics.endFill();
        this.addChild(shp);
        if (!this.countDownTextField) {
            this.countDownTextField = new egret.TextField();
        }
        this.countDownTextField.text = this.timeCount.toString();
        this.countDownTextField.width = this.stageW;
        this.countDownTextField.textAlign = egret.HorizontalAlign.CENTER;
        this.countDownTextField.textColor = 0x000000;
        this.countDownTextField.bold = true;
        this.countDownTextField.size = 40;
        this.countDownTextField.y = this.stageH / 2 - 20;
        this.addChild(this.countDownTextField);
    };
    TransferScreen.prototype.SetIntervalExample = function () {
        this.intervalID = egret.setTimeout(this.myRepeatingFunction, this, this.intervalDuration);
    };
    TransferScreen.prototype.beginButton = function () {
        var beginB = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageW / 2 - beginB.width / 2;
        beginB.y = this.stageH - beginB.height - 100;
        var textInButton = new egret.TextField();
        textInButton.text = "开始";
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height / 2 - textInButton.height / 2) - 5;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;
        this.addChild(beginB);
        this.addChild(textInButton);
        beginB.touchEnabled = true;
        var that = this;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            /*在这里进入下一个场景*/
            that.dispatchEventWith(moon.MoonEvent.START);
            that.removeChildren();
            that.removeFromParent();
            GameMain.getInstance().AddPanel(that.jumpScreen);
        }, this);
    };
    /**把自己从父级删除*/
    TransferScreen.prototype.removeFromParent = function (value) {
        if (value === void 0) { value = false; }
        var _parent = this.parent;
        if (_parent && _parent.contains(this))
            _parent.removeChild(this);
        _parent = null;
    };
    TransferScreen.prototype.myRepeatingFunction = function (obj) {
        this.timeCount = this.timeCount - 1;
        if (this.timeCount >= 0) {
            this.countDownTextField.text = this.timeCount.toString();
            this.intervalID = egret.setTimeout(this.myRepeatingFunction, this, this.intervalDuration);
        }
        else {
            egret.clearInterval(this.intervalID);
            console.log("清楚了计时");
            this.beginButton();
        }
    };
    return TransferScreen;
}(egret.Sprite));
__reflect(TransferScreen.prototype, "TransferScreen");
/**开始界面*/
var GameStart = (function (_super) {
    __extends(GameStart, _super);
    function GameStart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameStart.prototype.initView = function () {
        this.createImageBg("startPanel_png");
        var btn = new MButton(new MImage("btnStart_png"), new MImage("btnStart_png"));
        this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        btn.x = (this.stageWidth - btn.width) >> 1;
        btn.y = 650;
    };
    return GameStart;
}(moon.BasicGameStart));
__reflect(GameStart.prototype, "GameStart");
/**结束界面*/
var GameOver = (function (_super) {
    __extends(GameOver, _super);
    function GameOver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layout = Layout.getIns();
        return _this;
    }
    GameOver.prototype.initView = function () {
        this.layout.setStageWH(this.stageWidth, this.stageHeight);
        this.createBackground(0x808080, 0.9);
        this.txtDescribe = this.createText(0, 50);
        this.txtScore = this.createText(0, 50 + 60);
        this.txtScore.size = 50;
        this.txtDescribe.size = 30;
        this.btnRestart = this.createMButton("buttonnext_png", 0, 0);
        this.btnRestart.width = this.btnRestart.width / 2;
        this.btnRestart.x = this.stageWidth / 2 - this.btnRestart.width;
        this.btnRestart.y = this.stageHeight - this.btnRestart.height - 120;
        var next = this.createText(0, this.btnRestart.y);
        next.text = "下一步";
        next.height = this.btnRestart.height;
        next.width = this.stageWidth;
        next.size = 25;
        next.textAlign = egret.HorizontalAlign.CENTER;
        next.textColor = 0x000000;
        next.verticalAlign = egret.VerticalAlign.MIDDLE;
        // this.RankList();
        this.addChild(Rank.getInstance());
    };
    GameOver.prototype.createMButton = function (name, x, y) {
        var btn = this.createSkinBtn(name, name);
        btn.x = x;
        btn.y = y;
        return btn;
    };
    GameOver.prototype.createSkinBtn = function (value1, value2) {
        var skin = new Scale9Image(value1);
        var skin2 = new Scale9Image(value2);
        skin2.alpha = 0.5;
        var btn = new MButton(skin, skin2);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClick, this);
        this.addChild(btn);
        return btn;
    };
    GameOver.prototype.onClick = function (e) {
        if (e.currentTarget == this.btnRestart) {
            console.log("下一步进入问题页面");
            GameData.gameIndex++;
            console.log("game index:", GameData.gameIndex);
            var questionna = new Questionaire();
            var that = this;
            questionna.addEventListener(moon.MoonEvent.START, function () {
                // that.dispEvent(MoonEvent.START);
                if (GameData.preGame) {
                    GameData.preGame = false;
                    GameData.uploadUser["fullscore"] = 0;
                    GameData.uploadUser["maxscore"] = 0;
                    GameData.scoreHighest = 0;
                }
                var progere = new TransferScreen("第 2/3 部分 - 正式实验", "开始 第 " + GameData.gameIndex + " 局 正式实验", "panelGame");
                that.addChild(progere);
                var here = that;
                progere.addEventListener(moon.MoonEvent.START, function () {
                    Tween.get(here).to({ alpha: 0 }, 300).call(here.removeFromParent, here);
                }, that);
            }, this);
            this.addChild(questionna);
        }
        // SoundControl.getIns().play(MUSIC_CLICK_BTN);
    };
    GameOver.prototype.update = function (data) {
        GameData.score = data["score"];
        if (GameData.score > GameData.scoreHighest) {
            GameData.scoreHighest = GameData.score;
            //moon.BasicGameStorage.localWrite(CONST_SCORE_HIGHEST,GameData.scoreHighest.toString());
        }
        this.txtDescribe.textFlow = [
            { text: "=  ", style: { "textColor": 0xC0C0C0 } },
            { text: "本局得分", style: { "fontFamily": "微软雅黑", "textColor": 0xFFFFFF } },
            { text: "  =", style: { "textColor": 0xC0C0C0 } }
        ];
        this.txtScore.text = String(GameData.score);
        this.txtDescribe.x = this.stageWidth / 2 - this.txtDescribe.width / 2;
        this.txtScore.x = this.stageWidth / 2 - this.txtScore.width / 2;
        GameData.uploadMessage[GameData.uploadMessage.length - 1].push(GameData.score); // 得分
        GameData.uploadMessage[GameData.uploadMessage.length - 1].push(GameData.adver_sum); // 广告出现次数
        console.log("点击视频的blood:", GameData.video_tap);
        GameData.uploadMessage[GameData.uploadMessage.length - 1] = GameData.uploadMessage[GameData.uploadMessage.length - 1].concat(GameData.video_tap);
        GameData.uploadUser["fullscore"] += GameData.score;
        GameData.uploadUser["maxscore"] = GameData.scoreHighest;
        console.log("adver_sum:::::", GameData.adver_sum);
        Rank.getInstance().RankList();
    };
    return GameOver;
}(moon.BasicGameOver));
__reflect(GameOver.prototype, "GameOver");
var Questionaire = (function (_super) {
    __extends(Questionaire, _super);
    function Questionaire() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.question_index = 0;
        _this.couldGoon = false;
        return _this;
    }
    /**加载到舞台之后调用 */
    Questionaire.prototype.render = function () {
        _super.prototype.render.call(this);
        this.initView();
    };
    Questionaire.prototype.initView = function () {
        this.question_index = 0;
        this.couldGoon = false;
        this.createBackground(0xDCDCDC, 1);
        if (!this.questionLayer) {
            this.questionLayer = new egret.Sprite;
        }
        this.addChild(this.questionLayer);
        this.updateQuestion();
        this.createButtonImage();
    };
    Questionaire.prototype.createButtonImage = function () {
        var beginB = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageWidth / 2 - beginB.width / 2;
        beginB.y = this.stageHeight - beginB.height - 120;
        var textInButton = new egret.TextField();
        textInButton.text = "下一步";
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height / 2 - textInButton.height / 2) - 5;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;
        this.addChild(beginB);
        this.addChild(textInButton);
        beginB.touchEnabled = true;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginButtonTap, this);
    };
    Questionaire.prototype.updateQuestion = function () {
        this.questionLayer.removeChildren();
        if (GameData.preGame) {
            switch (this.question_index) {
                case 0:
                    this.createQuestionAndAnswers("1、\"哈罗单车HelloBike\"的广告是否在本局游戏中出现", GameData.questionList["answer"], -1);
                    break;
                default:
                    this.question_index = 0;
                    // TODO transfer -- 进入正式游戏
                    this.createBackground(0xDCDCDC, 1);
                    this.dispatchEventWith(moon.MoonEvent.START);
                    Tween.get(this).to({ alpha: 0 }, 300).call(this.removeFromParent, this);
                    break;
            }
        }
        else {
            switch (this.question_index) {
                case 0:
                    this.createQuestionAndAnswers("1、" + GameData.questionList["question"][this.question_index], GameData.questionList["answer"], GameData.questionList["num"][this.question_index]);
                    break;
                case 1:
                    this.createQuestionAndAnswers("2、" + GameData.questionList["question"][this.question_index], GameData.questionList["answer"], GameData.questionList["num"][this.question_index]);
                    break;
                case 2:
                    this.createQuestionAndAnswers("3、" + GameData.questionList["question"][this.question_index], GameData.questionList["answer"], GameData.questionList["num"][this.question_index]);
                    break;
                case 3:
                    this.createQuestionAndAnswers("4、" + GameData.questionList["question"][this.question_index], GameData.questionList["answer"], GameData.questionList["num"][this.question_index]);
                    break;
                case 4:
                    this.createQuestionAndAnswers("5、" + GameData.questionList["question"][this.question_index], GameData.questionList["answer"], GameData.questionList["num"][this.question_index]);
                    break;
                case 5:
                    this.createQuestionAndAnswers("6、" + GameData.questionList["question"][this.question_index], GameData.questionList["answer"], GameData.questionList["num"][this.question_index]);
                    break;
                case 6:
                    var answer29 = ["A、1分-不干扰", "B、2分-稍微干扰", "C、3分-有些干扰", "D、4分-干扰", "E、5分-非常干扰"];
                    var question29 = "7、这种广告形式是否干扰到您的游戏操作：";
                    this.createQuestionAndAnswers(question29, answer29);
                    break;
                case 7:
                    var answer20 = ["A、1分-非常不愿意", "B、2分-不愿意", "C、3分-没有倾向", "D、4分-愿意", "E、5分-非常愿意"];
                    var question20 = "8、您是否愿意继续玩有这种广告形式的该游戏：";
                    this.createQuestionAndAnswers(question20, answer20);
                    break;
                default:
                    this.question_index = 0;
                    if (GameData.gameIndex > GameData.GAMESNUMBER) {
                        this.removeChildren();
                        var progere = new TransferScreen("第 1/3 部分 - 基础问题", "基础问题", "panelQues");
                        GameData.uploadMessage.push([]);
                        this.addChild(progere);
                    }
                    else {
                        this.dispatchEventWith(moon.MoonEvent.START);
                        Tween.get(this).to({ alpha: 0 }, 300).call(this.removeFromParent, this);
                    }
                    break;
            }
        }
    };
    Questionaire.prototype.createQuestionAndAnswers = function (quest, answe, num) {
        if (num === void 0) { num = 100; }
        var questionna = new Questionnaire();
        questionna.addEventListener(Questionnaire.ACTION, this.onAction, this);
        questionna.setQuestionAnswers(quest, answe, num);
        this.questionLayer.y = this.stageHeight / 5;
        this.questionLayer.addChild(questionna);
        this.couldGoon = false;
    };
    Questionaire.prototype.onAction = function () {
        this.couldGoon = true;
        console.log("变成true");
    };
    Questionaire.prototype.beginButtonTap = function () {
        if (this.couldGoon) {
            this.question_index++;
            this.updateQuestion();
        }
        else {
            console.log("请做出选择");
            var makechoiceAttention = new egret.TextField();
            makechoiceAttention.textAlign = egret.HorizontalAlign.CENTER;
            makechoiceAttention.text = "请先\"选择答案\"，再点击\"下一步\"";
            makechoiceAttention.textColor = 0xff0000;
            makechoiceAttention.width = this.stageWidth;
            makechoiceAttention.y = this.stageHeight - 400;
            this.addChild(makechoiceAttention);
            var that = this;
            egret.Tween.get(makechoiceAttention).to({ alpha: 0.4 }, 1000).call(function () {
                that.removeChild(makechoiceAttention);
            });
        }
    };
    return Questionaire;
}(moon.BasicGameStart));
__reflect(Questionaire.prototype, "Questionaire");
var Questionnaire = (function (_super) {
    __extends(Questionnaire, _super);
    function Questionnaire() {
        var _this = _super.call(this) || this;
        _this.stageW = 0;
        _this.stageH = 0;
        _this.init();
        _this.adverName = ["q_alipay_jpg", "q_geli_jpg", "q_iphone_x_jpg", "q_KFC_png", "q_meituan_jpg", "q_nike_png", "q_ofo_jpg", "q_pinduoduo_jpg", "q_Starbucks_jpg", "q_tebu_jpg", "q_vivo_jpg", "q_weiqian_jpg"];
        return _this;
    }
    Questionnaire.prototype.getChoice = function () {
        if (this.haschoice) {
            return this.choice;
        }
        else {
            return null;
        }
    };
    Questionnaire.prototype.getIfChoice = function () {
        return this.haschoice;
    };
    Questionnaire.prototype.setQuestionAnswers = function (ques, answe, num) {
        if (num === void 0) { num = 100; }
        this.question = ques;
        this.answers = answe;
        this.creatQuestion(num);
    };
    // 初始化(给开始按钮绑定点击事件)
    Questionnaire.prototype.init = function () {
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.haschoice = false;
    };
    Questionnaire.prototype.creatQuestion = function (num) {
        var textview = new egret.TextField();
        textview.text = this.question;
        this.addChild(textview);
        textview.width = this.stageW - 100;
        textview.textColor = 0x000000;
        textview.size = 30;
        textview.bold = true;
        textview.x = 50;
        textview.y = 0;
        if (num <= 11) {
            var adver = new egret.Bitmap();
            if (num < 0) {
                adver.texture = RES.getRes("hellobike_jpg");
            }
            else {
                adver.texture = RES.getRes(this.adverName[num]);
            }
            adver.width = 200;
            adver.height = 200;
            adver.x = (this.stageW - adver.width) / 2;
            adver.y = textview.y + textview.height + 20;
            this.addChild(adver);
        }
        var flag = 0;
        for (var _i = 0, _a = this.answers; _i < _a.length; _i++) {
            var ans = _a[_i];
            var answerView = new egret.TextField();
            answerView.text = ans;
            this.addChild(answerView);
            answerView.width = this.stageW - 220;
            answerView.height = 40;
            answerView.size = 30;
            answerView.x = textview.x + 60;
            answerView.verticalAlign = egret.VerticalAlign.MIDDLE;
            flag++;
            answerView.y = num <= 11 ? adver.y + adver.height - 10 + flag * (answerView.height + 40) : textview.y + textview.height - 10 + flag * (answerView.height + 40);
            answerView.textColor = 0x000000;
            answerView.background = true;
            answerView.backgroundColor = 0xD3D3D3;
            answerView.touchEnabled = true;
            answerView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAnswer, this);
        }
    };
    Questionnaire.prototype.chooseAnswer = function (evt) {
        this.choice = evt.target.text;
        if (this.haschoice) {
            this.currentView.textColor = 0x000000;
            this.currentView.backgroundColor = 0xD3D3D3;
            GameData.uploadMessage[GameData.uploadMessage.length - 1][GameData.uploadMessage[GameData.uploadMessage.length - 1].length - 1] = (this.answers.indexOf(this.choice));
        }
        else {
            GameData.uploadMessage[GameData.uploadMessage.length - 1].push(this.answers.indexOf(this.choice));
        }
        this.currentView = evt.target;
        this.haschoice = true;
        this.dispatchEventWith(Questionnaire.ACTION);
        this.currentView.textColor = 0x228B22;
        this.currentView.backgroundColor = 0xBDB76B;
        console.log("push 选择结果", this.answers.indexOf(this.choice));
    };
    Questionnaire.ACTION = "action";
    return Questionnaire;
}(egret.Sprite));
__reflect(Questionnaire.prototype, "Questionnaire");
var QuesScreen = (function (_super) {
    __extends(QuesScreen, _super);
    function QuesScreen() {
        var _this = _super.call(this) || this;
        _this.stageW = 0;
        _this.stageH = 0;
        _this.progress = 0;
        _this.hasChoice1 = false;
        _this.hasChoice2 = false;
        _this.couldGoOn = false;
        _this.init();
        return _this;
    }
    // 初始化(给开始按钮绑定点击事件)
    QuesScreen.prototype.init = function () {
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.createBackGroundImage();
        if (!this.questionLayer) {
            this.questionLayer = new egret.Sprite();
        }
        this.addChild(this.questionLayer);
        this.questionLayer.width = this.stageW;
        this.questionLayer.x = 0;
        this.questionLayer.y = this.stageH / 4;
        this.progress = 1;
        this.updateQuestion();
        this.createButtonImage();
    };
    QuesScreen.prototype.layTxBg = function (tx) {
        var shp = new egret.Shape;
        shp.graphics.beginFill(0xffffff);
        shp.graphics.drawRect(tx.x, tx.y, tx.width, tx.height);
        shp.graphics.endFill();
        this.questionLayer.addChild(shp);
    };
    QuesScreen.prototype.createInputName = function (question) {
        this.questionLayer.width = this.stageW;
        this.questionLayer.x = 0;
        this.questionLayer.y = this.stageH / 3;
        var ques = new egret.TextField();
        ques.text = question;
        ques.width = this.stageW - 20;
        ques.textColor = 0x000000;
        ques.size = 35;
        ques.bold = true;
        ques.x = 50;
        // ques.textAlign = egret.HorizontalAlign.CENTER;
        ques.y = 0;
        this.questionLayer.addChild(ques);
        var content = new egret.Sprite();
        content.width = 100;
        content.height = this.stageH;
        var _loop_1 = function (i) {
            var ageFile = new egret.TextField();
            // console.log(i.toString())
            ageFile.text = i.toString();
            ageFile.width = content.width;
            ageFile.textColor = 0x000000;
            ageFile.size = 25;
            ageFile.y = (i - 18) * 30;
            ageFile.x = 0;
            ageFile.touchEnabled = true;
            ageFile.textAlign = egret.HorizontalAlign.CENTER;
            var that = this_1;
            ageFile.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                if (that.hasChoice1) {
                    that.currentView1.textColor = 0x000000;
                }
                that.currentView1 = evt.target;
                that.choice1 = evt.target.text;
                that.hasChoice1 = true;
                that.currentView1.textColor = 0x228B22;
                console.log("选择了答案", that.choice1);
            }, content);
            content.addChild(ageFile);
        };
        var this_1 = this;
        for (var i = 18; i < 70; i++) {
            _loop_1(i);
        }
        // var content:egret.Sprite = this.createGird(50,50,9,9);
        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = 100;
        myscrollView.height = 300;
        myscrollView.x = this.stageW / 2;
        myscrollView.y = ques.y + myscrollView.height / 2 + 10;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        this.addChild(myscrollView);
        var background = new egret.Shape();
        background.graphics.lineStyle(1, 0x1102cc);
        background.graphics.drawRect(0, 0, 100, 300);
        background.graphics.endFill();
        background.x = myscrollView.x;
        background.y = myscrollView.y;
        background.anchorOffsetX = background.width / 2;
        background.anchorOffsetY = background.height / 2;
        this.questionLayer.addChild(background);
        this.questionLayer.addChild(myscrollView);
        this.addChild(this.questionLayer);
    };
    QuesScreen.prototype.createInputAge = function (question) {
        this.questionLayer.width = this.stageW;
        this.questionLayer.x = 0;
        var ques = new egret.TextField();
        ques.text = question;
        ques.width = this.stageW - 20;
        ques.textColor = 0x000000;
        ques.size = 35;
        ques.bold = true;
        ques.x = 50;
        // ques.textAlign = egret.HorizontalAlign.CENTER;
        ques.y = 0;
        this.questionLayer.addChild(ques);
        var content = new egret.Sprite();
        content.width = 100;
        content.height = this.stageH;
        var _loop_2 = function (i) {
            var ageFile = new egret.TextField();
            ageFile.text = i.toString();
            ageFile.width = content.width;
            ageFile.textColor = 0x000000;
            ageFile.size = 25;
            ageFile.y = (i - 18) * 30;
            ageFile.x = 0;
            ageFile.touchEnabled = true;
            ageFile.textAlign = egret.HorizontalAlign.CENTER;
            var that = this_2;
            ageFile.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                that.choice1 = evt.target.text;
                that.couldGoOn = true;
                if (that.hasChoice1) {
                    that.currentView1.textColor = 0x000000;
                    GameData.uploadMessage[GameData.uploadMessage.length - 1][GameData.uploadMessage[GameData.uploadMessage.length - 1].length - 1] = parseInt(that.choice1);
                }
                else {
                    GameData.uploadMessage[GameData.uploadMessage.length - 1].push(parseInt(that.choice1));
                }
                that.currentView1 = evt.target;
                that.hasChoice1 = true;
                that.currentView1.textColor = 0x228B22;
                console.log("选择了答案", that.choice1);
            }, content);
            content.addChild(ageFile);
        };
        var this_2 = this;
        for (var i = 18; i < 70; i++) {
            _loop_2(i);
        }
        // var content:egret.Sprite = this.createGird(50,50,9,9);
        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = 100;
        myscrollView.height = 300;
        myscrollView.x = this.stageW / 2;
        myscrollView.y = ques.y + myscrollView.height / 2 + 10;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        this.addChild(myscrollView);
        var background = new egret.Shape();
        background.graphics.lineStyle(1, 0x1102cc);
        background.graphics.drawRect(0, 0, 100, 300);
        background.graphics.endFill();
        background.x = myscrollView.x;
        background.y = myscrollView.y;
        background.anchorOffsetX = background.width / 2;
        background.anchorOffsetY = background.height / 2;
        this.questionLayer.addChild(background);
        this.questionLayer.addChild(myscrollView);
    };
    //创建格子函数，根据输入的宽和高来创建一个 row * line的格子图。并返回Shape对象。
    QuesScreen.prototype.createGird = function (w, h, row, line) {
        var shape = new egret.Shape();
        for (var i = 0; i < row; i++) {
            for (var j = 0; j < line; j++) {
                if ((j + row * i) % 2 === 0) {
                    shape.graphics.beginFill(0xF9C20B);
                    shape.graphics.drawRect(j * w, i * h, w, h);
                    shape.graphics.endFill();
                }
                else {
                    shape.graphics.beginFill(0x2A9FFF);
                    shape.graphics.drawRect(j * w, i * h, w, h);
                    shape.graphics.endFill();
                }
            }
        }
        return shape;
    };
    QuesScreen.prototype.createBackGroundImage = function () {
        var bg = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill(0xDCDCDC);
        bg.graphics.drawRect(0, 0, this.stageW, this.stageH);
        bg.graphics.endFill();
        this.addChild(bg);
    };
    QuesScreen.prototype.createQuestionAndAnswers = function (quest, answe) {
        var questionna = new Questionnaire();
        questionna.addEventListener(Questionnaire.ACTION, this.onAction, this);
        questionna.setQuestionAnswers(quest, answe);
        this.questionLayer.addChild(questionna);
        this.couldGoOn = false;
    };
    QuesScreen.prototype.onAction = function () {
        this.couldGoOn = true;
    };
    QuesScreen.prototype.createButtonImage = function () {
        var beginB = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageW / 2 - beginB.width / 2;
        beginB.y = this.stageH - beginB.height - 200;
        var textInButton = new egret.TextField();
        textInButton.text = "已完成，下一题";
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height / 2 - textInButton.height / 2) - 5;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;
        this.addChild(beginB);
        this.addChild(textInButton);
        beginB.touchEnabled = true;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginButtonTap, this);
    };
    QuesScreen.prototype.beginButtonTap = function () {
        if (this.couldGoOn) {
            this.progress = this.progress + 1;
            this.updateQuestion();
        }
        else {
            var makechoiceAttention = new egret.TextField();
            makechoiceAttention.textAlign = egret.HorizontalAlign.CENTER;
            makechoiceAttention.text = "请先\"选择答案\"，再点击\"下一步\"";
            makechoiceAttention.textColor = 0xff0000;
            makechoiceAttention.width = this.stageW;
            makechoiceAttention.y = this.stageH - 400;
            this.addChild(makechoiceAttention);
            var that = this;
            egret.Tween.get(makechoiceAttention).to({ alpha: 0.4 }, 1000).call(function () {
                that.removeChild(makechoiceAttention);
            });
        }
    };
    QuesScreen.prototype.createWelcome = function () {
        var textF = new egret.TextField();
        textF.text = "致谢";
        textF.width = this.stageW - 20;
        textF.textColor = 0x000000;
        textF.bold = true;
        textF.x = 10;
        textF.size = 40;
        textF.textAlign = egret.HorizontalAlign.CENTER;
        textF.y = 40;
        var textLittle = new egret.TextField();
        textLittle.text = "感谢您参与IGA实验";
        textLittle.width = this.stageW - 20;
        textLittle.textColor = 0x000000;
        textLittle.size = 20;
        textLittle.bold = false;
        textLittle.x = 10;
        textLittle.textAlign = egret.HorizontalAlign.CENTER;
        textLittle.y = textF.y + 60;
        var show1 = new egret.TextField();
        show1.text = "请您接受实验人员的采访";
        show1.width = this.stageW;
        show1.textColor = 0x000000;
        show1.size = 40;
        show1.bold = true;
        show1.textAlign = egret.HorizontalAlign.CENTER;
        show1.x = 0;
        show1.y = this.stageH / 2.5;
        this.addChild(textF);
        this.addChild(textLittle);
        this.addChild(show1);
    };
    QuesScreen.prototype.updateQuestion = function () {
        this.questionLayer.removeChildren();
        switch (this.progress) {
            case 1:
                var answer0 = ["A、每天一个小时以上", "B、每天一个小时以内", "C、每周玩几次", "D、偶尔玩", "E、几乎不玩"];
                var question0 = "1、您玩微信小游戏的时长：";
                this.createQuestionAndAnswers(question0, answer0);
                break;
            case 2:
                this.couldGoOn = false;
                this.createInputAge("2、您的年龄:");
                break;
            case 3:
                var answer1 = ["A、男", "B、女"];
                var question1 = "3、您的性别：";
                this.createQuestionAndAnswers(question1, answer1);
                break;
            case 4:
                var answer2 = ["A、博士", "B、研究生", "C、本科", "D、高中及以下", "E、其他"];
                var question2 = "4、您的学业水平：";
                this.createQuestionAndAnswers(question2, answer2);
                break;
            default:
                break;
        }
        if (this.progress == 5) {
            this.removeChildren();
            this.createBackGroundImage();
            var tshi = new egret.TextField();
            tshi.width = this.stageW;
            tshi.textColor = 0xff0000;
            tshi.size = 35;
            tshi.textAlign = egret.HorizontalAlign.CENTER;
            tshi.bold = true;
            tshi.y = this.stageH / 2 - 30;
            this.addChild(tshi);
            tshi.text = "请把手机交给实验人员！";
            this.createNextButtonImage();
            this.createWelcome();
        }
    };
    QuesScreen.prototype.createNextButtonImage = function () {
        this.button_img = new egret.Bitmap();
        this.button_img.texture = RES.getRes("button_png");
        this.button_img.width = this.button_img.width / 2;
        this.button_img.height = this.button_img.height / 2;
        this.button_img.x = this.stageW / 2 - this.button_img.width / 2;
        this.button_img.y = this.stageH - this.button_img.height - 120;
        this.button_txt = new egret.TextField();
        this.button_txt.text = "发送数据";
        this.button_txt.width = this.button_img.width;
        this.button_txt.x = this.button_img.x;
        this.button_txt.size = 25;
        this.button_txt.y = this.button_img.y + (this.button_img.height / 2 - this.button_txt.height / 2) - 5;
        this.button_txt.textAlign = egret.HorizontalAlign.CENTER;
        this.button_txt.textColor = 0x000000;
        this.addChild(this.button_img);
        this.addChild(this.button_txt);
        this.button_img.touchEnabled = true;
        this.button_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendToserver, this);
    };
    QuesScreen.prototype.sendToserver = function () {
        this.createBackGroundImage();
        var dataProcess = new DataProcess();
        this.addChild(dataProcess);
        var value = GameData.uploadMessage; //[[],[1,2,],[...]]
        //console.log("上传前最后一步：", SceneMange.uploadMessage);
        var sendvalue = "";
        var paraName = ["p1", "g1", "g2", "g3", "g4", "g5", "g6", "q1", "q2", "q3"];
        var index = 0;
        for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
            var x = value_1[_i];
            var str = "";
            for (var _a = 0, x_1 = x; _a < x_1.length; _a++) {
                var y = x_1[_a];
                str = str + y.toString() + " ";
            }
            if (sendvalue == "") {
                sendvalue = paraName[index] + "=" + str;
            }
            else {
                sendvalue = sendvalue + "&" + paraName[index] + "=" + str;
            }
            index = index + 1;
        }
        this.removeChild(this.button_img);
        this.removeChild(this.button_txt);
        var request = new egret.HttpRequest();
        request.withCredentials = true;
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("//icontinua.com/ftf/minigame/sendData2", egret.HttpMethod.POST);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send(sendvalue);
        request.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
    };
    QuesScreen.prototype.sendToRank = function () {
        var sendvalue = "name=" + GameData.uploadUser["names"] + "&fullscore=" + GameData.uploadUser["fullscore"] + "&maxscore=" + GameData.uploadUser["maxscore"];
        var request = new egret.HttpRequest();
        request.withCredentials = true;
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("//icontinua.com/ftf/minigame/saveRank2", egret.HttpMethod.POST);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send(sendvalue);
        request.addEventListener(egret.Event.COMPLETE, this.onGetComplete2, this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        request.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
    };
    QuesScreen.prototype.onGetComplete = function (event) {
        var request = event.currentTarget;
        console.log("get data : ", request.response);
        if (!this.responseLabel) {
            this.responseLabel = new egret.TextField();
        }
        this.responseLabel.size = 18;
        this.responseLabel.text = "GET response: \n" + request.response.substring(0, 50) + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
        this.sendToRank();
        // SceneMange.getInstance().changeScene("endScene");
    };
    QuesScreen.prototype.onGetComplete2 = function (event) {
        var request = event.currentTarget;
        console.log("get data : ", request.response);
        if (!this.responseLabel) {
            this.responseLabel = new egret.TextField();
        }
        this.responseLabel.size = 18;
        this.responseLabel.text = "GET response: \n" + request.response + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 170;
    };
    QuesScreen.prototype.onGetIOError = function (event) {
        console.log(event);
        if (!this.responseLabel) {
            this.responseLabel = new egret.TextField();
        }
        this.responseLabel.size = 18;
        this.responseLabel.text = event.data.toString() + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
        // SceneMange.getInstance().changeScene("endScene");
    };
    QuesScreen.prototype.onGetProgress = function (event) {
        console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
        // SceneMange.getInstance().changeScene("endScene");
        if (!this.responseLabel) {
            this.responseLabel = new egret.TextField();
        }
        this.responseLabel.size = 18;
        this.responseLabel.text = Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
    };
    return QuesScreen;
}(egret.Sprite));
__reflect(QuesScreen.prototype, "QuesScreen");
/** 分数排行 */
var Rank = (function (_super) {
    __extends(Rank, _super);
    function Rank() {
        var _this = _super.call(this) || this;
        _this.stageH = 0;
        _this.stageW = 0;
        _this.lastIndex = -1;
        _this.stageH = egret.MainContext.instance.stage.stageHeight;
        _this.stageW = egret.MainContext.instance.stage.stageWidth;
        _this.lastIndex = -1;
        return _this;
    }
    Rank.getInstance = function () {
        if (!Rank.instance) {
            Rank.instance = new Rank();
        }
        return Rank.instance;
    };
    Rank.prototype.sortRankList = function () {
        function compare(property, propery2) {
            return function (obj1, obj2) {
                var value1 = obj1[property];
                var value2 = obj2[property];
                var value3 = obj1[propery2];
                var value4 = obj2[propery2];
                if (value1 == value2) {
                    return -(value3 - value4);
                }
                return -(value1 - value2); // 升序
            };
        }
        var list = [];
        list.push(GameData.uploadUser);
        list = list.concat(GameData.RankList);
        list = list.sort(compare("fullscore", "maxscore"));
        return list;
    };
    Rank.prototype.createTextFiled = function (text, width, height, y, x, txtSize, center, color) {
        if (y === void 0) { y = 0; }
        if (x === void 0) { x = 0; }
        if (txtSize === void 0) { txtSize = 30; }
        if (center === void 0) { center = true; }
        if (color === void 0) { color = 0xffffff; }
        var txt = new egret.TextField();
        txt.text = text;
        txt.width = width;
        txt.height = height;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        if (center) {
            txt.textAlign = egret.HorizontalAlign.CENTER;
        }
        txt.bold = true;
        txt.textColor = color;
        txt.size = txtSize;
        txt.y = y;
        txt.x = x;
        return txt;
    };
    Rank.prototype.createTextFlow = function (text, width, height, y, x, txtSize, center, color) {
        if (y === void 0) { y = 0; }
        if (x === void 0) { x = 0; }
        if (txtSize === void 0) { txtSize = 30; }
        if (center === void 0) { center = true; }
        if (color === void 0) { color = 0xffffff; }
        var txt = new egret.TextField();
        txt.width = width;
        txt.height = height;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        if (center) {
            txt.textAlign = egret.HorizontalAlign.CENTER;
        }
        txt.textFlow = text;
        txt.bold = true;
        txt.textColor = color;
        txt.size = txtSize;
        txt.y = y;
        txt.x = x;
        return txt;
    };
    Rank.prototype.createRankList = function (rankList, index) {
        var content = new egret.Sprite();
        // 先排序；
        for (var i = 1; i <= rankList.length; i++) {
            var backgroud = new egret.Shape();
            backgroud.graphics.clear();
            if (i == index) {
                backgroud.graphics.beginFill(0xCDAF95, 1);
            }
            else if (i % 2 == 0) {
                backgroud.graphics.beginFill(0x404a54, 1);
            }
            else {
                backgroud.graphics.beginFill(0x36404a, 1);
            }
            backgroud.graphics.drawRect(0, (i - 1) * this.stageH / 15, this.stageW - 40, this.stageH / 15);
            backgroud.graphics.endFill();
            var ageFile = this.createTextFiled(i.toString(), backgroud.width / 5, backgroud.height, (i - 1) * this.stageH / 15);
            switch (i) {
                case 1:
                    ageFile.textColor = 0xda5907;
                    break;
                case 2:
                    ageFile.textColor = 0xf99a5d;
                    break;
                case 3:
                    ageFile.textColor = 0xfbc29d;
                    break;
                default:
                    ageFile.textColor = 0xd3d1cf;
                    break;
            }
            if (i == index) {
                var up = 0;
                if (this.lastIndex == -1) {
                    up = rankList.length - index;
                }
                else {
                    up = this.lastIndex - index;
                }
                this.lastIndex = index;
                if (up > 0) {
                    var textFlow = [
                        { text: rankList[i - 1]["names"] },
                        { text: " ↑" + up.toString(), style: { "fontFamily": "微软雅黑", "textColor": 0x00FF00, "bold": true } }
                    ];
                }
                else if (up < 0) {
                    var textFlow = [
                        { text: rankList[i - 1]["names"] },
                        { text: " ↓" + (-1 * up).toString(), style: { "fontFamily": "微软雅黑", "textColor": 0xFF0000, "bold": true } }
                    ];
                }
                else {
                    var textFlow = [
                        { text: rankList[i - 1]["names"] },
                        { text: " - ", style: { "fontFamily": "微软雅黑", "textColor": 0x0000ff, "bold": true } }
                    ];
                }
                var name = this.createTextFlow(textFlow, backgroud.width * 1.7 / 5, backgroud.height, (i - 1) * this.stageH / 15, ageFile.x + ageFile.width, 30, false);
            }
            else {
                var name = this.createTextFiled(rankList[i - 1]["names"], backgroud.width * 1.7 / 5, backgroud.height, (i - 1) * this.stageH / 15, ageFile.x + ageFile.width, 30, false);
            }
            var fullScore = this.createTextFiled(rankList[i - 1]["fullscore"], backgroud.width * 1.15 / 5, backgroud.height, (i - 1) * this.stageH / 15, name.x + name.width);
            var maxScore = this.createTextFiled(rankList[i - 1]["maxscore"], backgroud.width * 1.15 / 5, backgroud.height, (i - 1) * this.stageH / 15, fullScore.x + fullScore.width);
            content.addChild(backgroud);
            content.addChild(ageFile);
            content.addChild(name);
            content.addChild(fullScore);
            content.addChild(maxScore);
        }
        return content;
    };
    Rank.prototype.RankList = function () {
        this.removeChildren();
        var rankList = this.sortRankList();
        var index = rankList.indexOf(GameData.uploadUser) + 1;
        console.log(rankList);
        var content = this.createRankList(rankList, index);
        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = this.stageW - 40;
        myscrollView.height = this.stageH / 2.7;
        myscrollView.x = this.stageW / 2;
        myscrollView.y = this.stageH / 2 + 60;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        myscrollView.setScrollTop(this.stageH / 15 * (index - 3));
        //垂直滚动设置为 on
        myscrollView.verticalScrollPolicy = "on";
        //水平滚动设置为 auto
        myscrollView.horizontalScrollPolicy = "off";
        // console.log(this.EndSprite)
        var y = myscrollView.y - myscrollView.height / 2 - this.stageH / 15;
        this.createSigleLine(y, "排名", "昵称", "总分", "单局最高分", 25);
        var y2 = myscrollView.y + myscrollView.height / 2 + 25;
        // this.createSigleLine(y2,index.toString(),SceneMange.uploadUser["names"],SceneMange.uploadUser["fullscore"].toString(),SceneMange.uploadUser["maxscore"].toString(),30);
        this.addChild(myscrollView);
        var y_title = y - 80;
        this.Ranktitle(y_title);
    };
    Rank.prototype.createSigleLine = function (y, rank, names, score, maxscore, txtSize) {
        var backgroud = new egret.Shape();
        backgroud.graphics.clear();
        backgroud.graphics.beginFill(0x404a54, 1);
        backgroud.graphics.drawRect(20, y, this.stageW - 40, this.stageH / 15);
        backgroud.graphics.endFill();
        var ageFile = this.createTextFiled(rank, backgroud.width / 5, backgroud.height, y, backgroud.x + 10, txtSize);
        switch (rank) {
            case "1":
                ageFile.textColor = 0xda5907;
                break;
            case "2":
                ageFile.textColor = 0xf99a5d;
                break;
            case "3":
                ageFile.textColor = 0xfbc29d;
                break;
            default:
                ageFile.textColor = 0xd3d1cf;
                break;
        }
        var name = this.createTextFiled(names, backgroud.width * 1.7 / 5, backgroud.height, y, ageFile.x + ageFile.width, txtSize, false);
        var fullScore = this.createTextFiled(score, backgroud.width * 1.15 / 5, backgroud.height, y, name.x + name.width, txtSize);
        var maxScore = this.createTextFiled(maxscore, backgroud.width * 1.15 / 5, backgroud.height, y, fullScore.x + fullScore.width, txtSize);
        this.addChild(backgroud);
        this.addChild(ageFile);
        this.addChild(name);
        this.addChild(fullScore);
        this.addChild(maxScore);
    };
    Rank.prototype.Ranktitle = function (y) {
        var label = new egret.TextField();
        label.fontFamily = "微软雅黑";
        label.width = 400;
        label.text = "排行榜";
        label.x = this.stageW / 2 - label.width / 2;
        label.y = y;
        label.textColor = 0xffffff;
        label.size = 40;
        label.bold = true;
        label.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(label);
    };
    return Rank;
}(egret.Sprite));
__reflect(Rank.prototype, "Rank");
/**分数排行*/
var GameRank = (function (_super) {
    __extends(GameRank, _super);
    function GameRank() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameRank.prototype.updateScore = function () {
        platform.getRank(this.update, this);
    };
    /**查看排行榜返回函数 */
    GameRank.prototype.update = function (obj) {
        console.log("代码:" + obj.code + ",消息:" + obj.message + ",数据:" + obj.data);
        var _this = GamePanel.rank;
        if (obj.code == 10000) {
            console.log("获取成功");
            var data = obj.data;
            var len = data.length;
            var myRank = -1;
            for (var i = 0; i < len; i++) {
                //this.txtRank.text+=("积分:" + data[i].score + ",排名:" + data[i].rank+"\n");
                var score = data[i].score;
                console.log(i, score, _this.max);
                if (i < _this.max) {
                    var item = _this.items[i];
                    item.txtScore.text = score;
                    console.log("item", item.txtScore.text, score);
                }
                if (i < len - 1) {
                    var next = Number(data[i + 1].score);
                    score = Number(score);
                    console.log(GameData.score, next, score);
                    if (GameData.score == score) {
                        myRank = i + 1;
                    }
                    else if (GameData.score > next && GameData.score <= score) {
                        myRank = i + 2;
                    }
                    else if (GameData.score >= data[0].score) {
                        myRank = 1;
                    }
                    else if (GameData.score <= data[len - 1].score) {
                        myRank = len;
                    }
                }
            }
            if (_this.txtRank) {
                if (myRank > 0)
                    _this.txtRank.text = "你本次得" + GameData.score + "分，排在第" + myRank + "名。";
                else
                    _this.txtRank.text = "未上榜";
            }
        }
        else {
            console.log("获取失败");
        }
    };
    return GameRank;
}(moon.BasicGameRank));
__reflect(GameRank.prototype, "GameRank");
/** 数据分析处理 */
var DataProcess = (function (_super) {
    __extends(DataProcess, _super);
    function DataProcess() {
        var _this = _super.call(this) || this;
        _this.stageH = egret.MainContext.instance.stage.stageHeight;
        _this.stageW = egret.MainContext.instance.stage.stageWidth;
        _this.createLine();
        return _this;
    }
    DataProcess.prototype.createLine = function () {
        var rankList = GameData.uploadMessage.concat();
        var content = this.createRankList(rankList);
        var myscrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = this.stageW;
        myscrollView.height = this.stageH / 2;
        myscrollView.x = this.stageW / 2;
        myscrollView.y = this.stageH / 2 + 60;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        //垂直滚动设置为 on
        myscrollView.verticalScrollPolicy = "on";
        //水平滚动设置为 auto
        myscrollView.horizontalScrollPolicy = "off";
        this.addChild(myscrollView);
    };
    DataProcess.prototype.createTextFiled = function (text, width, height, y, x, txtSize, center, color) {
        if (y === void 0) { y = 0; }
        if (x === void 0) { x = 0; }
        if (txtSize === void 0) { txtSize = 30; }
        if (center === void 0) { center = true; }
        if (color === void 0) { color = 0xffffff; }
        var txt = new egret.TextField();
        txt.text = text;
        txt.width = width;
        txt.height = height;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        if (center) {
            txt.textAlign = egret.HorizontalAlign.CENTER;
        }
        txt.bold = true;
        txt.textColor = color;
        txt.size = txtSize;
        txt.y = y;
        txt.x = x;
        return txt;
    };
    // 返回正确答案, sigle是游戏中出现的广告，question是问题中出现的广告，返回结果为问题对应的答案
    DataProcess.prototype.resultSingleJudge = function (sigle, question) {
        var success = [0, 0, 0, 0, 0, 0];
        for (var i = 0; i < question.length; i++) {
            if (sigle.indexOf(question[i]) >= 0) {
                success[i] = 1;
            }
        }
        return success;
    };
    DataProcess.prototype.resultJudgeRightFalse = function (uploadMessage) {
        var result = [0, 0]; //[出现的正确次数；未出现的正确次数]
        var sigle = uploadMessage.slice(1, 4);
        if (uploadMessage[0] == 2 || uploadMessage[0] == 4) {
            sigle = uploadMessage.slice(1, 1 + uploadMessage[11]);
        }
        var question = uploadMessage.slice(4, 10);
        var answer = this.resultSingleJudge(sigle, question); // 正确答案
        var answer_user = uploadMessage.slice(15, 21); // 玩家选择的答案
        for (var i = 0; i < answer.length; i++) {
            if (answer[i] == answer_user[i]) {
                if (answer[i] == 1) {
                    result[0]++;
                }
                else {
                    result[1]++;
                }
            }
        }
        return "" + result[0] + " / " + "" + result[1];
    };
    DataProcess.prototype.resultRightFalse = function (uploadMessage) {
        var result = [0, 0]; //[出现的正确次数；未出现的正确次数]
        var sigle = uploadMessage.slice(1, 4);
        if (uploadMessage[0] == 2 || uploadMessage[0] == 4) {
            sigle = uploadMessage.slice(1, 1 + uploadMessage[11]);
        }
        var question = uploadMessage.slice(4, 10);
        var answer = this.resultSingleJudge(sigle, question); // 正确答案
        var answer_user = uploadMessage.slice(15, 21); // 玩家选择的答案
        var pass_answer = answer.join("");
        var pass_answer_user = answer_user.join("");
        return pass_answer + " / " + pass_answer_user;
    };
    DataProcess.prototype.createRankList = function (rankList) {
        var content = new egret.Sprite();
        // 先排序；
        for (var i = 1; i < rankList.length - 1; i++) {
            var backgroud = new egret.Shape();
            backgroud.graphics.clear();
            backgroud.graphics.beginFill(0x36404a, 1);
            backgroud.graphics.drawRect(0, (i - 1) * this.stageH / 15, this.stageW - 40, this.stageH / 15);
            backgroud.graphics.endFill();
            var ageFile = this.createTextFiled(rankList[i][0] + "", backgroud.width / 7, backgroud.height, (i - 1) * this.stageH / 15);
            ageFile.textColor = 0xda5907;
            var name = this.createTextFiled(rankList[i][21] + "", backgroud.width * 1 / 7, backgroud.height, (i - 1) * this.stageH / 15, ageFile.x + ageFile.width, 30, false);
            var fullScore = this.createTextFiled(rankList[i][22] + "", backgroud.width * 1 / 7, backgroud.height, (i - 1) * this.stageH / 15, name.x + name.width);
            var maxScore = this.createTextFiled(this.resultJudgeRightFalse(rankList[i]), backgroud.width * 1 / 7, backgroud.height, (i - 1) * this.stageH / 15, fullScore.x + fullScore.width);
            var testScore = this.createTextFiled(this.resultRightFalse(rankList[i]), backgroud.width * 3 / 7, backgroud.height, (i - 1) * this.stageH / 15, maxScore.x + maxScore.width);
            content.addChild(backgroud);
            content.addChild(ageFile);
            content.addChild(name);
            content.addChild(fullScore);
            content.addChild(maxScore);
            content.addChild(testScore);
        }
        return content;
    };
    return DataProcess;
}(egret.Sprite));
__reflect(DataProcess.prototype, "DataProcess");
/**分数设置*/
var GameSet = (function (_super) {
    __extends(GameSet, _super);
    function GameSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GameSet;
}(moon.BasicGameSet));
__reflect(GameSet.prototype, "GameSet");
