;(function(window,document,undefined){
	function ScrollBar() {
		var scrollBar = document.getElementsByClassName("scroll-bar");
		var scrollOut = document.getElementsByClassName("scroll-box")
		var scrollBox = document.getElementsByClassName("scroll-content");
		var scrollContent = document.getElementsByClassName("scroll-main");
		//变量
		this.scrollOut = scrollOut;
		this.scrollBar = scrollBar;
		this.scrollBox = scrollBox;
		this.scrollContent = scrollContent;
		//属性
		this.viewHeight = this.scrollBox[0].offsetHeight; //可视高度
		this.contentHeight = this.scrollContent[0].offsetHeight; //文档总高度
		this.barHeight = Math.floor(Math.pow(this.viewHeight,2)/this.contentHeight); //滚动条高度
	}
	ScrollBar.prototype = {
		initBar: function() {	//初始化滚动条
			this.scrollBar[0].style.height = this.barHeight + "px";
		},
		barMostTop: function() { //滚动条可滚动的最大距离
			return (this.viewHeight-this.barHeight);
		},
		conMostTop: function() { //内容滚动的最大距离
			var barMostTop = this.barMostTop();
			return (barMostTop / this.viewHeight * this.contentHeight)
		},
		conTop: function() { //内容距离顶部的高度
			return parseInt(this.scrollBar[0].style.top) / this.viewHeight * this.contentHeight;
		},
		barTop: function() {	//滚动条距离顶部的距离
			return parseInt(this.scrollBar[0].style.top || 0); 
		},
		contentScroll: function() { //内容滚动
			var mostTop = this.conMostTop(); 
			var contentTop = this.conTop();
			if(contentTop < 0) {
				this.scrollContent[0].style.top = 0;	
				return
			}
			else if(contentTop > mostTop) {
				this.scrollContent[0].style.top = -mostTop + "px";
				return	
			}
			else {
				this.scrollContent[0].style.top = -contentTop + "px";
			}
		},
		updatePosition: function(offset) {    //改变滚动条和内容位置
			var barMostTop = this.barMostTop(); //滚动条可滚动的最大距离
			var scrollTop = this.barTop(); //滚动条距离顶部的距离
			//滚动向上滚
			if(scrollTop <=0 && offset < 0) { //滚动条距离顶部小于0且向上滚动
				this.scrollBar[0].style.top = 0;
				return;
			}
			else if(scrollTop >= barMostTop && offset > 0) {
				this.scrollBar[0].style.top = barMostTop + "px";
				return;
			}
			else {
				this.scrollBar[0].style.top = this.barTop() + offset + "px" ;
			}
			//公式计算内容距离顶部的距离
			this.contentScroll();
		}, 	
		mouseWheel: function(event) {  //鼠标滚动移动方向和距离
			var offset = event.deltaY < 0 ? -10 : 10
			this.updatePosition(offset);
		},
		mouseMove: function(e) {   //移动鼠标移动方向和距离
			var y2 = e.clientY; 
			var offset = y2-self.y1;
			self.y1 = y2;
			this.updatePosition(offset);
		},
		start:function() {
			this.initBar();
			var self = this;
			this.y1  = null;
			this.scrollBar[0].onmousedown = function(event) {
				event.preventDefault();	
				self.y1 = event.clientY;
				var mouseMove = function(event) {
					self.mouseMove(event)
				}
				document.addEventListener("mousemove",mouseMove)
				document.addEventListener("mouseup",function(e) {
					document.removeEventListener("mousemove",mouseMove)
				})
			}
			self.scrollBox[0].addEventListener("mousewheel",function(event) {
				self.mouseWheel(event);
			})
		}
	}
	window.ScrollBar = ScrollBar;
}(window,document,undefined))

var bar = new ScrollBar;
bar.start();

