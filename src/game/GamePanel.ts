var CONST_SCORE_HIGHEST:string="playBall score highest";//最高分数
var GamePanel={rank:null,over:null,game:null};
class GameMain extends moon.BasicGameMain
{
    private panelWelcome: egret.Sprite;

    private responseLabel: egret.TextField;

    private static instance: GameMain;

    private panelQues:QuesScreen;
    // 实例化单例获取方法
    public static getInstance(): GameMain{
        if(!GameMain.instance){
            GameMain.instance = new GameMain();
        }
        return GameMain.instance;
    }
    protected initView():void
    {
        //this.createBgGradientFill();

        this.panelWelcome = new Welcome();
        this.addChild(this.panelWelcome);

        //面板－主要逻辑处理
        this.panelGame=new GameControl;
        this.panelGame.addEvent(MoonEvent.OVER,this.onOver,this);
        // this.addChild(this.panelGame);
        GamePanel.game=this.panelGame;

        //面板－设置
        this.panelSet=new GameSet;
        this.panelSet.addEvent(MoonEvent.PLAY,this.onSetHandler,this);
        this.panelSet.addEvent(MoonEvent.CHANGE,this.onSetHandler,this);

        //面板－开始
        this.panelStart=new GameStart;
        this.panelStart.addEvent(moon.MoonEvent.START,this.start,this);
        // this.addChild(this.panelStart);

        this.panelQues=new QuesScreen;

        //面板－结束
        this.panelOver=new GameOver;
        this.panelOver.addEvent(moon.MoonEvent.START,this.start,this);
        //this.addChild(this.panelOver);

        //按钮－设置
        this.setBtn=new moon.SetButton;
        this.setBtn.x=100;
        this.setBtn.y=100;
        this.setBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.openSetPanel,this);
        //this.addChild(this.setBtn);

        this.Adver_Init();  // 广告类型的初始化

        //读取历史最高分
        GameData.scoreHighest=Number(moon.BasicGameStorage.localRead(CONST_SCORE_HIGHEST));
    }

    private Adver_Init(){
        GameData.gameType = control.SequenceRandom.randomSequence();
        GameData.gameType = control.SequenceRandom.randomSequence();
        GameData.uploadMessage = [];
        GameData.gameIndex = 0;

        GameData.gameType = [4].concat(GameData.gameType);
        console.log("游戏类型序列是：", GameData.gameType);

        this.getRankList();
    }

    private getRankList(){
        var request = new egret.HttpRequest();
        request.withCredentials = true;
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("//icontinua.com/ftf/minigame/getRankList2",egret.HttpMethod.GET);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send();
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }

    private onGetComplete(event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data : ",JSON.parse(request.response).data);

        GameData.RankList = JSON.parse(request.response).data;
    }

    private onGetIOError(event:egret.IOErrorEvent):void {
        console.log(event);
        if(!this.responseLabel){
            this.responseLabel = new egret.TextField();
        }

        this.responseLabel.size = 18;
        this.responseLabel.text = event.data.toString() + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
    }
    private onGetProgress(event:egret.ProgressEvent):void {
        console.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
        // SceneMange.getInstance().changeScene("endScene");
        if(!this.responseLabel){
            this.responseLabel = new egret.TextField();
        }

        this.responseLabel.size = 18;
        this.responseLabel.text = Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
    }

    public AddPanel(panel: string){
        this.removeChildren();
        this.addChild(this[panel]);
        if(panel == "panelGame"){
            this.panelStart=new GameStart;
            this.panelStart.addEvent(moon.MoonEvent.START,this.start,this);
            this.addChild(this["panelStart"]);
        }
    }
}

class Welcome extends egret.Sprite{
    private stageW: number;
    private stageH: number;

    private usr_name: string;

    public constructor(){
        super();
        console.log("执行")
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.createBackGroundImage();
        this.createWelcome();
        this.beginButton();
    }
    private createWelcome(){
        var textF: egret.TextField = new egret.TextField();
        textF.text = "Welcome";
        textF.width = this.stageW - 20;
        textF.textColor = 0x000000;
        textF.bold = true;
        textF.x = 10;
        textF.size = 40;
        textF.textAlign = egret.HorizontalAlign.CENTER;
        textF.y = 40;

        var textLittle: egret.TextField = new egret.TextField();
        textLittle.text = "本次实验旨在";
        textLittle.width = this.stageW - 20;
        textLittle.textColor = 0x000000;
        textLittle.size = 25;
        textLittle.bold = false;
        textLittle.x = 10;
        textLittle.textAlign = egret.HorizontalAlign.CENTER;
        textLittle.y = textF.y + 70;


        var textLittle1: egret.TextField = new egret.TextField();
        textLittle1.text = "探讨在小游戏中投放不同形式的广告给用户带来的影响";
        textLittle1.width = this.stageW - 20;
        textLittle1.textColor = 0x000000;
        textLittle1.size = 30;
        textLittle1.bold = false;
        textLittle1.x = 10;
        textLittle1.textAlign = egret.HorizontalAlign.CENTER;
        textLittle1.y = textLittle.y + 60;

        var tip:egret.TextField = new egret.TextField();
        tip.text = "tip";
        tip.textColor = 0x8B814C;
        tip.width = this.stageW /2;
        tip.size = 30;
        tip.x = this.stageW /2;
        tip.bold = false;
        tip.y = textLittle.y + this.stageH/7;
        tip.textAlign = egret.HorizontalAlign.LEFT;

        var shp:egret.Shape = new egret.Shape();
        shp.graphics.lineStyle( 4, 0x8B814C );
        shp.graphics.beginFill( 0x7FFF00, 1);
        shp.graphics.drawCircle( this.stageW / 2 - 15, tip.y + tip.height/2, 11 );
        shp.graphics.endFill();

        this.addChild( shp );

        var show1: egret.TextField = new egret.TextField();
        show1.text = "1、请您关闭手机，保持实验过程的专注；\n";
        show1.width = this.stageW ;
        show1.textColor = 0x000000;
        show1.size = 20;
        show1.bold = false;
        show1.x = this.stageW / 10;
        show1.y = tip.y + 60;

        var show155: egret.TextField = new egret.TextField();
        show155.text = "2、刚开始，您会试玩一局；\n";
        show155.width = this.stageW ;
        show155.textColor = 0x000000;
        show155.size = 20;
        show155.bold = false;
        show155.x = this.stageW / 10;
        show155.y = show1.y + 60;

        var show15: egret.TextField = new egret.TextField();
        show15.text = "3、整个实验过程大概耗时30-40分钟。\n";
        show15.width = this.stageW ;
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
    }

    private createBackGroundImage(){
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill(0xDCDCDC); //0xE6E6FA
        bg.graphics.drawRect( 0, 0, this.stageW, this.stageH );
        bg.graphics.endFill();
        this.addChild(bg);
    }

