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
var AdverType;
(function (AdverType) {
    var adverName = (function () {
        function adverName() {
        }
        adverName.shufferQuestion = function (list) {
            for (var j_ = list['question'].length - 1; j_ >= 0; j_--) {
                var j = Math.floor(Math.random() * (j_));
                var ith_array_first = list['question'][j_];
                var ith_array_second = list['question'][j];
                var num_first = list["num"][j_];
                var num_second = list["num"][j];
                if (Math.random() >= 0.5) {
                    list['question'][j] = ith_array_first;
                    list['question'][j_] = ith_array_second;
                    list["num"][j] = num_first;
                    list["num"][j_] = num_second;
                }
            }
            return list;
        };
        adverName.mustSelect = function (list, quesList) {
            for (var i = 0; i < list.length; i++) {
                if (quesList['num'].slice(0, 6).indexOf(list[i]) < 0) {
                    return false;
                }
            }
            return true;
        };
        adverName.GetQuestionList = function (list) {
            this.questionList = this.shufferQuestion(this.questionList);
            if (list.indexOf(-1) >= 0)
                return (this.questionList);
            while (!this.mustSelect(list, this.questionList)) {
                this.questionList = this.shufferQuestion(this.questionList);
            }
            return (this.questionList);
        };
        adverName.selectPopUp = function (_type) {
            var select = [];
            var popup = [];
            if (_type == "popup") {
                popup = AdverType.adverName.popup_name.concat();
            }
            else if (_type == "box") {
                popup = AdverType.adverName.box_name.concat();
            }
            while (select.length < 3) {
                var rand = Math.floor(Math.random() * popup.length);
                select = select.concat(popup.splice(rand, 1));
            }
            return (select);
        };
        adverName.banner_name = ["banner_alipay_jpg", "banner_geli_jpg", "banner_iphoneX_jpg", "banner_kfc_jpg", "banner_meituan_jpg", "banner_nike_jpg", "banner_ofo_jpg", "banner_pinduoduo_jpg", "banner_starbucks_jpg", "banner_tebu_jpg", "banner_vivo_jpg", "banner_weiqian_jpg"];
        adverName.popup_name = ["pop_alipay_jpg", "pop_geli_jpg", "pop_iphoneX_jpg", "pop_kfc_jpg", "pop_meituan_jpg", "pop_nike_jpg", "pop_ofo_jpg", "pop_pinduoduo_jpg", "pop_starbucks_jpg", "pop_tebu_jpg", "pop_vivo_jpg", "pop_weiqian_jpg"];
        adverName.box_name = ["alipay_jpg", "geli_jpg", "iphone_x_jpg", "KFC_png", "meituan_jpg", "nike_png", "ofo_jpg", "pinduoduo_jpg", "Starbucks_jpg", "tebu_jpg", "vivo_jpg", "weiqian_jpg"];
        adverName.bg_name = ["bg_alipay_png", "bg_geli_png", "bg_iphonex_png", "bg_kfc_png", "bg_meituan_png", "bg_nike_png", "bg_ofo_png", "bg_pinduoduo_png", "bg_starbucks_png", "bg_tebu_png", "bg_vivo_png", "bg_weiqian_png"];
        adverName.video_name = ["alipay.mp4", "geli.mp4", "iphoneX.mp4", "kfc1.mp4", "meituan.mp4", "nike.mp4", "ofo.mp4", "pinduoduo.mp4", "starbucks.mp4", "tebu.mp4", "vivo.mp4", "weiqian.mp4"];
        adverName.questionList = {
            answer: ["A、否", "B、是", "C、不知道"],
            question: [
                "\"支付宝Alipay\"的广告是否在本局游戏中出现：",
                "\"格力\"的广告是否在本局游戏中出现：",
                "\"苹果iphone\"的广告是否在本局游戏中出现：",
                "\"肯德基KFC\"的广告是否在本局游戏中出现：",
                "\"美团meituan\"的广告是否在本局游戏中出现：",
                "\"耐克Nike\"的广告是否在本局游戏中出现：",
                "\"小黄车ofo\"的广告是否在本局游戏中出现：",
                "\"拼多多\"的广告是否在本局游戏中出现：",
                "\"星巴克Starbucks\"的广告是否在本局游戏中出现：",
                "\"特步tebu\"的广告是否在本局游戏中出现：",
                "\"Vivo\"的广告是否在本局游戏中出现：",
                "\"味千拉面weiqian\"的广告是否在本局游戏中出现："
            ],
            num: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        };
        return adverName;
    }());
    AdverType.adverName = adverName;
    __reflect(adverName.prototype, "AdverType.adverName");
    var Popup = (function (_super) {
        __extends(Popup, _super);
        function Popup(pop_name) {
            var _this = _super.call(this) || this;
            _this.stageH = egret.MainContext.instance.stage.stageHeight;
            _this.stageW = egret.MainContext.instance.stage.stageWidth;
            _this.createBackGroundImage();
            _this.createAdvertisement(pop_name);
            _this.createShutDown();
            return _this;
        }
        Popup.prototype.createAdvertisement = function (pop_name) {
            if (!this.advertisement) {
                this.advertisement = new egret.Bitmap();
            }
            this.advertisement.texture = RES.getRes(pop_name);
            var scaleX = this.stageW / this.advertisement.width;
            this.advertisement.width = this.stageW;
            this.advertisement.height = scaleX * this.advertisement.height;
            this.advertisement.y = this.stageH / 2 - this.advertisement.height / 2;
            console.log("pop广告的width和height", this.advertisement.width);
            this.addChild(this.advertisement);
        };
        Popup.prototype.createBackGroundImage = function () {
            var bg = new egret.Shape();
            bg.graphics.clear();
            bg.graphics.beginFill(0x808080, 0.6);
            bg.graphics.drawRect(0, 0, this.stageW, this.stageH);
            bg.graphics.endFill();
            this.addChild(bg);
        };
        Popup.prototype.createShutDown = function () {
            this.shutdown_map = new egret.Bitmap();
            this.shutdown_map.texture = RES.getRes("shutdown_png");
            this.shutdown_map.width = 100;
            this.shutdown_map.height = 100;
            this.shutdown_map.x = this.stageW - this.shutdown_map.width - 20;
            this.shutdown_map.y = 20;
            this.addChild(this.shutdown_map);
            this.shutdown_map.touchEnabled = true;
            this.shutdown_map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shutdown, this);
        };
        Popup.prototype.shutdown = function () {
            this.dispatchEventWith(Popup.GUNOPEN);
            this.removeChildren();
            this.removeFromParent();
        };
        Popup.prototype.removeFromParent = function () {
            var _parent = this.parent;
            if (_parent && _parent.contains(this))
                _parent.removeChild(this);
            _parent = null;
        };
        Popup.GUNOPEN = "gunopen";
        return Popup;
    }(egret.Sprite));
    AdverType.Popup = Popup;
    __reflect(Popup.prototype, "AdverType.Popup");
    var bgAdver = (function (_super) {
        __extends(bgAdver, _super);
        function bgAdver(_index) {
            var _this = _super.call(this) || this;
            _this.stageW = 0;
            _this.stageH = 0;
            _this.bg_all_name = AdverType.adverName.bg_name.concat();
            _this.index = 0;
            _this.stageH = egret.MainContext.instance.stage.stageHeight;
            _this.stageW = egret.MainContext.instance.stage.stageWidth;
            _this.bg_name = _this.selectBG();
            for (var _i = 0, _a = _this.bg_name; _i < _a.length; _i++) {
                var x = _a[_i];
                GameData.uploadMessage[GameData.uploadMessage.length - 1].push(_this.bg_all_name.indexOf(x));
                console.log("push bg 广告出现", GameData.uploadMessage);
            }
            _this.index = 0;
            if (!_this.bg) {
                _this.bg = new egret.Bitmap();
                _this.bg.texture = RES.getRes(_this.bg_name[_this.index % 3]);
                _this.bg.alpha = 0;
                _this.addChild(_this.bg);
                egret.Tween.get(_this.bg).to({
                    alpha: 1
                }, 250);
            }
            else {
                var that = _this;
                egret.Tween.get(_this.bg).to({
                    alpha: 0
                }, 250).call(function () {
                    that.bg.texture = RES.getRes(_this.bg_name[_this.index % 3]);
                    egret.Tween.get(_this.bg).to({
                        alpha: 1
                    }, 250);
                });
            }
            _this.index++;
            return _this;
        }
        bgAdver.prototype.selectBG = function () {
            var select = [];
            var banner = AdverType.adverName.bg_name.concat();
            while (select.length < 3) {
                var rand = Math.floor(Math.random() * banner.length);
                select = select.concat(banner.splice(rand, 1));
            }
            return (select);
        };
        bgAdver.prototype.updateBG = function (index) {
            var _this = this;
            if ((index) % 3 == 0) {
                if (!this.bg) {
                    this.bg = new egret.Bitmap();
                    this.bg.texture = RES.getRes(this.bg_name[this.index % 3]);
                    this.bg.alpha = 0;
                    this.addChild(this.bg);
                    var that = this;
                    egret.Tween.get(this.bg).to({
                        alpha: 1
                    }, 250).call(function () {
                        that.index++;
                    });
                }
                else {
                    var that = this;
                    egret.Tween.get(this.bg).to({
                        alpha: 0
                    }, 250).call(function () {
                        that.bg.texture = RES.getRes(_this.bg_name[_this.index % 3]);
                        egret.Tween.get(_this.bg).to({
                            alpha: 1
                        }, 250).call(function () {
                            that.index++;
                        });
                    });
                }
            }
            return this.index;
        };
        return bgAdver;
    }(egret.Sprite));
    AdverType.bgAdver = bgAdver;
    __reflect(bgAdver.prototype, "AdverType.bgAdver");
    var AwardVideo = (function (_super) {
        __extends(AwardVideo, _super);
        function AwardVideo() {
            var _this = _super.call(this) || this;
            _this.intervalDuration = 1000; // duration between intervals, in milliseconds
            _this.timeCount = 15;
            _this.index = 0; // 目前进行道德广告index
            _this.advername = _this.selectVideo();
            _this.stageHeight = egret.MainContext.instance.stage.stageHeight;
            _this.stageWidth = egret.MainContext.instance.stage.stageWidth;
            _this.index = 0;
            for (var _i = 0, _a = _this.advername; _i < _a.length; _i++) {
                var x = _a[_i];
                GameData.uploadMessage[GameData.uploadMessage.length - 1].push(AdverType.adverName.video_name.indexOf(x));
                console.log("push video 广告出现", _this.advername, GameData.uploadMessage);
            }
            _this.addjili();
            return _this;
        }
        AwardVideo.prototype.selectVideo = function () {
            var select = [];
            var video = AdverType.adverName.video_name.concat();
            while (select.length < 3) {
                var rand = Math.floor(Math.random() * video.length);
                select = select.concat(video.splice(rand, 1));
            }
            return (select);
        };
        AwardVideo.prototype.addjili = function () {
            if (!this.awardAdver) {
                this.awardAdver = new egret.Bitmap();
            }
            this.awardAdver.texture = RES.getRes("jili_png");
            this.awardAdver.scaleX = 0.7;
            this.awardAdver.scaleY = 0.7;
            this.awardAdver.x = this.stageWidth - this.awardAdver.width / 2 - 60;
            this.awardAdver.y = 40;
            var circle = new egret.Shape();
            circle.graphics.beginFill(0xFF4500, 1);
            circle.graphics.drawCircle(0, 0, 25);
            circle.graphics.endFill();
            circle.x = this.awardAdver.x + this.awardAdver.width / 2 + 35;
            circle.y = this.awardAdver.y - 7;
            if (!this.awardLeftCount) {
                this.awardLeftCount = new egret.TextField();
            }
            this.awardLeftCount.text = (3 - this.index).toString();
            this.awardLeftCount.textColor = 0x000000;
            this.awardLeftCount.size = 30;
            this.awardLeftCount.bold = true;
            this.awardLeftCount.x = circle.x - 10;
            this.awardLeftCount.y = circle.y - 10;
            this.addChild(this.awardAdver);
            this.addChild(circle);
            this.addChild(this.awardLeftCount);
            this.awardAdver.touchEnabled = true;
            this.awardAdver.addEventListener(egret.TouchEvent.TOUCH_TAP, this.tapjili, this);
        };
        AwardVideo.prototype.tapjili = function () {
            if (this.index >= 3) {
                this.awardAdver.touchEnabled = false;
            }
            else {
                this.createAdvertisement();
            }
        };
        AwardVideo.prototype.pauser = function () {
            if (this.video) {
                this.video.pause();
                console.log("视频播放暂停");
            }
        };
        AwardVideo.prototype.player = function () {
            if (this.video) {
                this.video.play();
            }
        };
        AwardVideo.prototype.createAdvertisement = function () {
            SoundControl.getIns().stop(MUSIC_BG);
            this.adver_sprit = new egret.Sprite();
            this.createBackGroundImage();
            this.addChild(this.adver_sprit);
            this.video = new egret.Video();
            this.video.width = this.stageWidth; //设置视频宽
            this.video.height = this.stageWidth * 9 / 16; //设置视频高
            this.video.x = 0; //设置视频坐标x
            this.video.y = (this.stageHeight - this.video.height) / 2; //设置视频坐标y
            this.video.fullscreen = false; //设置是否全屏（暂不支持移动设备）
            this.video.poster = "resource/assets/loading.jpg"; //设置loding图
            this.video.load("resource/assets/Adver/video/" + this.advername[this.index % 3]);
            this.adver_sprit.addChild(this.video); //将视频添加到舞台
            this.index++;
            GameData.adver_sum = this.index;
            this.awardLeftCount.text = (3 - this.index).toString();
            //监听视频加载完成
            this.video.once(egret.Event.COMPLETE, this.onLoad, this);
            //监听视频加载失败
            this.video.once(egret.IOErrorEvent.IO_ERROR, this.onLoadErr, this);
            this.createShutDown();
        };
        AwardVideo.prototype.createBackGroundImage = function () {
            var bg = new egret.Shape();
            bg.graphics.clear();
            bg.graphics.beginFill(0x808080, 0.9);
            bg.graphics.drawRect(0, 0, this.stageWidth, this.stageHeight);
            bg.graphics.endFill();
            this.adver_sprit.addChild(bg);
        };
        AwardVideo.prototype.onLoad = function (e) {
            this.createTimer();
            this.video.play();
        };
        AwardVideo.prototype.onLoadErr = function (e) {
            console.log("video load error happened");
        };
        AwardVideo.prototype.createTimer = function () {
            //创建一个计时器对象
            this.resertTimeout();
            if (!this.countDownTextField) {
                this.countDownTextField = new egret.TextField();
            }
            this.countDownTextField.text = this.timeCount.toString();
            this.countDownTextField.width = 130;
            this.countDownTextField.height = 60;
            this.countDownTextField.textAlign = egret.HorizontalAlign.CENTER;
            this.countDownTextField.textColor = 0x00ff00;
            this.countDownTextField.bold = true;
            this.countDownTextField.size = 60;
            this.countDownTextField.y = 30;
            this.countDownTextField.x = 15;
            this.adver_sprit.addChild(this.countDownTextField);
        };
        AwardVideo.prototype.SetIntervalExample = function () {
            this.intervalID_pro = egret.setTimeout(this.myRepeatingFunction, this, this.intervalDuration);
        };
        AwardVideo.prototype.myRepeatingFunction = function (obj) {
            this.timeCount = this.timeCount - 1;
            if (this.timeCount >= 0) {
                this.countDownTextField.text = this.timeCount.toString();
                this.intervalID_pro = egret.setTimeout(this.myRepeatingFunction, this, this.intervalDuration);
                // console.log("id是"+this.intervalID_pro.toString());
            }
            else {
                egret.clearTimeout(this.intervalID_pro);
                this.video.pause();
            }
        };
        AwardVideo.prototype.pauseTimeout = function () {
            egret.clearTimeout(this.intervalID_pro);
            return (this.timeCount);
        };
        AwardVideo.prototype.resertTimeout = function () {
            this.timeCount = 15;
            this.SetIntervalExample();
        };
        AwardVideo.prototype.createShutDown = function () {
            this.shutdown_map = new egret.Bitmap();
            this.shutdown_map.texture = RES.getRes("shutdown_png");
            this.shutdown_map.width = 100;
            this.shutdown_map.height = 100;
            this.shutdown_map.x = this.stageWidth - this.shutdown_map.width - 20;
            this.shutdown_map.y = 20;
            this.adver_sprit.addChild(this.shutdown_map);
            this.shutdown_map.touchEnabled = true;
            this.shutdown_map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shutdown, this);
        };
        AwardVideo.prototype.shutdown = function () {
            if (this.pauseTimeout() > 0) {
                //create choose pannel。
                this.pauser();
                this.createChoosePannel();
            }
            else {
                this.removeFromParent();
                // 生命值加2
                this.dispatchEventWith(Popup.GUNOPEN);
            }
        };
        AwardVideo.prototype.removeFromParent = function () {
            SoundControl.getIns().play(MUSIC_BG, 0, 9999);
            this.dispatchEventWith(AwardVideo.TAP_VIDEO);
            this.removeChild(this.adver_sprit);
        };
        // 观看激励性视频广告时，如果时间未到，选择关闭，此时创建的关闭提醒窗口
        AwardVideo.prototype.createChoosePannel = function () {
            if (!this.shutdown_choose) {
                this.shutdown_choose = new egret.Sprite();
            }
            this.shutdown_choose.removeChildren();
            this.shutdown_choose.width = this.stageWidth / 2;
            this.shutdown_choose.height = this.stageHeight / 6;
            this.shutdown_choose.x = (this.stageWidth - this.shutdown_choose.width) / 2;
            this.shutdown_choose.y = this.stageHeight * 2 / 5;
            if (this.getChildIndex(this.shutdown_choose) >= 0) { }
            else {
                this.addChild(this.shutdown_choose);
            }
            var background = new egret.Shape();
            background.graphics.clear();
            background.graphics.beginFill(0x000000, 1);
            background.graphics.drawRect(0, 0, this.shutdown_choose.width, this.shutdown_choose.height);
            background.graphics.endFill();
            this.shutdown_choose.addChild(background);
            var textPanel = new egret.TextField();
            textPanel.text = "尚未观看完毕，取消无法获得奖励";
            textPanel.textColor = 0xff0000;
            textPanel.size = 20;
            textPanel.width = this.shutdown_choose.width;
            textPanel.height = this.shutdown_choose.height / 2;
            textPanel.textAlign = egret.HorizontalAlign.CENTER;
            textPanel.y = this.shutdown_choose.height / 4 - 15;
            this.shutdown_choose.addChild(textPanel);
            var line1 = new egret.Shape();
            line1.graphics.lineStyle(1, 0xffffff);
            line1.graphics.moveTo(0, this.shutdown_choose.height / 2);
            line1.graphics.lineTo(textPanel.width, this.shutdown_choose.height / 2);
            this.shutdown_choose.addChild(line1);
            var button_cancel = new egret.TextField();
            button_cancel.text = "取消观看";
            button_cancel.textColor = 0xA9A9A9;
            button_cancel.size = 30;
            button_cancel.width = this.shutdown_choose.width / 2;
            button_cancel.height = this.shutdown_choose.height / 2;
            button_cancel.textAlign = egret.HorizontalAlign.CENTER;
            button_cancel.y = this.shutdown_choose.height / 2 + 30;
            button_cancel.x = 0;
            this.shutdown_choose.addChild(button_cancel);
            var line2 = new egret.Shape();
            line2.graphics.lineStyle(1, 0xffffff);
            line2.graphics.moveTo(textPanel.width / 2, this.shutdown_choose.height / 2);
            line2.graphics.lineTo(textPanel.width / 2, this.shutdown_choose.height);
            this.shutdown_choose.addChild(line2);
            var button_continue = new egret.TextField();
            button_continue.text = "继续观看";
            button_continue.textColor = 0x00FF00;
            button_continue.size = 30;
            button_continue.width = this.shutdown_choose.width / 2;
            button_continue.height = this.shutdown_choose.height / 2;
            button_continue.textAlign = egret.HorizontalAlign.CENTER;
            button_continue.y = this.shutdown_choose.height / 2 + 30;
            button_continue.x = this.shutdown_choose.width / 2;
            this.shutdown_choose.addChild(button_continue);
            var that = this;
            button_cancel.touchEnabled = true;
            button_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                that.removeChild(that.shutdown_choose);
                if (that.getChildIndex(that.shutdown_map) >= 0) {
                    that.removeChild(that.shutdown_map);
                }
                egret.clearTimeout(that.intervalID_pro);
                that.removeFromParent();
            }, this);
            button_continue.touchEnabled = true;
            button_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                that.removeChild(that.shutdown_choose);
                that.SetIntervalExample();
                that.player();
            }, this);
        };
        AwardVideo.TAP_VIDEO = "tap_video";
        return AwardVideo;
    }(egret.Sprite));
    AdverType.AwardVideo = AwardVideo;
    __reflect(AwardVideo.prototype, "AdverType.AwardVideo");
    var bannerAdver = (function (_super) {
        __extends(bannerAdver, _super);
        function bannerAdver() {
            var _this = _super.call(this) || this;
            _this.stageW = 0;
            _this.stageH = 0;
            _this.intervalDuration = 1000; // duration between intervals, in milliseconds
            _this.timeCount = 15;
            _this.banner_all_name = AdverType.adverName.banner_name.concat();
            _this.index = 0;
            _this.boxSquenceType = 0; // 表示游戏类型
            _this.stageH = egret.MainContext.instance.stage.stageHeight;
            _this.stageW = egret.MainContext.instance.stage.stageWidth;
            _this.banner_name = _this.selectBanner();
            for (var _i = 0, _a = _this.banner_name; _i < _a.length; _i++) {
                var x = _a[_i];
                GameData.uploadMessage[GameData.uploadMessage.length - 1].push(_this.banner_all_name.indexOf(x));
                console.log("push banner 广告出现", _this.banner_name, GameData.uploadMessage);
            }
            _this.banner = [];
            _this.circle = [];
            _this.createCicle();
            _this.createBanner();
            _this.createTimer();
            return _this;
        }
        bannerAdver.prototype.selectBanner = function () {
            var select = [];
            var banner = AdverType.adverName.banner_name.concat();
            while (select.length < 3) {
                var rand = Math.floor(Math.random() * banner.length);
                // console.log(banner.splice(rand, 1))
                select = select.concat(banner.splice(rand, 1));
            }
            return (select);
        };
        bannerAdver.prototype.stopBanner = function () {
            egret.clearInterval(this.intervalID);
            console.log("清楚了倒计时");
        };
        bannerAdver.prototype.createBanner = function () {
            var i = 0;
            for (var _i = 0, _a = this.banner_name; _i < _a.length; _i++) {
                var x = _a[_i];
                var bitmap = new egret.Bitmap();
                bitmap.texture = RES.getRes(x);
                bitmap.width = this.stageW;
                bitmap.height = this.stageH / 7;
                bitmap.x = i * this.stageW;
                i++;
                this.banner.push(bitmap);
                this.addChild(bitmap);
            }
            this.circlePoll();
        };
        bannerAdver.prototype.createCicle = function () {
            this.circle = [];
            for (var i = 0; i < this.banner.length; i++) {
                var shp = new egret.Shape();
                if ((this.index % 3) == i) {
                    shp.graphics.beginFill(0xDC143C, 1);
                }
                else {
                    shp.graphics.beginFill(0xDCDCDC, 1);
                }
                shp.graphics.drawCircle(0, 0, 10);
                shp.x = this.stageW / 2 + (i - 1) * 30;
                shp.y = this.stageH / 8 - 30;
                shp.graphics.endFill();
                this.circle.push(shp);
            }
        };
        bannerAdver.prototype.createPoll = function () {
            this.removeChildren();
            for (var _i = 0, _a = this.banner; _i < _a.length; _i++) {
                var x = _a[_i];
                x.x = Math.floor(x.x / this.stageW) * this.stageW;
                if (x.x < 0) {
                    x.x = (this.banner.length - 1) * this.stageW;
                }
                this.addChild(x);
            }
            // this.addChild(this.banner[this.index]);
            for (var _b = 0, _c = this.banner; _b < _c.length; _b++) {
                var x = _c[_b];
                egret.Tween.get(x).to({
                    x: x.x - this.stageW,
                    y: x.y
                }, 499);
            }
            ;
            this.circlePoll();
        };
        bannerAdver.prototype.circlePoll = function () {
            this.createCicle();
            for (var _i = 0, _a = this.circle; _i < _a.length; _i++) {
                var x = _a[_i];
                this.addChildAt(x, 20);
            }
            this.index = this.index + 1;
            GameData.adver_sum = this.index;
        };
        bannerAdver.prototype.createTimer = function () {
            //创建一个计时器对象
            this.intervalID = egret.setInterval(this.myRepeatingFunction, this, this.intervalDuration);
        };
        bannerAdver.prototype.myRepeatingFunction = function (obj) {
            console.log('倒计时');
            if (this.timeCount >= 0) {
                this.timeCount = this.timeCount - 1;
            }
            else {
                this.timeCount = 15;
                this.createPoll();
            }
        };
        return bannerAdver;
    }(egret.Sprite));
    AdverType.bannerAdver = bannerAdver;
    __reflect(bannerAdver.prototype, "AdverType.bannerAdver");
})(AdverType || (AdverType = {}));
