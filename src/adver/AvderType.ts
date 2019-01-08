module AdverType{
    export class adverName{
        public static readonly banner_name:Array<string> = ["banner_alipay_jpg","banner_geli_jpg","banner_iphoneX_jpg","banner_kfc_jpg","banner_meituan_jpg","banner_nike_jpg","banner_ofo_jpg","banner_pinduoduo_jpg","banner_starbucks_jpg","banner_tebu_jpg","banner_vivo_jpg","banner_weiqian_jpg"];
        public static readonly popup_name:Array<string> = ["pop_alipay_jpg","pop_geli_jpg","pop_iphoneX_jpg","pop_kfc_jpg","pop_meituan_jpg","pop_nike_jpg","pop_ofo_jpg","pop_pinduoduo_jpg","pop_starbucks_jpg","pop_tebu_jpg","pop_vivo_jpg","pop_weiqian_jpg"];
        public static readonly box_name:Array<string> = ["alipay_jpg","geli_jpg","iphone_x_jpg","KFC_png","meituan_jpg","nike_png","ofo_jpg","pinduoduo_jpg","Starbucks_jpg","tebu_jpg","vivo_jpg","weiqian_jpg"];
        public static readonly bg_name:Array<string> = ["bg_alipay_png","bg_geli_png","bg_iphonex_png","bg_kfc_png","bg_meituan_png","bg_nike_png","bg_ofo_png","bg_pinduoduo_png","bg_starbucks_png","bg_tebu_png","bg_vivo_png","bg_weiqian_png"];
        public static readonly video_name:Array<string> = ["alipay.mp4","geli.mp4","iphoneX.mp4","kfc1.mp4","meituan.mp4","nike.mp4","ofo.mp4","pinduoduo.mp4","starbucks.mp4", "tebu.mp4","vivo.mp4","weiqian.mp4"];

        public static questionList:object = {
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
                "\"味千拉面weiqian\"的广告是否在本局游戏中出现："],
            num: [0,1,2,3,4,5,6,7,8,9,10,11]
        };

        public static shufferQuestion(list: object ){
            for(let j_=list['question'].length-1; j_>=0; j_--){
                let j = Math.floor(Math.random() * (j_));
                let ith_array_first = list['question'][j_];
                let ith_array_second = list['question'][j];

                let num_first = list["num"][j_];
                let num_second = list["num"][j];

                if(Math.random()>=0.5) {
                    list['question'][j] = ith_array_first;
                    list['question'][j_] = ith_array_second;

                    list["num"][j] = num_first;
                    list["num"][j_] = num_second;
                }
            }
            return list;
        }
        public static mustSelect(list: Array<number>, quesList: object): boolean{
            for(let i=0; i< list.length;i++){
                if(quesList['num'].slice(0,6).indexOf(list[i]) < 0){
                    return false;
                }
            }
            return true;
        }
        public static GetQuestionList(list: Array<number>,){
            this.questionList = this.shufferQuestion(this.questionList);
            if(list.indexOf(-1)>=0) return(this.questionList);
            while(!this.mustSelect(list, this.questionList)){
                this.questionList = this.shufferQuestion(this.questionList);
            }
            return(this.questionList);
        }

        public static selectPopUp(_type:string){
            var select = [];
            var popup = [];
            if(_type == "popup"){
                popup = AdverType.adverName.popup_name.concat();
            }else if(_type=="box"){
                popup = AdverType.adverName.box_name.concat();
            }
            while(select.length < 3){
                let rand = Math.floor(Math.random()*popup.length);
                select =  select.concat(popup.splice(rand, 1));
            }
            return(select);
        }
    }

    export class Popup extends egret.Sprite{
        public static GUNOPEN:string = "gunopen";
        private stageH: number;
        private stageW: number;

        private advertisement: egret.Bitmap;
        private shutdown_map: egret.Bitmap;

        public constructor(pop_name){
            super();
            this.stageH = egret.MainContext.instance.stage.stageHeight;
            this.stageW = egret.MainContext.instance.stage.stageWidth;
            this.createBackGroundImage();
            this.createAdvertisement(pop_name);
            this.createShutDown();
        }

        public createAdvertisement(pop_name: string){
            if(!this.advertisement){
                this.advertisement = new egret.Bitmap();
            }
            this.advertisement.texture = RES.getRes(pop_name);
            let scaleX = this.stageW / this.advertisement.width;
            this.advertisement.width = this.stageW;
            this.advertisement.height = scaleX * this.advertisement.height;
            this.advertisement.y = this.stageH/2 - this.advertisement.height/2;
            console.log("pop广告的width和height", this.advertisement.width);
            this.addChild(this.advertisement);
        }

        private createBackGroundImage(){
            var bg: egret.Shape = new egret.Shape();
            bg.graphics.clear();
            bg.graphics.beginFill(0x808080, 0.6);
            bg.graphics.drawRect( 0, 0, this.stageW, this.stageH );
            bg.graphics.endFill();
            this.addChild(bg);
        }

        public createShutDown(){

            this.shutdown_map = new egret.Bitmap();
            this.shutdown_map.texture = RES.getRes("shutdown_png");
            this.shutdown_map.width = 100;
            this.shutdown_map.height = 100;
            this.shutdown_map.x = this.stageW - this.shutdown_map.width - 20;
            this.shutdown_map.y = 20;

            this.addChild(this.shutdown_map);

            this.shutdown_map.touchEnabled = true;

            this.shutdown_map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shutdown, this);
        }

        private shutdown(){
            this.dispatchEventWith(Popup.GUNOPEN);
            this.removeChildren();
            this.removeFromParent();
        }

        private removeFromParent(){
            var _parent:DisplayObjectContainer=this.parent as DisplayObjectContainer;
            if(_parent&&_parent.contains(this))		_parent.removeChild(this);
            _parent=null;
        }
    }
    export class bgAdver extends egret.Sprite{
        private stageW: number = 0;
        private stageH: number = 0;
        private bg_name: Array<string>;
        private bg: egret.Bitmap;

        private bg_all_name:Array<string> = AdverType.adverName.bg_name.concat();

        private index: number = 0;
        public constructor(_index:number){
            super();

            this.stageH = egret.MainContext.instance.stage.stageHeight;
            this.stageW = egret.MainContext.instance.stage.stageWidth;

            this.bg_name = this.selectBG();

            for(let x of this.bg_name){
                GameData.uploadMessage[GameData.uploadMessage.length-1].push(this.bg_all_name.indexOf(x));
                console.log("push bg 广告出现", GameData.uploadMessage);
            }

            this.index = 0;

            if(!this.bg){
                this.bg = new egret.Bitmap();
                this.bg.texture = RES.getRes(this.bg_name[this.index%3]);
                this.bg.alpha = 0;
                this.addChild(this.bg);
                egret.Tween.get(this.bg).to({
                    alpha: 1
                }, 250)
            }else{
                var that = this;
                egret.Tween.get(this.bg).to({
                    alpha: 0
                }, 250).call(()=>{
                    that.bg.texture = RES.getRes(this.bg_name[this.index%3]);
                    egret.Tween.get(this.bg).to({
                        alpha: 1
                    }, 250);
                })
            }
            this.index++;
        }

        private selectBG(){
            var select = [];
            var banner = AdverType.adverName.bg_name.concat();
            while(select.length < 3){
                let rand = Math.floor(Math.random()*banner.length);
                select =  select.concat(banner.splice(rand, 1));
            }
            return(select);
        }

        public updateBG(index:number):number{
            if((index) % 3 == 0){
                if(!this.bg){
                    this.bg = new egret.Bitmap();
                    this.bg.texture = RES.getRes(this.bg_name[this.index%3]);
                    this.bg.alpha = 0;
                    this.addChild(this.bg);
                    var that=this;
                    egret.Tween.get(this.bg).to({
                        alpha: 1
                    }, 250).call(()=>{
                        that.index++;
                    })
                }else{
                    var that = this;
                    egret.Tween.get(this.bg).to({
                        alpha: 0
                    }, 250).call(()=>{
                        that.bg.texture = RES.getRes(this.bg_name[this.index%3]);
                        egret.Tween.get(this.bg).to({
                            alpha: 1
                        }, 250).call(()=>{
                            that.index ++;
                        });
                    })
                }

            }
            return this.index;
        }
    }

    export class AwardVideo extends egret.Sprite{
        private adver_sprit: egret.Sprite;

        public static TAP_VIDEO:string = "tap_video";

        private video: egret.Video;

        private intervalDuration:number = 1000; // duration between intervals, in milliseconds
        private timeCount: number = 15;
        private countDownTextField: egret.TextField;
        private intervalID_pro: number;

        private stageWidth: number;
        private stageHeight: number;

        private shutdown_choose: egret.Sprite;
        private awardAdver: egret.Bitmap;
        private shutdown_map: egret.Bitmap;

        private advername: Array<string>;  //选中的广告名字
        private index: number = 0;   // 目前进行道德广告index

        private awardLeftCount: egret.TextField;
        public constructor(){
            super();
            this.advername = this.selectVideo();
            this.stageHeight = egret.MainContext.instance.stage.stageHeight;
            this.stageWidth = egret.MainContext.instance.stage.stageWidth;
            this.index = 0;

            for(let x of this.advername){
                GameData.uploadMessage[GameData.uploadMessage.length-1].push(AdverType.adverName.video_name.indexOf(x));
                console.log("push video 广告出现", this.advername, GameData.uploadMessage);
            }

            this.addjili();
        }

        private selectVideo(){
            var select = [];
            var video = AdverType.adverName.video_name.concat();
            while(select.length < 3){
                let rand = Math.floor(Math.random()*video.length);
                select =  select.concat(video.splice(rand, 1));
            }
            return(select);
        }

        private addjili(){
            if(!this.awardAdver){
                this.awardAdver = new egret.Bitmap();
            }
            this.awardAdver.texture = RES.getRes("jili_png");
            this.awardAdver.scaleX = 0.7;
            this.awardAdver.scaleY = 0.7;
            this.awardAdver.x = this.stageWidth - this.awardAdver.width/2 - 60;
            this.awardAdver.y = 40;

            var circle = new egret.Shape()

            circle.graphics.beginFill( 0xFF4500, 1);
            circle.graphics.drawCircle( 0, 0, 25 );
            circle.graphics.endFill();

            circle.x = this.awardAdver.x + this.awardAdver.width/2 + 35;
            circle.y = this.awardAdver.y - 7;

            if(!this.awardLeftCount){
                this.awardLeftCount = new egret.TextField();
            }
            this.awardLeftCount.text = (3-this.index).toString();
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
        }

        private tapjili(){
            if(this.index>=3){
                this.awardAdver.touchEnabled = false;
            }else{
                this.createAdvertisement();
            }
        }

        public pauser(){
            if(this.video){
                this.video.pause();
                console.log("视频播放暂停")
            }
        }

        public player(){
            if(this.video){
                this.video.play();
            }
        }

        public createAdvertisement(){
            SoundControl.getIns().stop(MUSIC_BG);
            this.adver_sprit = new egret.Sprite();
            this.createBackGroundImage();

            this.addChild(this.adver_sprit);

            this.video = new egret.Video();

            this.video.width = this.stageWidth;                 //设置视频宽
            this.video.height = this.stageWidth * 9 / 16;                //设置视频高
            this.video.x = 0;                       //设置视频坐标x
            this.video.y = (this.stageHeight-this.video.height)/2;                       //设置视频坐标y
            this.video.fullscreen = false;          //设置是否全屏（暂不支持移动设备）
            this.video.poster = "resource/assets/loading.jpg"; //设置loding图
            this.video.load("resource/assets/Adver/video/"+this.advername[this.index%3]);
            this.adver_sprit.addChild(this.video);              //将视频添加到舞台

            this.index++;
            GameData.adver_sum = this.index;

            this.awardLeftCount.text = (3-this.index).toString();

            //监听视频加载完成
            this.video.once(egret.Event.COMPLETE,this.onLoad,this);
            //监听视频加载失败
            this.video.once(egret.IOErrorEvent.IO_ERROR,this.onLoadErr,this);

            this.createShutDown();
        }

        private createBackGroundImage(){
            var bg: egret.Shape = new egret.Shape();
            bg.graphics.clear();
            bg.graphics.beginFill(0x808080, 0.9);
            bg.graphics.drawRect( 0, 0, this.stageWidth, this.stageHeight );
            bg.graphics.endFill();
            this.adver_sprit.addChild(bg);
        }
        private onLoad(e: egret.Event) {
            this.createTimer();
            this.video.play();
        }
        private onLoadErr(e: egret.Event) {
            console.log("video load error happened");
        }

        public createTimer(){
            //创建一个计时器对象
            this.resertTimeout();

            if(!this.countDownTextField){
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
        }

        public SetIntervalExample() {
            this.intervalID_pro = egret.setTimeout(this.myRepeatingFunction,this,this.intervalDuration);
        }

        private myRepeatingFunction(obj:any): void {
            this.timeCount = this.timeCount - 1 ;
            if(this.timeCount >= 0){
                this.countDownTextField.text = this.timeCount.toString();
                this.intervalID_pro = egret.setTimeout(this.myRepeatingFunction,this,this.intervalDuration);
                // console.log("id是"+this.intervalID_pro.toString());
            }else{
                egret.clearTimeout(this.intervalID_pro);
                this.video.pause();
            }
        }

        public pauseTimeout(): number{
            egret.clearTimeout(this.intervalID_pro);
            return(this.timeCount);
        }

        public resertTimeout(){
            this.timeCount = 15;
            this.SetIntervalExample();
        }

        public createShutDown(){

            this.shutdown_map = new egret.Bitmap();
            this.shutdown_map.texture = RES.getRes("shutdown_png");
            this.shutdown_map.width = 100;
            this.shutdown_map.height = 100;
            this.shutdown_map.x = this.stageWidth - this.shutdown_map.width - 20;
            this.shutdown_map.y = 20;

            this.adver_sprit.addChild(this.shutdown_map);

            this.shutdown_map.touchEnabled = true;

            this.shutdown_map.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shutdown, this);
        }

        public shutdown(){
            if(this.pauseTimeout()>0){
                //create choose pannel。
                this.pauser();
                this.createChoosePannel();

            }else{
                this.removeFromParent();
                // 生命值加2
                this.dispatchEventWith(Popup.GUNOPEN);
            }
        }

        private removeFromParent(){
            SoundControl.getIns().play(MUSIC_BG,0,9999);
            this.dispatchEventWith(AwardVideo.TAP_VIDEO);
            this.removeChild(this.adver_sprit);
        }

        // 观看激励性视频广告时，如果时间未到，选择关闭，此时创建的关闭提醒窗口
        private createChoosePannel(){
            if(!this.shutdown_choose){
                this.shutdown_choose = new egret.Sprite();
            }
            this.shutdown_choose.removeChildren();

            this.shutdown_choose.width = this.stageWidth / 2;
            this.shutdown_choose.height = this.stageHeight / 6;
            this.shutdown_choose.x = (this.stageWidth - this.shutdown_choose.width)/2;
            this.shutdown_choose.y = this.stageHeight * 2 / 5;
            if(this.getChildIndex(this.shutdown_choose)>=0){}
            else{
                this.addChild(this.shutdown_choose);
            }

            var background:egret.Shape = new egret.Shape();
            background.graphics.clear();
            background.graphics.beginFill(0x000000, 1);
            background.graphics.drawRect( 0, 0, this.shutdown_choose.width, this.shutdown_choose.height );
            background.graphics.endFill();
            this.shutdown_choose.addChild(background);

            var textPanel: egret.TextField = new egret.TextField();
            textPanel.text = "尚未观看完毕，取消无法获得奖励";
            textPanel.textColor = 0xff0000;
            textPanel.size = 20;
            textPanel.width = this.shutdown_choose.width;
            textPanel.height = this.shutdown_choose.height/2;
            textPanel.textAlign = egret.HorizontalAlign.CENTER;
            textPanel.y = this.shutdown_choose.height/4 - 15;
            this.shutdown_choose.addChild(textPanel);

            var line1:egret.Shape = new egret.Shape();
            line1.graphics.lineStyle(1, 0xffffff);
            line1.graphics.moveTo(0, this.shutdown_choose.height/2);
            line1.graphics.lineTo(textPanel.width, this.shutdown_choose.height/2);
            this.shutdown_choose.addChild(line1);

            var button_cancel: egret.TextField = new egret.TextField();
            button_cancel.text = "取消观看";
            button_cancel.textColor = 0xA9A9A9;
            button_cancel.size = 30;
            button_cancel.width = this.shutdown_choose.width/2;
            button_cancel.height = this.shutdown_choose.height/2;
            button_cancel.textAlign = egret.HorizontalAlign.CENTER;
            button_cancel.y = this.shutdown_choose.height/2 + 30;
            button_cancel.x = 0;
            this.shutdown_choose.addChild(button_cancel);

            var line2:egret.Shape = new egret.Shape();
            line2.graphics.lineStyle(1, 0xffffff);
            line2.graphics.moveTo(textPanel.width/2, this.shutdown_choose.height/2);
            line2.graphics.lineTo(textPanel.width/2, this.shutdown_choose.height);
            this.shutdown_choose.addChild(line2);

            var button_continue: egret.TextField = new egret.TextField();
            button_continue.text = "继续观看";
            button_continue.textColor = 0x00FF00;
            button_continue.size = 30;
            button_continue.width = this.shutdown_choose.width/2;
            button_continue.height = this.shutdown_choose.height/2;
            button_continue.textAlign = egret.HorizontalAlign.CENTER;
            button_continue.y = this.shutdown_choose.height/2 + 30;
            button_continue.x = this.shutdown_choose.width/2;
            this.shutdown_choose.addChild(button_continue);

            var that = this;
            button_cancel.touchEnabled = true;
            button_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                that.removeChild(that.shutdown_choose);
                if(that.getChildIndex(that.shutdown_map)>=0){
                    that.removeChild(that.shutdown_map);
                }
                egret.clearTimeout(that.intervalID_pro);
                that.removeFromParent();
            }, this);

            button_continue.touchEnabled = true;
            button_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                that.removeChild(that.shutdown_choose);
                that.SetIntervalExample();
                that.player();
            }, this);
        }
    }

    export class bannerAdver extends egret.Sprite{
        private stageW: number = 0;
        private stageH: number = 0;
        private banner_name: Array<string>;
        private banner: Array<egret.Bitmap>;
        private circle: Array<egret.Shape>;

        private intervalDuration:number = 1000; // duration between intervals, in milliseconds
        private timeCount: number = 15;
        private intervalID: number;

        private banner_all_name:Array<string> = AdverType.adverName.banner_name.concat();
        private index: number = 0;

        private boxSquenceType: number = 0;   // 表示游戏类型

        public constructor(){
            super();

            this.stageH = egret.MainContext.instance.stage.stageHeight;
            this.stageW = egret.MainContext.instance.stage.stageWidth;

            this.banner_name = this.selectBanner();

            for(let x of this.banner_name){
                GameData.uploadMessage[GameData.uploadMessage.length-1].push(this.banner_all_name.indexOf(x));
                console.log("push banner 广告出现", this.banner_name, GameData.uploadMessage);
            }

            this.banner = [];
            this.circle = [];

            this.createCicle();
            this.createBanner();
            this.createTimer();
        }

        private selectBanner(){
            var select = [];
            var banner = AdverType.adverName.banner_name.concat();
            while(select.length < 3){
                let rand = Math.floor(Math.random()*banner.length);
                // console.log(banner.splice(rand, 1))
                select =  select.concat(banner.splice(rand, 1));
            }
            return(select);
        }

        public stopBanner(){
            egret.clearInterval(this.intervalID);
            console.log("清楚了倒计时")
        }

        private createBanner(){
            var i = 0;
            for(let x of this.banner_name){
                let bitmap:egret.Bitmap = new egret.Bitmap();
                bitmap.texture = RES.getRes(x);
                bitmap.width = this.stageW;
                bitmap.height = this.stageH / 7;
                bitmap.x = i*this.stageW;
                i++;
                this.banner.push(bitmap);
                this.addChild(bitmap);
            }
            this.circlePoll()
        }
        private createCicle(){
            this.circle = [];
            for(let i=0; i<this.banner.length; i++){
                let shp:egret.Shape = new egret.Shape();
                if((this.index%3) == i){
                    shp.graphics.beginFill( 0xDC143C, 1);
                }else{
                    shp.graphics.beginFill( 0xDCDCDC, 1);
                }
                shp.graphics.drawCircle( 0, 0, 10 );
                shp.x = this.stageW / 2 + (i-1)*30;
                shp.y = this.stageH / 8 - 30;
                shp.graphics.endFill();
                this.circle.push( shp );
            }
        }

        private createPoll(){
            this.removeChildren();
            for(let x of this.banner){
                x.x = Math.floor(x.x/this.stageW) * this.stageW;
                if(x.x < 0 ){
                    x.x = (this.banner.length-1)*this.stageW;
                }
                this.addChild(x);
            }
            // this.addChild(this.banner[this.index]);
            for(let x of this.banner){
                egret.Tween.get(x).to({
                    x: x.x - this.stageW,
                    y: x.y
                }, 499)
            };
            this.circlePoll();
        }

        private circlePoll(){
            this.createCicle();
            for(let x of this.circle){
                this.addChildAt(x, 20);
            }
            this.index = this.index + 1;
            GameData.adver_sum = this.index;

        }

        public createTimer(){
            //创建一个计时器对象
            this.intervalID = egret.setInterval(this.myRepeatingFunction,this,this.intervalDuration);
        }

        private myRepeatingFunction(obj:any): void {
            console.log('倒计时')
            if(this.timeCount >= 0){
                this.timeCount = this.timeCount - 1 ;
            }else{
                this.timeCount = 15;
                this.createPoll();
            }
        }
    }
}