    private createInput(){
        var background: eui.Image = new eui.Image();

        //新建一个输入框
        var myEditableText:eui.EditableText = new eui.EditableText();

        //指定图片素材，这里使用上面的图片，并放入相应文件夹下
        background.source = "resource/assets/checkbox_unselect.png";
        //指定图片的九宫格，我们可以复习一下前面章节的内容
        background.scale9Grid = new egret.Rectangle(1.5,1.5,20,20);
        //指定其宽和高，用来当做背景.
        background.width = 500;
        background.height = 60;
        background.x = (this.stageW - background.width)/2;
        background.y = this.stageH/2+120;

        var txt: egret.TextField = new egret.TextField();
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
        myEditableText.addEventListener(egret.Event.CHANGE,this.onChang,this);
    }

    private onChang(e:egret.Event){
        egret.log(e.target.text);
        this.usr_name = e.target.text;
    }

    private beginButton(){
        var beginB: egret.Bitmap = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageW / 2 - beginB.width / 2;
        beginB.y = this.stageH - beginB.height - 200;

        var textInButton: egret.TextField = new  egret.TextField();
        textInButton.text = "我已阅读，开始"
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height/2 - textInButton.height/2)-5 ;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;

        this.addChild(beginB);
        this.addChild(textInButton);

        beginB.touchEnabled = true;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginButtonTap, this);
    }

    private beginButtonTap(evt:egret.Event){
        if(!this.usr_name) {
            this.usr_name = "unknown" + Math.floor(Math.random() * 100).toString();
        }
        GameData.uploadUser["names"] = this.usr_name;

        this.removeChildren();
        this.createTimeScreen();
    }

    private createTimeScreen(){
        this.createBackGroundImage();
        var progere: TransferScreen = new TransferScreen("第 1/3 部分 - 预实验", "试玩一局", "panelGame");
        GameData.preGame = true;
        this.addChild(progere);
    }
}
/**切换场景界面**/
class TransferScreen extends egret.Sprite{

    private stageH: number;
    private stageW: number;

    private intervalDuration:number = 1000; // duration between intervals, in milliseconds
    private timeCount: number = 5;
    private countDownTextField: egret.TextField;
    private intervalID: number;

    private jumpScreen: string;

    private radius: number = 11; // 圆的半径
    public constructor(pro: string, discribe: string, jumpsceen: string) {
        super();
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.createBackground();
        this.jumpScreen = jumpsceen;
        // this.createProgress(pro);
        // var progre: Progress = new Progress(pro);
        // this.addChild(progre);

        this.createMainFrame(discribe);
        this.createTimer();
    }

    private createBackground(){
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill( 0xDCDCDC); //0xE6E6FA
        bg.graphics.drawRect( 0, 0, this.stageW, this.stageH );
        bg.graphics.endFill();
        bg.touchEnabled = true;
        this.addChild(bg);
    }

    private createMainFrame(discribe: string){
        var next: egret.TextField = new egret.TextField();
        next.text = "接下来,您将...";
        next.width = this.stageW;
        next.textColor = 0x000000;
        next.size = 20;
        next.textAlign = egret.HorizontalAlign.CENTER;
        next.bold = false;
        next.y =  this.stageH / 4;

        var instrustion:string = discribe;
        var insru: egret.TextField = new egret.TextField();
        insru.text = instrustion;
        insru.width = this.stageW ;
        insru.textColor = 0x000000;
        insru.size = 30;
        insru.textAlign = egret.HorizontalAlign.CENTER;
        insru.bold = false;
        insru.y = next.y + 60;
        this.addChild(next);
        this.addChild(insru);

        if(discribe == "开始 2 组正式实验"){
            var instrustion:string = "每组 6 局";
            var insru_: egret.TextField = new egret.TextField();
            insru_.text = instrustion;
            insru_.width = this.stageW ;
            insru_.textColor = 0x000000;
            insru_.size = 25;
            insru_.textAlign = egret.HorizontalAlign.CENTER;
            insru_.bold = false;
            insru_.y = insru.y + 60;
            this.addChild(insru_);
        }
    }

    public createTimer(){
        //创建一个计时器对象
        this.SetIntervalExample();

        var countdown: egret.TextField = new egret.TextField();
        countdown.text = "开始倒计时"
        countdown.size = 15;
        countdown.textAlign = egret.HorizontalAlign.CENTER;
        countdown.y = this.stageH/2 - 80;
        countdown.width = this.stageW;
        countdown.textColor = 0x000000;
        this.addChild(countdown);

        var shp:egret.Shape = new egret.Shape();
        shp.graphics.lineStyle( 4, 0x8B814C );
        shp.graphics.beginFill( 0xDCDCDC, 1);
        shp.graphics.drawCircle( this.stageW/2, this.stageH/2, 40 );
        shp.graphics.endFill();
        this.addChild( shp );

        if(!this.countDownTextField){
            this.countDownTextField = new egret.TextField();
        }
        this.countDownTextField.text = this.timeCount.toString();
        this.countDownTextField.width = this.stageW;
        this.countDownTextField.textAlign = egret.HorizontalAlign.CENTER;
        this.countDownTextField.textColor = 0x000000;
        this.countDownTextField.bold = true;
        this.countDownTextField.size = 40;
        this.countDownTextField.y = this.stageH/2-20;
        this.addChild(this.countDownTextField);
    }
    public SetIntervalExample() {
        this.intervalID = egret.setTimeout(this.myRepeatingFunction,this,this.intervalDuration);
    }

    private beginButton(){
        var beginB: egret.Bitmap = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageW / 2 - beginB.width / 2;
        beginB.y = this.stageH - beginB.height - 100;

        var textInButton: egret.TextField = new  egret.TextField();
        textInButton.text = "开始"
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height/2 - textInButton.height/2)-5 ;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;

        this.addChild(beginB);
        this.addChild(textInButton);

