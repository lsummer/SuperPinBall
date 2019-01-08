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
var Popup = AdverType.Popup;
var AwardVideo = AdverType.AwardVideo;
var MUSIC_CLICK_BTN = "click_mp3";
var MUSIC_HIT = "hit_mp3";
var MUSIC_ADDNUM = "addNum_mp3";
var MUSIC_FIRE = "fire_mp3";
var MUSIC_FLOOR = "floor_mp3";
var MUSIC_BG = "background_mp3";
var EVENT_FIRE = "event fire";
var EVENT_REMOVE = "event remove";
var TYPE_HAND = "type hand";
var ICON_ADD = "addIcon_png";
var SHAPE = { rect: "rect", circle: "circle" }; //形状
var OVER_DIS = 200;
var GameFrame = (function (_super) {
    __extends(GameFrame, _super);
    function GameFrame() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameFrame.prototype.render = function () {
    };
    GameFrame.prototype.initView = function () {
        //需要复写
        this.width = this.stageHeight;
        this.height = this.stageWidth;
        this.addChild(new MImage("bg_jpg"));
    };
    return GameFrame;
}(moon.BasicGamePanel));
__reflect(GameFrame.prototype, "GameFrame");
var GameControl = (function (_super) {
    __extends(GameControl, _super);
    function GameControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.names = []; //数字刚体皮肤名字
        _this.removeSkins = []; //需要删除刚体的皮肤
        _this.moveNum = 0; //数字刚体可移动次数
        _this.ballNum = 0; //发球数量
        _this.minBodyCount = 1; //数字刚体的最少数值
        _this.adver_names = []; //数字刚体皮肤名字-广告
        _this.pop_adver_type = false;
        _this.box_adver_type = false;
        _this.bg_adver_type = false;
        _this.popup_flag = false; //广告是否已添加popup数字刚体的标签
        _this.popup_hit = false;
        _this.pop_index = 0;
        _this.pop_adver_name = [];
        return _this;
    }
    GameControl.prototype.render = function () {
        _super.prototype.render.call(this);
        this.mainframe = new GameFrame();
        this.mainframe.width = this.stageWidth;
        this.mainframe.height = this.stageHeight;
        this.mainframe.touchEnabled = true;
        // trace("v1.1");
        GameData.stageHeight = this.stageHeight;
        GameData.stageWidth = this.stageWidth;
        SoundControl.getIns().addItem(MUSIC_HIT);
        SoundControl.getIns().addItem(MUSIC_ADDNUM);
        SoundControl.getIns().addItem(MUSIC_FIRE);
        SoundControl.getIns().addItem(MUSIC_FLOOR);
        SoundControl.getIns().addItem(MUSIC_BG, true);
        // this.createImageBg();
        var world = new P2World(0, 200);
        var walls = world.createWall(new egret.Rectangle(0, 0, GameData.stageWidth, GameData.stageHeight));
        this.addChild(this.mainframe);
        this.mainframe.addChild(new MImage("bg_jpg"));
        this.mainframe.addChild(world);
        this.world = world;
        this.world.touchEnabled = true;
        world.loopBackFun = this.loopP2World.bind(this);
        for (var i = 0; i < walls.length; i++) {
            var body = walls[i];
            body.userData["floor"] = true;
            this.setAndBallHit(body);
        }
        this.material = new p2.Material();
        for (var i = 1; i <= 3; i++) {
            var name1 = "rect" + i + "_png";
            var name2 = "circle" + i + "_png";
            this.names.push(name1, name2, name1, name2);
        }
        this.names.push(ICON_ADD);
        //  for(var i:number=1;i<=30;i++){
        //      this.names.push("rect1_png");
        //  }
        //var ball=this.createBall();
        //ball.position=[300,100];
        //创建左右刚体
        var left = this.createBody("left_png");
        var right = this.createBody("right_png");
        left.userData["pipe"] = true;
        right.userData["pipe"] = true;
        var pipeHight = left.userData.skin.height / 2;
        var pipeY = this.setBottom(pipeHight, 100);
        left.position = [25, pipeY];
        right.position = [this.getRight(25), pipeY];
        //this.setMaterial(ball,left);
        //this.setMaterial(ball,right);
        //创建顶部刚体
        // var top1=this.createBody("top2_png");
        // var top2=this.createBody("top1_png");
        // var top3=this.createBody("top2_png");
        // top1.position[1]=top2.position[1]=top3.position[1]=-100;
        // top1.position[0]=88;
        // top2.position[0]=319;
        // top3.position[0]=549;
        var top = this.createBody("topLine_png");
        top.position = [GameData.stageWidth >> 1, 0];
        //创建炮
        var gun = new Gun;
        gun.addEvent(EVENT_FIRE, this.onFire, this);
        this.mainframe.addChild(gun);
        this.gun = gun;
        gun.x = this.getCenterX(0);
        gun.y = 100;
        this.createBottom();
        this.container = new Sprite;
        this.mainframe.addChild(this.container);
        var conMask = moon.MoonUI.getRect(GameData.stageWidth, GameData.stageHeight - 200, 0, 0, 160);
        this.container.mask = conMask;
        var controlGun = new control.ControlBasic(this.mainframe);
        //controlGun.open();
        controlGun.startBackFun = this.startBackFun.bind(this);
        controlGun.moveBackFun = this.controlMove.bind(this);
        controlGun.endBackFun = this.endBackFun.bind(this);
        this.controlGun = controlGun;
        world.p2World.on("beginContact", this.onHitBegin.bind(this));
        //world.p2World.on("impact",this.onHitImpact.bind(this));
        //world.p2World.on("postStep",this.onHitImpact.bind(this));
        this.txtScore = this.createText(50, 50);
        //this.txtScore.textColor=0;
        this.txtLevel = this.createText(200, 200);
        //this.initGame();
        this.txtBlood = this.createText(50, 100);
    };
    GameControl.prototype.testZero = function () {
        for (var i = 0; i < 6; i++) {
            var body1 = this.createBody("rect1_png");
            body1.userData["num"] = true;
            var skin = body1.userData.skin;
            skin.initNum(100);
            body1.angle = 45;
            body1.position = [100 + i * 100, 500];
        }
        var ball = this.createBall();
        ball.mass = 100;
        ball.position = [240, 400];
    };
    GameControl.prototype.initView = function () {
        //需要复写
    };
    GameControl.prototype.initGame = function () {
        var _this = this;
        this.score = 0;
        this.level = 0;
        this.ballNum = 0;
        this.moveNum = 0;
        this.blood = GameData.BLOOD;
        this.gun.restart();
        this.updateScore();
        this.updateBlood();
        this.controlGun.open();
        this.popup_flag = false;
        this.popup_hit = false;
        this.adver_names = [];
        this.bg_adver_type = false;
        this.pop_adver_type = false;
        this.box_adver_type = false;
        this.pop_index = 0;
        this.pop_adver_name = [];
        SoundControl.getIns().play(MUSIC_BG, 0, 9999);
        GameData.uploadMessage.push([]);
        GameData.adver_sum = 0;
        GameData.video_tap = [-1, -1, -1];
        GameData.uploadMessage[GameData.uploadMessage.length - 1].push(GameData.gameType[GameData.gameIndex]); //0-游戏类型
        if (GameData.gameType[GameData.gameIndex] == 0) {
            console.log("无广告");
            GameData.uploadMessage[GameData.uploadMessage.length - 1].push(-1);
            GameData.uploadMessage[GameData.uploadMessage.length - 1].push(-1);
            GameData.uploadMessage[GameData.uploadMessage.length - 1].push(-1);
        }
        // 在这里判断广告类型，并进行添加广告
        var adver_setting = moon.GAMETYPE.gameSceneSetting[GameData.gameType[GameData.gameIndex]];
        console.log(adver_setting);
        if (adver_setting["banner"]) {
            // 添加banner广告
            this.banner_adver = new AdverType.bannerAdver();
            this.banner_adver.y = this.stageHeight - this.banner_adver.height;
            this.addChild(this.banner_adver);
        }
        if (adver_setting["popUp"]) {
            // 添加弹出式广告
            this.pop_adver_type = true;
            this.adver_names = ["ads_type_png"];
            this.pop_adver_name = AdverType.adverName.selectPopUp("popup");
            for (var _i = 0, _a = this.pop_adver_name; _i < _a.length; _i++) {
                var x = _a[_i];
                GameData.uploadMessage[GameData.uploadMessage.length - 1].push(AdverType.adverName.popup_name.indexOf(x));
                console.log(AdverType.adverName.popup_name.indexOf(x));
                console.log("push popup 广告出现", this.pop_adver_name, GameData.uploadMessage);
            }
        }
        if (adver_setting["backgroud"]) {
            // 添加背景广告
            this.bg_adver_type = true;
            this.bg = new AdverType.bgAdver(this.blood);
            this.mainframe.addChild(this.bg);
            this.mainframe.setChildIndex(this.bg, 1);
            this.bg.x = this.stageWidth / 2 - this.bg.width / 2;
            this.bg.y = this.stageHeight / 5;
        }
        if (adver_setting["award"]) {
            // 添加视频广告
            this.video_adver = new AdverType.AwardVideo();
            var that = this;
            this.video_adver.addEventListener(Popup.GUNOPEN, function () {
                // TODO 生命值加2
                that.bloodAdd(2);
            }, this);
            this.video_adver.addEventListener(AwardVideo.TAP_VIDEO, function () {
                GameData.video_tap[GameData.adver_sum - 1] = _this.blood;
            }, this);
            this.video_adver.touchEnabled = true;
            this.addChild(this.video_adver);
            this.setChildIndex(this.video_adver, 100);
        }
        if (adver_setting["specialBox"]) {
            // 添加盒子广告
            this.box_adver_type = true;
            this.adver_names = AdverType.adverName.selectPopUp("box");
            for (var _b = 0, _c = this.adver_names; _b < _c.length; _b++) {
                var x = _c[_b];
                GameData.uploadMessage[GameData.uploadMessage.length - 1].push(AdverType.adverName.box_name.indexOf(x));
                console.log("push box 广告出现", this.adver_names, GameData.uploadMessage);
            }
        }
        GameData.questionList = AdverType.adverName.GetQuestionList(GameData.uploadMessage[GameData.uploadMessage.length - 1].slice(1, 4)); //调换问题顺序
        GameData.uploadMessage[GameData.uploadMessage.length - 1] = GameData.uploadMessage[GameData.uploadMessage.length - 1].concat(GameData.questionList['num'].slice(0, 6));
        console.log("问题顺序之后的SceneManager：", GameData.uploadMessage);
    };
    GameControl.prototype.bloodAdd = function (scoreAdd) {
        var fire = new egret.Bitmap();
        fire.texture = RES.getRes("fire_png");
        var width = fire.width;
        var height = fire.height;
        fire.width = this.stageWidth * 2 / 3;
        fire.height = height * fire.width / width;
        fire.x = this.stageWidth / 2;
        fire.y = this.stageHeight / 5;
        fire.anchorOffsetX = fire.width / 2;
        fire.anchorOffsetY = fire.height / 2;
        fire.scaleX = 0.3;
        fire.scaleY = 0.3;
        this.addChild(fire);
        var add10 = new egret.TextField();
        add10.text = "发射次数 + " + scoreAdd.toString() + " ";
        add10.textColor = 0xff0000;
        add10.size = 40;
        add10.bold = true;
        add10.width = this.stageWidth;
        add10.textAlign = egret.HorizontalAlign.CENTER;
        add10.y = fire.y - add10.height / 2;
        this.addChild(add10);
        //  播放音乐
        SoundControl.getIns().play(MUSIC_ADDNUM);
        var that = this;
        egret.Tween.get(fire).to({ scaleX: 1.3, scaleY: 1.3 }, 500).call(function () {
            that.removeChild(fire);
            egret.Tween.get(add10).to({ alpha: 0.2 }, 500).call(function () {
                that.removeChild(add10);
                that.blood = that.blood + scoreAdd;
                that.txtBlood.text = "发射次数:" + that.blood.toString();
            });
        });
    };
    /**复活 */
    GameControl.prototype.revive = function () {
        this.moveNum = 0;
        this.ballNum = 0;
        this.play();
        this.controlGun.open();
    };
    GameControl.prototype.setBottom = function (height, distance) {
        return GameData.stageHeight - height - distance;
    };
    GameControl.prototype.moveNumBody = function () {
        var _this = this;
        var bodys = this.world.p2World.bodies;
        var l = bodys.length;
        for (var i = 0; i < l; i++) {
            var body = bodys[i];
            if (body.userData && body.userData.skin) {
                if (body.userData["num"]) {
                    body.position[1] -= 10;
                    if (body.position[1] <= OVER_DIS) {
                        if (body.userData.skin.imageName != ICON_ADD) {
                            this.over();
                            return;
                        }
                    }
                }
            }
        }
        if (this.moveNum < 7) {
            this.moveNum++;
            setTimeout(this.moveNumBody.bind(this), 50);
        }
        else {
            this.moveNum = 0;
            this.controlGun.open();
            // TODO 移动结束
            if (this.popup_hit) {
                this.popup_hit = false;
                this.popup_flag = false;
                this.controlGun.close(); // 关闭枪
                var popup = new AdverType.Popup(this.pop_adver_name[(this.pop_index++) % 3]);
                this.addChild(popup);
                var that_1 = this;
                popup.addEventListener(Popup.GUNOPEN, function () {
                    that_1.controlGun.open();
                    that_1.bloodAdd(1);
                    GameData.adver_sum++; // 表示触发了几次
                    // 生命值+1
                    // that.blood--;
                    // that.updateBlood();
                    if (_this.blood == 0) {
                        _this.over();
                    }
                }, this);
            }
            else {
                // this.blood--;
                // this.updateBlood();
                if (this.blood == 0) {
                    this.over();
                }
            }
            if (this.bg_adver_type) {
                GameData.adver_sum = this.bg.updateBG(this.blood);
            }
        }
    };
    GameControl.prototype.over = function () {
        _super.prototype.over.call(this);
        SoundControl.getIns().stop(MUSIC_BG);
        this.controlGun.close();
        if (this.bg && this.mainframe.getChildIndex(this.bg) >= 0) {
            this.mainframe.removeChild(this.bg);
        }
        if (this.banner_adver && this.contains(this.banner_adver)) {
            this.banner_adver.stopBanner();
            this.removeChild(this.banner_adver);
            this.banner_adver = null;
        }
        if (this.video_adver && this.contains(this.video_adver)) {
            this.removeChild(this.video_adver);
        }
        var bodys = this.world.p2World.bodies;
        for (var i = 0; i < bodys.length; i++) {
            var body = bodys[i];
            if (body.userData && body.userData.skin) {
                if (body.userData["num"]) {
                    var skin = body.userData.skin;
                    this.world.removeBodys.push(body);
                    skin.removeFromParent(true);
                }
            }
        }
    };
    GameControl.prototype.updateNumBody = function () {
        var c = 0;
        for (var i = 0; i < 5; i++) {
            if (Math.random() < 0.7) {
                c++;
                var xNum = 5;
                var dis = 100;
                var body = this.createNumBody();
                //body.position=[80*i,300+10*i];
                var x = 120 + Math.floor(i % xNum) * dis;
                var y = 1000 + Math.floor(i / xNum) * dis;
                body.position = [x, y];
                body.angle = (-Math.random() * Math.PI / 4) + (Math.random() * Math.PI / 4);
                body.userData["num"] = true;
                var skin = body.userData.skin;
                var num = Math.ceil(Math.random() * (this.level + 5));
                num = num + this.minBodyCount + this.level;
                skin.initNum(num);
                this.container.addChild(skin);
                //this.setMaterial(ball,body);
            }
        }
        console.log("numbody的随机个数=" + c);
        if (c == 0) {
            this.updateNumBody();
        }
        else {
            this.moveNumBody();
        }
    };
    GameControl.prototype.onHitImpact = function (evt) {
        var ball;
        if (evt.bodyA.userData && evt.bodyB.userData) {
            if (evt.bodyA.userData["ball"])
                ball = evt.bodyA;
            if (evt.bodyB.userData["ball"])
                ball = evt.bodyB;
            //与数字刚体
            if (evt.bodyA.userData["ball"] && evt.bodyB.userData["num"] || evt.bodyB.userData["ball"] && evt.bodyA.userData["num"]) {
                var vec = new Point(ball.velocity[0], ball.velocity[1]);
                var vecnum = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
                console.log(vecnum);
                if (vecnum < 50) {
                    this.setBallImpulse(ball);
                }
            }
        }
    };
    GameControl.prototype.onHitBegin = function (evt) {
        var ball;
        if (evt.bodyA.userData["ball"])
            ball = evt.bodyA;
        if (evt.bodyB.userData["ball"])
            ball = evt.bodyB;
        if (ball && ball.mass == 0) {
            ball.userData["setImpulse"] = true; //可以设置给小球冲量
            ball.mass = 200;
        }
        //与两边水管碰撞
        if (evt.bodyA.userData["ball"] && evt.bodyB.userData["pipe"] || evt.bodyB.userData["ball"] && evt.bodyA.userData["pipe"]) {
            if (ball.userData["setImpulse"]) {
                ball.applyImpulse([this.vec.x * 2, 0], [0, 0]);
                ball.userData["setImpulse"] = false;
            }
        }
        else {
            if (ball && ball.userData["setImpulse"]) {
                ball.applyImpulse([this.vec.x * 1.5, this.vec.y], [0, 0]);
                ball.userData["setImpulse"] = false;
            }
            var numBody;
            if (evt.bodyA.userData["num"])
                numBody = evt.bodyA;
            if (evt.bodyB.userData["num"])
                numBody = evt.bodyB;
            if (numBody) {
                this.score++;
                this.updateScore();
                var skin = numBody.userData.skin;
                Tween.get(skin).to({ y: skin.y + 2 }, 100).to({ y: skin.y - 2 }, 100);
                skin.update();
                if (skin.value == 0) {
                    if (skin.imageName == ICON_ADD) {
                        this.gun.bulletMax++;
                        this.ballNum++;
                        this.createNewBall(ball);
                    }
                    else if (skin.imageName == "ads_type_png") {
                        // TODO: 弹出来广告
                        this.popup_hit = true;
                    }
                    this.world.removeBodys.push(numBody);
                    skin.removeFromParent(true);
                }
                else {
                    var vec = new Point(ball.velocity[0], ball.velocity[1]);
                    var vecnum = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
                    console.log(vecnum);
                    if (vecnum < 200) {
                        this.setBallImpulse(ball);
                    }
                }
            }
        }
        //与地板碰撞
        if (evt.bodyA.userData["ball"] && evt.bodyB.userData["floor"] || evt.bodyB.userData["ball"] && evt.bodyA.userData["floor"]) {
            //ball.userData["remove"]=true;
            this.removeSkins.push(ball.userData.skin);
            this.world.removeBodys.push(ball);
        }
    };
    GameControl.prototype.setBallImpulse = function (ball) {
        var x = Math.random() > 0.5 ? -5000 : 5000;
        var y = -5000 - (Math.random() * 2000);
        ball.applyImpulse([x, y], [0, 0]);
    };
    GameControl.prototype.updateScore = function () {
        this.txtScore.text = "分数:" + this.score;
        if (this.score % 50 == 0) {
            this.level++;
        }
    };
    GameControl.prototype.updateBlood = function () {
        this.txtBlood.text = "发射次数:" + this.blood;
    };
    GameControl.prototype.startBackFun = function (pos) {
        this.gun.showLine();
        this.controlGun.close();
        this.controlMove(pos);
    };
    GameControl.prototype.controlMove = function (posMove) {
        var pos = new egret.Point(posMove.x - this.gun.x, posMove.y - this.gun.y);
        //traceSimple(pos.x,pos.y);
        this.gun.updatePos(pos);
    };
    GameControl.prototype.endBackFun = function (posEnd) {
        var pos = new egret.Point(posEnd.x - this.gun.x, posEnd.y - this.gun.y);
        var angle = Math.atan2(pos.x, pos.y);
        var dis = 10000;
        var x = Math.ceil(Math.sin(angle) * dis);
        var y = Math.ceil(Math.cos(angle) * dis);
        this.vec = new egret.Point(x, y);
        // ball.velocity=[x,y]
        this.ballNum = this.gun.bulletMax;
        this.gun.hideLine();
        this.gun.fire();
        this.blood--;
        this.updateBlood();
    };
    /**开火 */
    GameControl.prototype.onFire = function (e) {
        var ball = this.createBall();
        ball.position = [this.gun.x, this.gun.y];
        this.doMaterial(ball);
        ball.applyImpulse([this.vec.x * 2, this.vec.y * 2], [0, 0]);
        this.mainframe.setChildIndex(this.gun, this.numChildren - 1);
    };
    /**与加碰撞产生新球 */
    GameControl.prototype.createNewBall = function (ball) {
        var newBall = this.createBall();
        newBall.position = [ball.position[0], ball.position[1]];
        newBall.mass = 100;
        this.setBallImpulse(newBall);
    };
    /** 距离右边的距离*/
    GameControl.prototype.getRight = function (distance) {
        return GameData.stageWidth - distance;
    };
    /** 距离右边的距离*/
    GameControl.prototype.getBottom = function (distance) {
        return GameData.stageHeight - distance;
    };
    /** 传入宽后居中距离*/
    GameControl.prototype.getCenterX = function (skinWidth) {
        return (GameData.stageWidth - skinWidth) >> 1;
    };
    /**设置与球的碰撞弹性 */
    GameControl.prototype.doMaterial = function (ball) {
        var world = this.world;
        var bodys = world.p2World.bodies;
        var l = bodys.length;
        for (var i = 0; i < l; i++) {
            var body = bodys[i];
            if (body.userData["hit"]) {
                this.setMaterial(ball, body);
            }
        }
    };
    /** 设置刚体碰撞的弹性*/
    GameControl.prototype.setMaterial = function (body1, body2) {
        var material = this.material;
        body1.shapes[0].material = material;
        body2.shapes[0].material = material;
        var roleAndStoneMaterial = new p2.ContactMaterial(material, material, { restitution: 0.7, friction: 0 }); //弹性，摩擦力
        this.world.p2World.addContactMaterial(roleAndStoneMaterial);
    };
    /** 创建底座三角形刚体*/
    GameControl.prototype.createBottom = function () {
        var world = this.world;
        var h = 59, w = 520; //三角形高与宽
        var bottom = world.createConvexBodyShape([[0, h], [w / 2, 0], [w, h]]);
        // var skin:MImage=this.createSkin("bottom_png");
        // bottom.userData.skin=skin;
        //world.drawSkin(bottom);
        bottom.position = [this.getCenterX(0), this.getBottom(h / 2) + 10];
        bottom.type = p2.Body.KINEMATIC;
        this.setAndBallHit(bottom);
        var skin = this.createSkin("bottom_png");
        skin.x = this.getCenterX(0) - 5;
        skin.y = this.getBottom(h / 2);
        this.mainframe.addChild(skin);
    };
    /**设置属性后就可以与球碰撞 */
    GameControl.prototype.setAndBallHit = function (body) {
        var shape = body.shapes[0];
        shape.collisionMask = 6; //010与001为0，010与110为1
    };
    /** 创建球刚体*/
    GameControl.prototype.createBall = function () {
        var world = this.world;
        var skin = this.createSkin("ball_png");
        var body = world.createCircleBodyShape(skin.width >> 1);
        body.userData.skin = skin;
        body.userData["ball"] = true;
        body.mass = 0; //质量设置为0，就可以按规定方向发射，等发生碰撞之后再给球质量
        //body.gravityScale=0;
        var shape = body.shapes[0];
        shape.collisionGroup = 2; //010与001为0，010与110为1
        // shape.collisionMask=2;
        //trace(shape.collisionGroup,shape.collisionMask)
        return body;
    };
    /** 创建刚体*/
    GameControl.prototype.createBody = function (name, shapeType, type) {
        if (shapeType === void 0) { shapeType = SHAPE.rect; }
        if (type === void 0) { type = p2.Body.KINEMATIC; }
        var world = this.world;
        var skin = this.createSkin(name);
        var body;
        if (shapeType == SHAPE.rect)
            body = world.createBoxBodyShape(skin.width, skin.height, type);
        else if (shapeType == SHAPE.circle)
            body = world.createCircleBodyShape(skin.width >> 1, type);
        body.userData.skin = skin;
        body.userData["hit"] = true;
        this.setAndBallHit(body);
        return body;
    };
    /** 创建带数字刚体*/
    GameControl.prototype.createNumBody = function () {
        var names = this.names;
        var name = "";
        if (this.box_adver_type && Math.random() <= 0.4) {
            name = this.adver_names[GameData.adver_sum % 3];
            GameData.adver_sum++; // 计数-出现几次
        }
        else {
            name = names[Math.floor(Math.random() * names.length)];
        }
        if (this.gun.bulletMax < 5) {
            if (Math.random() < 0.4) {
                if (this.adver_names.indexOf(name) >= 0) {
                    GameData.adver_sum--;
                }
                name = ICON_ADD;
            }
        }
        else if (this.gun.bulletMax >= 10) {
            if (name == ICON_ADD)
                name = "circle1_png";
        }
        if (!this.popup_flag && this.pop_adver_type && Math.floor(this.blood / 6 + 1) == 3 - this.pop_index) {
            this.popup_flag = true;
            name = "ads_type_png";
        }
        var shape = name.split("rect").length == 2 ? SHAPE.rect : SHAPE.circle;
        if (this.adver_names.indexOf(name) >= 0) {
            shape = SHAPE.rect;
        }
        var body = this.createBody(name, shape);
        return body;
    };
    /** 创建皮肤*/
    GameControl.prototype.createSkin = function (name) {
        var skin = new NumImage(name);
        skin.x = -500; //避免在一出现的时候会在左上角闪现
        skin.setAnchorCenter();
        this.mainframe.addChild(skin);
        return skin;
    };
    GameControl.prototype.loopP2World = function () {
        var bodys = this.world.p2World.bodies;
        //traceSimple("bodys",bodys.length);
        var l = bodys.length;
        for (var i = 0; i < l; i++) {
            var body = bodys[i];
            if (body.userData && body.userData.skin) {
                if (body.userData["ball"]) {
                    var vec = new Point(body.velocity[0], body.velocity[1]);
                    var vecnum = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
                    if (vecnum < 1) {
                        console.log(vecnum);
                        this.setBallImpulse(body);
                    }
                }
            }
        }
    };
    GameControl.prototype.loop = function (n) {
        var skins = this.removeSkins;
        // traceSimple(skins.length)
        for (var i = 0; i < skins.length; i++) {
            var skin = skins[i];
            skin.y -= 20;
            if (skin.x > GameData.stageWidth / 2) {
                skin.x = GameData.stageWidth - skin.width;
            }
            else {
                skin.x = skin.width;
            }
            if (skin.parent && skin.y < 0) {
                this.ballNum--;
                skin.removeFromParent(true);
            }
        }
        if (this.ballNum == 0) {
            this.nextLevel();
        }
        return true;
    };
    GameControl.prototype.nextLevel = function () {
        this.ballNum = this.gun.bulletMax;
        this.removeSkins.length = 0;
        this.updateNumBody();
        this.gun.initNum();
    };
    return GameControl;
}(moon.BasicGamePanel));
__reflect(GameControl.prototype, "GameControl");
/**分数图标*/
var NumImage = (function (_super) {
    __extends(NumImage, _super);
    function NumImage(skinName) {
        if (skinName === void 0) { skinName = ""; }
        var _this = _super.call(this, skinName) || this;
        _this._value = -1;
        return _this;
    }
    NumImage.prototype.initNum = function (v) {
        this.txt = this.createText(0, 0);
        if (this.skinName == ICON_ADD || this.skinName == "ads_type_png") {
            this._value = 1;
        }
        else {
            if (AdverType.adverName.box_name.indexOf(this.skinName) >= 0) {
                this._value = 1;
            }
            else {
                this.value = v;
            }
        }
    };
    NumImage.prototype.createText = function (x, y, s) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (s === void 0) { s = ""; }
        var text = (new moon.Label).textField;
        text.x = x;
        text.y = y;
        text.text = s;
        this.addChild(text);
        return text;
    };
    Object.defineProperty(NumImage.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (v) {
            this._value = v;
            this.txt.text = String(v);
            this.txt.textColor = 0;
            if (this.parent != null) {
                Layout.getIns().setCenterXByPanent(this.txt);
                Layout.getIns().setCenterYByPanent(this.txt);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NumImage.prototype, "imageName", {
        get: function () {
            return this.skinName;
        },
        enumerable: true,
        configurable: true
    });
    NumImage.prototype.update = function () {
        this._value--;
        this.value = this._value;
        if (this.imageName == ICON_ADD || this.imageName == "ads_type_png" || AdverType.adverName.box_name.indexOf(this.imageName) >= 0) {
            SoundControl.getIns().play(MUSIC_ADDNUM);
        }
        else {
            SoundControl.getIns().play(MUSIC_HIT);
        }
    };
    return NumImage;
}(MImage));
__reflect(NumImage.prototype, "NumImage");
/**枪*/
var Gun = (function (_super) {
    __extends(Gun, _super);
    function Gun() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bulletMax = 1;
        return _this;
    }
    Gun.prototype.render = function () {
        var gun = new MImage("gun_png");
        gun.anchorOffsetX = gun.width >> 1;
        this.addChild(gun);
        this.gun = gun;
        var numBg = new MImage("numBg_png");
        numBg.setAnchorCenter();
        this.addChild(numBg);
        var line = new MImage("line_png");
        line.anchorOffsetX = line.width >> 1;
        this.line = line;
        this.txtNum = this.createText(0, 0, "");
        this.bullet = this.bulletMax;
        this.updateNum(this.bullet);
    };
    Gun.prototype.restart = function () {
        this.bulletMax = 1;
        this.initNum();
    };
    Gun.prototype.updatePos = function (pos) {
        var r = -Math.atan2(pos.x, pos.y) * 180 / Math.PI;
        this.gun.rotation = r;
        this.line.rotation = r;
    };
    Gun.prototype.initNum = function () {
        this.bullet = this.bulletMax;
        this.updateNum(this.bullet);
    };
    Gun.prototype.showLine = function () {
        this.addChildAt(this.line, 0);
    };
    Gun.prototype.hideLine = function () {
        this.line.removeFromParent();
    };
    Gun.prototype.updateNum = function (value) {
        this.txtNum.text = String(value);
        this.txtNum.anchorOffsetX = this.txtNum.width >> 1;
        this.txtNum.anchorOffsetY = this.txtNum.height >> 1;
    };
    Gun.prototype.fire = function () {
        if (this.bullet > 0) {
            this.updateNum(--this.bullet);
            Tween.get(this.gun).to({ scaleY: 0.6 }, 100).to({ scaleY: 1 }, 100);
            this.dispEvent(EVENT_FIRE);
            setTimeout(this.fire.bind(this), 200);
            SoundControl.getIns().play(MUSIC_FIRE);
        }
    };
    return Gun;
}(moon.BasicView));
__reflect(Gun.prototype, "Gun");