        beginB.touchEnabled = true;
        var that=this;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            /*在这里进入下一个场景*/
            that.dispatchEventWith(moon.MoonEvent.START);
            that.removeChildren();
            that.removeFromParent();
            GameMain.getInstance().AddPanel(that.jumpScreen);

        }, this);
    }
    /**把自己从父级删除*/
    public removeFromParent(value:Boolean=false):void
    {
        var _parent:DisplayObjectContainer=this.parent as DisplayObjectContainer;
        if(_parent&&_parent.contains(this))		_parent.removeChild(this);
        _parent=null;
    }
    private myRepeatingFunction(obj:any): void {
        this.timeCount = this.timeCount - 1 ;
        if(this.timeCount >= 0){
            this.countDownTextField.text = this.timeCount.toString();
            this.intervalID = egret.setTimeout(this.myRepeatingFunction,this,this.intervalDuration);
        }else{
            egret.clearInterval(this.intervalID);
            console.log("清楚了计时")

            this.beginButton();

        }
    }
}
/**开始界面*/
class GameStart extends moon.BasicGameStart{
	protected initView():void
	{
		this.createImageBg("startPanel_png");
		
		var btn:MButton=new MButton(new MImage("btnStart_png"),new MImage("btnStart_png"))
		this.addChild(btn);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
        btn.x=(this.stageWidth-btn.width)>>1;
        btn.y=650;
	}
}
/**结束界面*/
class GameOver extends moon.BasicGameOver
{
    private layout:Layout=Layout.getIns();
    private score:number;
    private txtDescribe: egret.TextField;
    protected initView():void{
        this.layout.setStageWH(this.stageWidth,this.stageHeight);
        this.createBackground(0x808080, 0.9);
        this.txtDescribe=this.createText(0,50);
        this.txtScore=this.createText(0,50+60);
        this.txtScore.size=50;
        this.txtDescribe.size=30;

        this.btnRestart=this.createMButton("buttonnext_png",0,0);
        this.btnRestart.width = this.btnRestart.width/2
        this.btnRestart.x =this.stageWidth / 2 - this.btnRestart.width;
        this.btnRestart.y = this.stageHeight - this.btnRestart.height - 120;

        var next:egret.TextField = this.createText(0, this.btnRestart.y );
        next.text = "下一步";
        next.height = this.btnRestart.height;
        next.width = this.stageWidth;
        next.size = 25;
        next.textAlign = egret.HorizontalAlign.CENTER;
        next.textColor = 0x000000;
        next.verticalAlign = egret.VerticalAlign.MIDDLE;
        // this.RankList();

        this.addChild(Rank.getInstance());

    }
    protected createMButton(name:string,x:number,y:number):MButton
    {
        var btn:MButton=this.createSkinBtn(name,name);
        btn.x=x;btn.y=y;
        return btn;
    }
    protected createSkinBtn(value1:string,value2:string):MButton
    {
        var skin:Scale9Image=new Scale9Image(value1);
        var skin2:Scale9Image=new Scale9Image(value2);
        skin2.alpha=0.5;
        var btn:MButton=new MButton(skin,skin2);
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
        this.addChild(btn);
        return btn;
    }
    protected onClick(e:egret.TouchEvent):void
    {
        if(e.currentTarget==this.btnRestart){
            console.log("下一步进入问题页面");

            GameData.gameIndex ++;
            console.log("game index:", GameData.gameIndex);

            let questionna: Questionaire = new Questionaire();
            var that=this;
            questionna.addEventListener(moon.MoonEvent.START,()=>{
                // that.dispEvent(MoonEvent.START);
                if(GameData.preGame){
                    GameData.preGame = false;
                    GameData.uploadUser["fullscore"]=0;
                    GameData.uploadUser["maxscore"]=0;
                    GameData.scoreHighest = 0;
                }
                var progere: TransferScreen = new TransferScreen("第 2/3 部分 - 正式实验", "开始 第 "+GameData.gameIndex+" 局 正式实验", "panelGame");
                that.addChild(progere);
                var here = that;
                progere.addEventListener(moon.MoonEvent.START,()=>{
                    Tween.get(here).to({alpha:0},300).call(here.removeFromParent,here);
                },that);

            },this);
            this.addChild(questionna);

        }
       // SoundControl.getIns().play(MUSIC_CLICK_BTN);
    }

    public update(data:Object):void
    {
        GameData.score=data["score"];
        if(GameData.score>GameData.scoreHighest){
            GameData.scoreHighest=GameData.score;
            //moon.BasicGameStorage.localWrite(CONST_SCORE_HIGHEST,GameData.scoreHighest.toString());
        }
        this.txtDescribe.textFlow=<Array<egret.ITextElement>>[
            {text: "=  ", style: {"textColor": 0xC0C0C0}}
            , {text: "本局得分", style: {"fontFamily": "微软雅黑", "textColor": 0xFFFFFF}}
            , {text: "  =", style: {"textColor": 0xC0C0C0}}
        ];
        this.txtScore.text=String(GameData.score);

        this.txtDescribe.x = this.stageWidth/2 - this.txtDescribe.width/2;
        this.txtScore.x = this.stageWidth/2 - this.txtScore.width/2;

        GameData.uploadMessage[GameData.uploadMessage.length-1].push(GameData.score);  // 得分
        GameData.uploadMessage[GameData.uploadMessage.length-1].push(GameData.adver_sum);  // 广告出现次数
        console.log("点击视频的blood:",GameData.video_tap);
        GameData.uploadMessage[GameData.uploadMessage.length-1] = GameData.uploadMessage[GameData.uploadMessage.length-1].concat(GameData.video_tap);

        GameData.uploadUser["fullscore"]+=GameData.score;
        GameData.uploadUser["maxscore"]=GameData.scoreHighest;

        console.log("adver_sum:::::", GameData.adver_sum);
        Rank.getInstance().RankList();
    }

}

class Questionaire extends moon.BasicGameStart{
    private question_index:number = 0;
    private couldGoon: boolean = false;
    private questionLayer: egret.Sprite;


    /**加载到舞台之后调用 */
    protected render():void
    {
        super.render();
        this.initView();
    }

    protected initView(){
        this.question_index = 0;
        this.couldGoon = false;
        this.createBackground(0xDCDCDC,1);

        if(!this.questionLayer){
            this.questionLayer = new egret.Sprite;
        }
        this.addChild(this.questionLayer);
        this.updateQuestion();
        this.createButtonImage();
    }

    private createButtonImage(){
        var beginB: egret.Bitmap = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageWidth / 2 - beginB.width / 2;
        beginB.y = this.stageHeight - beginB.height - 120;

        var textInButton: egret.TextField = new  egret.TextField();
        textInButton.text = "下一步"
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height/2 - textInButton.height/2)-5 ;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;

        this.addChild(beginB);
        this.addChild(textInButton);

        beginB.touchEnabled = true;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginButtonTap, this);
    }

    private updateQuestion(){
        this.questionLayer.removeChildren();
        if(GameData.preGame){
            switch (this.question_index){
                case 0:
                    this.createQuestionAndAnswers("1、\"哈罗单车HelloBike\"的广告是否在本局游戏中出现", GameData.questionList["answer"], -1);
                    break;
                default:
                    this.question_index = 0;
                    // TODO transfer -- 进入正式游戏
                    this.createBackground(0xDCDCDC, 1);
                    this.dispatchEventWith(moon.MoonEvent.START);
                    Tween.get(this).to({alpha: 0}, 300).call(this.removeFromParent, this);
                    break;
            }
        }else {
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
                    let answer29: Array<string> = ["A、1分-不干扰", "B、2分-稍微干扰", "C、3分-有些干扰", "D、4分-干扰", "E、5分-非常干扰"];
                    let question29: string = "7、这种广告形式是否干扰到您的游戏操作：";
                    this.createQuestionAndAnswers(question29, answer29);
                    break;
                case 7:
                    let answer20: Array<string> = ["A、1分-非常不愿意", "B、2分-不愿意", "C、3分-没有倾向", "D、4分-愿意", "E、5分-非常愿意"];
                    let question20: string = "8、您是否愿意继续玩有这种广告形式的该游戏：";
                    this.createQuestionAndAnswers(question20, answer20);
                    break;
                default:
                    this.question_index = 0;
                    if (GameData.gameIndex > GameData.GAMESNUMBER) {  // 问答环节-基础问题
                        this.removeChildren();
                        var progere: TransferScreen = new TransferScreen("第 1/3 部分 - 基础问题", "基础问题", "panelQues");
                        GameData.uploadMessage.push([]);
                        this.addChild(progere);
                    } else { //发动事件start，重新开始一局
                        this.dispatchEventWith(moon.MoonEvent.START);
                        Tween.get(this).to({alpha: 0}, 300).call(this.removeFromParent, this);
                    }
                    break;
            }
        }
    }
    private createQuestionAndAnswers(quest: string, answe: Array<string>, num: number = 100){
        let questionna: Questionnaire = new Questionnaire();
        questionna.addEventListener(Questionnaire.ACTION, this.onAction, this);
        questionna.setQuestionAnswers(quest, answe, num);
        this.questionLayer.y = this.stageHeight/5;
        this.questionLayer.addChild(questionna);
        this.couldGoon = false;
    }

    private onAction(){
        this.couldGoon = true;
        console.log("变成true");
    }
    private beginButtonTap() {
        if (this.couldGoon) {
            this.question_index++;
            this.updateQuestion();
        } else {
            console.log("请做出选择");
            var makechoiceAttention: egret.TextField = new egret.TextField();
            makechoiceAttention.textAlign = egret.HorizontalAlign.CENTER;
            makechoiceAttention.text = "请先\"选择答案\"，再点击\"下一步\"";
            makechoiceAttention.textColor = 0xff0000;
            makechoiceAttention.width = this.stageWidth;
            makechoiceAttention.y = this.stageHeight - 400;

            this.addChild(makechoiceAttention);
            var that = this;
            egret.Tween.get(makechoiceAttention).to({alpha: 0.4}, 1000).call(
                () => {
                    that.removeChild(makechoiceAttention);
                }
            )
        }
    }
}

class Questionnaire extends egret.Sprite {

    private stageW: number = 0;
    private stageH: number = 0;

    private question: string;
    private answers: Array<string>;

    private choice: string;
    private haschoice: boolean;

    private currentView: egret.TextField;

    public static ACTION:string = "action";

    private adverName: Array<string>;
    public constructor() {
        super();
        this.init();
        this.adverName = ["q_alipay_jpg","q_geli_jpg","q_iphone_x_jpg","q_KFC_png","q_meituan_jpg","q_nike_png","q_ofo_jpg","q_pinduoduo_jpg","q_Starbucks_jpg","q_tebu_jpg","q_vivo_jpg","q_weiqian_jpg"];
    }

    public getChoice():string{
        if(this.haschoice){
            return this.choice;
        }else{
            return null;
        }
    }

    public getIfChoice(): boolean{
        return this.haschoice;
    }

    public setQuestionAnswers(ques: string, answe: Array<string>, num: number=100){
        this.question = ques;
        this.answers = answe;
        this.creatQuestion(num);
    }

    // 初始化(给开始按钮绑定点击事件)
    private init(){
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.haschoice = false;
    }

    private creatQuestion(num: number){
        var textview:egret.TextField = new egret.TextField();
        textview.text = this.question;
        this.addChild(textview);

        textview.width = this.stageW - 100;
        textview.textColor = 0x000000;
        textview.size = 30;
        textview.bold = true;
        textview.x = 50;
        textview.y = 0;

        if(num<=11){
            var adver:egret.Bitmap = new egret.Bitmap();
            if(num<0){
                adver.texture = RES.getRes("hellobike_jpg");
            }else{
                adver.texture = RES.getRes(this.adverName[num]);
            }
            adver.width = 200;
            adver.height = 200;
            adver.x = (this.stageW - adver.width)/2;
            adver.y = textview.y + textview.height + 20;
            this.addChild(adver);
        }

        let flag = 0;
        for(let ans of this.answers){
            var answerView:egret.TextField = new egret.TextField();
            answerView.text = ans;
            this.addChild(answerView);

            answerView.width = this.stageW - 220;
            answerView.height = 40;
            answerView.size = 30;
            answerView.x = textview.x+60;
            answerView.verticalAlign = egret.VerticalAlign.MIDDLE;
            flag ++;
            answerView.y = num<=11?adver.y + adver.height - 10 + flag*(answerView.height+40):textview.y + textview.height - 10 + flag*(answerView.height+40);

            answerView.textColor = 0x000000;
            answerView.background = true;
            answerView.backgroundColor = 0xD3D3D3;
            answerView.touchEnabled = true;
            answerView.addEventListener(egret.TouchEvent.TOUCH_TAP, this.chooseAnswer, this);
        }
    }

    private chooseAnswer(evt:egret.TouchEvent){
        this.choice = evt.target.text;

        if(this.haschoice){
            this.currentView.textColor = 0x000000;
            this.currentView.backgroundColor = 0xD3D3D3;
            GameData.uploadMessage[GameData.uploadMessage.length-1][GameData.uploadMessage[GameData.uploadMessage.length-1].length-1] = (this.answers.indexOf(this.choice));
        }
        else{
            GameData.uploadMessage[GameData.uploadMessage.length-1].push(this.answers.indexOf(this.choice));
        }
        this.currentView = evt.target;

        this.haschoice = true;
        this.dispatchEventWith(Questionnaire.ACTION);

        this.currentView.textColor = 0x228B22;
        this.currentView.backgroundColor = 0xBDB76B;

        console.log("push 选择结果", this.answers.indexOf(this.choice));
    }
}

class QuesScreen extends egret.Sprite {

    private stageW: number = 0;
    private stageH: number = 0;

    private questionnaire: Array<Questionnaire>;

    private questionLayer: egret.Sprite;
    private textInputName: egret.TextField;
    private textInputAge: egret.TextField;
    private progress: number = 0;

    private hasChoice1: boolean = false;
    private choice1: string;
    private currentView1: egret.TextField;

    private hasChoice2: boolean = false;
    private choice2: string;
    private currentView2: egret.TextField;

    private responseLabel: egret.TextField;

    private couldGoOn: boolean = false;
    private button_img: egret.Bitmap;
    private button_txt: egret.TextField;
    constructor() {
        super();
        this.init();
    }

    // 初始化(给开始按钮绑定点击事件)
    private init(){
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.createBackGroundImage();
        if(!this.questionLayer){
            this.questionLayer = new egret.Sprite();
        }
        this.addChild(this.questionLayer);
        this.questionLayer.width = this.stageW;
        this.questionLayer.x = 0;
        this.questionLayer.y = this.stageH/4;


        this.progress = 1;
        this.updateQuestion();

        this.createButtonImage();
    }

    private layTxBg(tx:egret.TextField):void {
        var shp:egret.Shape = new egret.Shape;
        shp.graphics.beginFill(0xffffff);
        shp.graphics.drawRect(tx.x, tx.y, tx.width, tx.height);
        shp.graphics.endFill();
        this.questionLayer.addChild(shp);
    }

    private createInputName(question: string){
        this.questionLayer.width = this.stageW;
        this.questionLayer.x = 0;
        this.questionLayer.y = this.stageH/3;

        let ques: egret.TextField = new egret.TextField();
        ques.text = question;
        ques.width = this.stageW - 20;
        ques.textColor = 0x000000;
        ques.size = 35;
        ques.bold = true;
        ques.x = 50;
        // ques.textAlign = egret.HorizontalAlign.CENTER;
        ques.y = 0;
        this.questionLayer.addChild(ques);

        var content: egret.Sprite = new egret.Sprite();
        content.width = 100;
        content.height = this.stageH;

        for(let i=18; i< 70; i++){
            let ageFile:egret.TextField = new egret.TextField();
            // console.log(i.toString())
            ageFile.text = i.toString()
            ageFile.width = content.width;
            ageFile.textColor = 0x000000;
            ageFile.size = 25;
            ageFile.y = (i-18) * 30;
            ageFile.x = 0;
            ageFile.touchEnabled = true;
            ageFile.textAlign = egret.HorizontalAlign.CENTER;
            let that = this;
            ageFile.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt:egret.TouchEvent) {
                if(that.hasChoice1){
                    that.currentView1.textColor = 0x000000;
                }
                that.currentView1 = evt.target;
                that.choice1 = evt.target.text;
                that.hasChoice1 = true;
                that.currentView1.textColor = 0x228B22;
                console.log("选择了答案", that.choice1)
            }, content);
            content.addChild(ageFile);
        }
        // var content:egret.Sprite = this.createGird(50,50,9,9);

        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = 100;
        myscrollView.height = 300;
        myscrollView.x = this.stageW / 2;
        myscrollView.y = ques.y + myscrollView.height/2+10;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        this.addChild(myscrollView);

        var background:egret.Shape = new egret.Shape();
        background.graphics.lineStyle(1,0x1102cc)
        background.graphics.drawRect(0,0,100,300);
        background.graphics.endFill();
        background.x = myscrollView.x;
        background.y = myscrollView.y;
        background.anchorOffsetX = background.width / 2;
        background.anchorOffsetY = background.height / 2;
        this.questionLayer.addChild(background);

        this.questionLayer.addChild(myscrollView);

        this.addChild(this.questionLayer);
    }

    private createInputAge(question: string){
        this.questionLayer.width = this.stageW;
        this.questionLayer.x = 0;

        let ques: egret.TextField = new egret.TextField();
        ques.text = question;
        ques.width = this.stageW - 20;
        ques.textColor = 0x000000;
        ques.size = 35;
        ques.bold = true;
        ques.x = 50;
        // ques.textAlign = egret.HorizontalAlign.CENTER;
        ques.y = 0;
        this.questionLayer.addChild(ques);

        var content: egret.Sprite = new egret.Sprite();
        content.width = 100;
        content.height = this.stageH;

        for(let i=18; i< 70; i++){
            let ageFile:egret.TextField = new egret.TextField();
            ageFile.text = i.toString()
            ageFile.width = content.width;
            ageFile.textColor = 0x000000;
            ageFile.size = 25;
            ageFile.y = (i-18) * 30;
            ageFile.x = 0;
            ageFile.touchEnabled = true;
            ageFile.textAlign = egret.HorizontalAlign.CENTER;
            let that = this;
            ageFile.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt:egret.TouchEvent) {
                that.choice1 = evt.target.text;
                that.couldGoOn = true;
                if(that.hasChoice1){
                    that.currentView1.textColor = 0x000000;
                    GameData.uploadMessage[GameData.uploadMessage.length-1][GameData.uploadMessage[GameData.uploadMessage.length-1].length-1] = parseInt(that.choice1);
                }
                else{
                    GameData.uploadMessage[GameData.uploadMessage.length-1].push(parseInt(that.choice1));
                }

                that.currentView1 = evt.target;

                that.hasChoice1 = true;
                that.currentView1.textColor = 0x228B22;
                console.log("选择了答案", that.choice1)
            }, content);
            content.addChild(ageFile);
        }
        // var content:egret.Sprite = this.createGird(50,50,9,9);

        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = 100;
        myscrollView.height = 300;
        myscrollView.x = this.stageW / 2;
        myscrollView.y = ques.y + myscrollView.height/2+10;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        this.addChild(myscrollView);

        var background:egret.Shape = new egret.Shape();
        background.graphics.lineStyle(1,0x1102cc)
        background.graphics.drawRect(0,0,100,300);
        background.graphics.endFill();
        background.x = myscrollView.x;
        background.y = myscrollView.y;
        background.anchorOffsetX = background.width / 2;
        background.anchorOffsetY = background.height / 2;
        this.questionLayer.addChild(background);

        this.questionLayer.addChild(myscrollView);


    }

    //创建格子函数，根据输入的宽和高来创建一个 row * line的格子图。并返回Shape对象。
    private createGird(w:number,h:number,row:number,line:number):egret.Shape {

        var shape:egret.Shape = new egret.Shape();
        for(var i = 0;i < row;i++ ) {
            for(var j = 0; j < line;j++) {
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
    }

    private createBackGroundImage(){
        var bg: egret.Shape = new egret.Shape();
        bg.graphics.clear();
        bg.graphics.beginFill(0xDCDCDC);
        bg.graphics.drawRect( 0, 0, this.stageW, this.stageH );
        bg.graphics.endFill();
        this.addChild(bg);
    }

    private createQuestionAndAnswers(quest: string, answe: Array<string>){
        let questionna: Questionnaire = new Questionnaire();
        questionna.addEventListener(Questionnaire.ACTION, this.onAction, this);
        questionna.setQuestionAnswers(quest, answe);
        this.questionLayer.addChild(questionna);

        this.couldGoOn = false;
    }
    private onAction(){
        this.couldGoOn = true;
    }
    private createButtonImage(){
        var beginB: egret.Bitmap = new egret.Bitmap();
        beginB.texture = RES.getRes("button_png");
        beginB.width = beginB.width / 2;
        beginB.height = beginB.height / 2;
        beginB.x = this.stageW / 2 - beginB.width / 2;
        beginB.y = this.stageH - beginB.height - 200;

        var textInButton: egret.TextField = new  egret.TextField();
        textInButton.text = "已完成，下一题"
        textInButton.width = beginB.width;
        textInButton.x = beginB.x;
        textInButton.size = 25;
        textInButton.y = beginB.y + (beginB.height/2 - textInButton.height/2)-5 ;
        textInButton.textAlign = egret.HorizontalAlign.CENTER;
        textInButton.textColor = 0x000000;

        this.addChild(beginB);
        this.addChild(textInButton);

        beginB.touchEnabled = true;
        beginB.addEventListener(egret.TouchEvent.TOUCH_TAP, this.beginButtonTap, this);
    }

    private beginButtonTap() {
        if(this.couldGoOn){
            this.progress = this.progress + 1;
            this.updateQuestion();
        }
        else{
            var makechoiceAttention: egret.TextField = new egret.TextField();
            makechoiceAttention.textAlign = egret.HorizontalAlign.CENTER;
            makechoiceAttention.text = "请先\"选择答案\"，再点击\"下一步\"";
            makechoiceAttention.textColor = 0xff0000;
            makechoiceAttention.width = this.stageW;
            makechoiceAttention.y = this.stageH - 400;

            this.addChild(makechoiceAttention);
            var that = this;
            egret.Tween.get(makechoiceAttention).to({alpha: 0.4}, 1000).call(
                ()=>{
                    that.removeChild(makechoiceAttention);
                }
            )
        }
    }

    private createWelcome(){
        var textF: egret.TextField = new egret.TextField();
        textF.text = "致谢";
        textF.width = this.stageW - 20;
        textF.textColor = 0x000000;
        textF.bold = true;
        textF.x = 10;
        textF.size = 40;
        textF.textAlign = egret.HorizontalAlign.CENTER;
        textF.y = 40;

        var textLittle: egret.TextField = new egret.TextField();
        textLittle.text = "感谢您参与IGA实验";
        textLittle.width = this.stageW - 20;
        textLittle.textColor = 0x000000;
        textLittle.size = 20;
        textLittle.bold = false;
        textLittle.x = 10;
        textLittle.textAlign = egret.HorizontalAlign.CENTER;
        textLittle.y = textF.y + 60;

        var show1: egret.TextField = new egret.TextField();
        show1.text = "请您接受实验人员的采访";
        show1.width = this.stageW ;
        show1.textColor = 0x000000;
        show1.size = 40;
        show1.bold = true;
        show1.textAlign = egret.HorizontalAlign.CENTER;
        show1.x = 0;
        show1.y = this.stageH / 2.5;


        this.addChild(textF);
        this.addChild(textLittle);
        this.addChild(show1);
    }

    private updateQuestion() {
        this.questionLayer.removeChildren();
        switch (this.progress){
            case 1:
                let answer0:Array<string> = ["A、每天一个小时以上", "B、每天一个小时以内", "C、每周玩几次", "D、偶尔玩", "E、几乎不玩"];
                let question0:string = "1、您玩微信小游戏的时长：";
                this.createQuestionAndAnswers(question0, answer0);
                break;
            case 2:
                this.couldGoOn = false;
                this.createInputAge("2、您的年龄:");
                break;
            case 3:
                let answer1:Array<string> = ["A、男", "B、女"];
                let question1:string = "3、您的性别：";
                this.createQuestionAndAnswers(question1, answer1);
                break;
            case 4:
                let answer2:Array<string> = ["A、博士", "B、研究生", "C、本科", "D、高中及以下", "E、其他"];
                let question2:string = "4、您的学业水平：";
                this.createQuestionAndAnswers(question2, answer2);
                break;
            default:
                break;
        }
        if(this.progress == 5){
            this.removeChildren();
            this.createBackGroundImage();

            var tshi: egret.TextField = new egret.TextField();
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
    }
    private createNextButtonImage(){
        this.button_img = new egret.Bitmap();
        this.button_img.texture = RES.getRes("button_png");
        this.button_img.width = this.button_img.width / 2;
        this.button_img.height = this.button_img.height / 2;
        this.button_img.x = this.stageW / 2 - this.button_img.width / 2;
        this.button_img.y = this.stageH - this.button_img.height - 120;


        this.button_txt = new egret.TextField();
        this.button_txt.text = "发送数据"
        this.button_txt.width = this.button_img.width;
        this.button_txt.x = this.button_img.x;
        this.button_txt.size = 25;
        this.button_txt.y = this.button_img.y + (this.button_img.height/2 - this.button_txt.height/2)-5 ;
        this.button_txt.textAlign = egret.HorizontalAlign.CENTER;
        this.button_txt.textColor = 0x000000;

        this.addChild(this.button_img);
        this.addChild(this.button_txt);

        this.button_img.touchEnabled = true;
        this.button_img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sendToserver, this);
    }
    private sendToserver(){

        this.createBackGroundImage();
        var dataProcess = new DataProcess();
        this.addChild(dataProcess);

        var value = GameData.uploadMessage; //[[],[1,2,],[...]]
        //console.log("上传前最后一步：", SceneMange.uploadMessage);
        var sendvalue = "";
        var paraName = ["p1", "g1", "g2", "g3", "g4", "g5", "g6", "q1","q2","q3"]
        var index = 0;
        for(let x of value){
            var str = "";
            for(let y of x){
                str = str + y.toString() + " ";
            }
            if(sendvalue == ""){
                sendvalue = paraName[index]+"="+str;
            }else{
                sendvalue = sendvalue + "&"+paraName[index]+"="+str;
            }
            index = index + 1;
        }
        this.removeChild(this.button_img);
        this.removeChild(this.button_txt);
        var request = new egret.HttpRequest();
        request.withCredentials = true;
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("//icontinua.com/ftf/minigame/sendData2",egret.HttpMethod.POST);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send(sendvalue);
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }

    private sendToRank(){
        var sendvalue = "name="+GameData.uploadUser["names"]+"&fullscore="+GameData.uploadUser["fullscore"]+"&maxscore="+GameData.uploadUser["maxscore"];
        var request = new egret.HttpRequest();
        request.withCredentials = true;
        request.responseType = egret.HttpResponseType.TEXT;
        request.open("//icontinua.com/ftf/minigame/saveRank2",egret.HttpMethod.POST);
        request.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        request.send(sendvalue);
        request.addEventListener(egret.Event.COMPLETE,this.onGetComplete2,this);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
        request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
    }
    private onGetComplete(event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data : ",request.response);
        if(!this.responseLabel){
            this.responseLabel = new egret.TextField();
        }

        this.responseLabel.size = 18;
        this.responseLabel.text = "GET response: \n" + request.response.substring(0, 50) + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;

        this.sendToRank();
        // SceneMange.getInstance().changeScene("endScene");
    }
    private onGetComplete2(event:egret.Event):void {
        var request = <egret.HttpRequest>event.currentTarget;
        console.log("get data : ",request.response);
        if(!this.responseLabel){
            this.responseLabel = new egret.TextField();
        }

        this.responseLabel.size = 18;
        this.responseLabel.text = "GET response: \n" + request.response + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 170;
    }
    private onGetIOError(event:egret.IOErrorEvent):void {
        console.log(event);
        if(!this.responseLabel){
            this.responseLabel = new egret.TextField();
        }

        this.responseLabel.size = 18;
        this.responseLabel.text = event.data.toString() + "...";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
        // SceneMange.getInstance().changeScene("endScene");
    }
    private onGetProgress(event:egret.ProgressEvent):void {
        console.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
        // SceneMange.getInstance().changeScene("endScene");
        if(!this.responseLabel){
            this.responseLabel = new egret.TextField();
        }

        this.responseLabel.size = 18;
        this.responseLabel.text = Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%";
        this.addChild(this.responseLabel);
        this.responseLabel.x = 50;
        this.responseLabel.y = 70;
    }
}
/** 分数排行 */
class Rank extends egret.Sprite{

    private stageH: number=0;
    private stageW: number=0;
    private lastIndex: number=-1;
    public static instance: Rank;
    public constructor(){
        super();

        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.lastIndex = -1;
    }

    public static getInstance():Rank {
        if(!Rank.instance){
            Rank.instance = new Rank();
        }
        return Rank.instance;
    }

    private sortRankList(): Array<object>{

        function compare(property, propery2){
            return function(obj1,obj2){
                var value1 = obj1[property];
                var value2 = obj2[property];

                var value3 = obj1[propery2];
                var value4 = obj2[propery2]
                if(value1==value2){
                    return -(value3-value4);
                }
                return -(value1 - value2);     // 升序
            }
        }

        var list = [];
        list.push(GameData.uploadUser);
        list = list.concat(GameData.RankList);
        list = list.sort(compare("fullscore","maxscore"));
        return list;
    }
    private createTextFiled(text: string, width: number, height:number, y: number=0, x:number=0, txtSize: number=30,center: boolean=true, color: number = 0xffffff): egret.TextField{
        let txt:egret.TextField = new egret.TextField();
        txt.text = text;
        txt.width = width;
        txt.height = height;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        if(center){
            txt.textAlign = egret.HorizontalAlign.CENTER;
        }

        txt.bold = true;
        txt.textColor = color;
        txt.size = txtSize;
        txt.y = y;
        txt.x = x;
        return txt;
    }
    private createTextFlow(text: Array<egret.ITextElement>, width: number, height:number, y: number=0, x:number=0, txtSize: number=30,center: boolean=true, color: number = 0xffffff): egret.TextField{
        let txt:egret.TextField = new egret.TextField();
        txt.width = width;
        txt.height = height;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        if(center){
            txt.textAlign = egret.HorizontalAlign.CENTER;
        }
        txt.textFlow = text;
        txt.bold = true;
        txt.textColor = color;
        txt.size = txtSize;
        txt.y = y;
        txt.x = x;
        return txt;

    }
    private createRankList(rankList, index:number):egret.Sprite {
        var content: egret.Sprite = new egret.Sprite();
        // 先排序；

        for(let i=1; i <= rankList.length; i++){
            let backgroud: egret.Shape = new egret.Shape();
            backgroud.graphics.clear();
            if(i == index){
                backgroud.graphics.beginFill(0xCDAF95, 1);
            }
            else if(i%2==0){
                backgroud.graphics.beginFill(0x404a54, 1);
            }else{
                backgroud.graphics.beginFill(0x36404a, 1);
            }

            backgroud.graphics.drawRect( 0, (i-1)*this.stageH/15, this.stageW-40, this.stageH/15 );
            backgroud.graphics.endFill();

            let ageFile:egret.TextField = this.createTextFiled(i.toString(),backgroud.width/5, backgroud.height, (i-1) * this.stageH/15);
            switch(i){
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
                    ageFile.textColor =  0xd3d1cf;
                    break;
            }
            if(i == index){
                var up:number = 0;

                if(this.lastIndex == -1){
                    up = rankList.length - index;
                }else {
                    up = this.lastIndex - index;
                }
                this.lastIndex = index;
                if(up>0){
                    var textFlow =  <Array<egret.ITextElement>>[
                        {text: rankList[i-1]["names"]}
                        , {text: " ↑"+up.toString(), style: {"fontFamily": "微软雅黑", "textColor": 0x00FF00, "bold":true}}
                    ];
                }else if(up<0){
                    var textFlow =  <Array<egret.ITextElement>>[
                        {text: rankList[i-1]["names"]}
                        , {text: " ↓"+(-1*up).toString(), style: {"fontFamily": "微软雅黑", "textColor": 0xFF0000,"bold":true}}
                    ];
                }else{
                    var textFlow =  <Array<egret.ITextElement>>[
                        {text: rankList[i-1]["names"]}
                        , {text: " - ", style: {"fontFamily": "微软雅黑", "textColor": 0x0000ff,"bold":true}}
                    ];
                }

                var name:egret.TextField = this.createTextFlow(textFlow,backgroud.width*1.7/5, backgroud.height, (i-1)*this.stageH/15, ageFile.x+ageFile.width,30,false);
            }else {
                var name:egret.TextField = this.createTextFiled(rankList[i-1]["names"],backgroud.width*1.7/5, backgroud.height, (i-1)*this.stageH/15, ageFile.x+ageFile.width,30,false);
            }
            let fullScore:egret.TextField = this.createTextFiled(rankList[i-1]["fullscore"],backgroud.width*1.15/5, backgroud.height, (i-1)*this.stageH/15, name.x+name.width);
            let maxScore: egret.TextField = this.createTextFiled(rankList[i-1]["maxscore"],backgroud.width*1.15/5, backgroud.height, (i-1)*this.stageH/15, fullScore.x+fullScore.width);

            content.addChild(backgroud);
            content.addChild(ageFile);
            content.addChild(name);
            content.addChild(fullScore);
            content.addChild(maxScore);
        }
        return content;
    }
    public RankList(){
        this.removeChildren();
        var rankList = this.sortRankList();
        let index = rankList.indexOf(GameData.uploadUser) + 1;
        console.log(rankList)
        var content:egret.Sprite = this.createRankList(rankList, index);
        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = this.stageW-40;
        myscrollView.height = this.stageH/2.7;
        myscrollView.x = this.stageW/2;
        myscrollView.y = this.stageH/2+60;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;

        myscrollView.setScrollTop(this.stageH/15*(index-3));

        //垂直滚动设置为 on
        myscrollView.verticalScrollPolicy = "on";
        //水平滚动设置为 auto
        myscrollView.horizontalScrollPolicy = "off";
        // console.log(this.EndSprite)

        let y = myscrollView.y-myscrollView.height/2-this.stageH/15;
        this.createSigleLine(y,"排名","昵称","总分","单局最高分",25);

        let y2 = myscrollView.y+myscrollView.height/2+25;


        // this.createSigleLine(y2,index.toString(),SceneMange.uploadUser["names"],SceneMange.uploadUser["fullscore"].toString(),SceneMange.uploadUser["maxscore"].toString(),30);

        this.addChild(myscrollView);
        let y_title = y - 80;
        this.Ranktitle(y_title);
    }
    private createSigleLine(y:number, rank:string, names:string, score:string, maxscore:string, txtSize:number){
        var backgroud: egret.Shape = new egret.Shape();
        backgroud.graphics.clear();

        backgroud.graphics.beginFill(0x404a54, 1);
        backgroud.graphics.drawRect( 20, y, this.stageW-40, this.stageH/15 );
        backgroud.graphics.endFill();

        let ageFile:egret.TextField = this.createTextFiled(rank,backgroud.width/5, backgroud.height, y, backgroud.x+10, txtSize);
        switch(rank){
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
                ageFile.textColor =  0xd3d1cf;
                break;
        }

        let name:egret.TextField = this.createTextFiled(names,backgroud.width*1.7/5, backgroud.height, y,ageFile.x+ageFile.width,txtSize, false);
        let fullScore:egret.TextField = this.createTextFiled(score,backgroud.width*1.15/5, backgroud.height, y, name.x+name.width,txtSize);
        let maxScore: egret.TextField = this.createTextFiled(maxscore,backgroud.width*1.15/5, backgroud.height, y,fullScore.x+fullScore.width,txtSize);

        this.addChild(backgroud);
        this.addChild(ageFile);
        this.addChild(name);
        this.addChild(fullScore);
        this.addChild(maxScore);
    }

    private Ranktitle(y:number){
        var label: egret.TextField = new egret.TextField();
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
    }
}

/**分数排行*/
class GameRank extends moon.BasicGameRank{
	public updateScore():void
	{
		platform.getRank(this.update,this);
	}
	/**查看排行榜返回函数 */
	public update(obj){
		console.log("代码:" + obj.code + ",消息:" + obj.message + ",数据:" + obj.data);
		var _this=GamePanel.rank;
		if(obj.code == 10000){
			console.log("获取成功");
			var data = obj.data;
			var len:number=data.length;
			var myRank:number=-1;
			for(var i=0;i<len;i++){
				//this.txtRank.text+=("积分:" + data[i].score + ",排名:" + data[i].rank+"\n");
				var score=data[i].score;
				console.log(i,score,_this.max);
				if(i<_this.max){
                    var item:moon.RankItem=_this.items[i];
                    item.txtScore.text=score;
					console.log("item",item.txtScore.text,score);
                }
				 if(i<len-1){
					var next:number=Number(data[i+1].score);
					score=Number(score);
					console.log(GameData.score,next,score);
					if(GameData.score==score){//刚好等于排行分数
						myRank=i+1;
					}else if(GameData.score>next&&GameData.score<=score){//在排行榜之前
						myRank=i+2;
					}else if(GameData.score>=data[0].score){//大于等于第1名时
						myRank=1;
					}else if(GameData.score<=data[len-1].score){//小于等于最后一名时
						myRank=len;
					}
				}
			}
			if(_this.txtRank){
				if(myRank>0) _this.txtRank.text="你本次得"+GameData.score+"分，排在第"+myRank+"名。";
            	else         _this.txtRank.text="未上榜";
			}
		} else{
			console.log("获取失败");
		}
	}
}
/** 数据分析处理 */
class DataProcess extends egret.Sprite{
    private stageH: number;
    private stageW: number;

    public constructor(){
        super();
        this.stageH = egret.MainContext.instance.stage.stageHeight;
        this.stageW = egret.MainContext.instance.stage.stageWidth;
        this.createLine();
    }

    public createLine(){
        var rankList = GameData.uploadMessage.concat();
        var content:egret.Sprite = this.createRankList(rankList);
        var myscrollView:egret.ScrollView = new egret.ScrollView();
        myscrollView.setContent(content);
        myscrollView.width = this.stageW;
        myscrollView.height = this.stageH/2;
        myscrollView.x = this.stageW/2;
        myscrollView.y = this.stageH/2+60;
        myscrollView.anchorOffsetX = myscrollView.width / 2;
        myscrollView.anchorOffsetY = myscrollView.height / 2;
        //垂直滚动设置为 on
        myscrollView.verticalScrollPolicy = "on";
        //水平滚动设置为 auto
        myscrollView.horizontalScrollPolicy = "off";
        this.addChild(myscrollView);
    }
    private createTextFiled(text: string, width: number, height:number, y: number=0, x:number=0, txtSize: number=30,center: boolean=true, color: number = 0xffffff): egret.TextField{
        let txt:egret.TextField = new egret.TextField();
        txt.text = text;
        txt.width = width;
        txt.height = height;
        txt.verticalAlign = egret.VerticalAlign.MIDDLE;
        if(center){
            txt.textAlign = egret.HorizontalAlign.CENTER;
        }

        txt.bold = true;
        txt.textColor = color;
        txt.size = txtSize;
        txt.y = y;
        txt.x = x;
        return txt;
    }

    // 返回正确答案, sigle是游戏中出现的广告，question是问题中出现的广告，返回结果为问题对应的答案
    private resultSingleJudge(sigle: Array<number>, question: Array<number>){
        var success: Array<number> = [0,0,0,0,0,0];
        for(let i=0; i<question.length; i++){
            if(sigle.indexOf(question[i])>=0){
                success[i] = 1;
            }
        }
        return success;
    }

    private resultJudgeRightFalse(uploadMessage:Array<number>){
        var result = [0,0]; //[出现的正确次数；未出现的正确次数]

        var sigle = uploadMessage.slice(1,4);
        if(uploadMessage[0] == 2 || uploadMessage[0] == 4){   //激励性视频广告
            sigle = uploadMessage.slice(1,1+uploadMessage[11]);
        }

        var question = uploadMessage.slice(4, 10);
        var answer = this.resultSingleJudge(sigle, question);  // 正确答案
        var answer_user = uploadMessage.slice(15,21);       // 玩家选择的答案

        for(var i=0; i<answer.length; i++){
            if(answer[i] == answer_user[i]){
                if(answer[i] == 1){
                    result[0]++;
                }else{
                    result[1]++;
                }
            }
        }
        return ""+result[0]+" / "+""+result[1];
    }
    private resultRightFalse(uploadMessage:Array<number>){
        var result = [0,0]; //[出现的正确次数；未出现的正确次数]

        var sigle = uploadMessage.slice(1,4);
        if(uploadMessage[0] == 2 || uploadMessage[0] == 4){   //激励性视频广告
            sigle = uploadMessage.slice(1,1+uploadMessage[11]);
        }

        var question = uploadMessage.slice(4, 10);
        var answer = this.resultSingleJudge(sigle, question);  // 正确答案
        var answer_user = uploadMessage.slice(15,21);       // 玩家选择的答案

        var pass_answer = answer.join("");
        var pass_answer_user = answer_user.join("");
        return pass_answer+" / "+pass_answer_user;
    }

    private createRankList(rankList):egret.Sprite {
        var content: egret.Sprite = new egret.Sprite();
        // 先排序；

        for(let i=1; i < rankList.length-1; i++){
            let backgroud: egret.Shape = new egret.Shape();
            backgroud.graphics.clear();
            backgroud.graphics.beginFill(0x36404a, 1);

            backgroud.graphics.drawRect( 0, (i-1)*this.stageH/15, this.stageW-40, this.stageH/15 );
            backgroud.graphics.endFill();

            let ageFile:egret.TextField = this.createTextFiled(rankList[i][0]+"",backgroud.width/7, backgroud.height, (i-1) * this.stageH/15);

            ageFile.textColor = 0xda5907;


            var name:egret.TextField = this.createTextFiled(rankList[i][21]+"",backgroud.width*1/7, backgroud.height, (i-1)*this.stageH/15, ageFile.x+ageFile.width,30,false);

            let fullScore:egret.TextField = this.createTextFiled(rankList[i][22]+"",backgroud.width*1/7, backgroud.height, (i-1)*this.stageH/15, name.x+name.width);
            let maxScore: egret.TextField = this.createTextFiled(this.resultJudgeRightFalse(rankList[i]),backgroud.width*1/7, backgroud.height, (i-1)*this.stageH/15, fullScore.x+fullScore.width);
            let testScore: egret.TextField = this.createTextFiled(this.resultRightFalse(rankList[i]),backgroud.width*3/7, backgroud.height, (i-1)*this.stageH/15, maxScore.x+maxScore.width);

            content.addChild(backgroud);
            content.addChild(ageFile);
            content.addChild(name);
            content.addChild(fullScore);
            content.addChild(maxScore);
            content.addChild(testScore);
        }
        return content;
    }
}
/**分数设置*/
class GameSet extends moon.BasicGameSet{

}