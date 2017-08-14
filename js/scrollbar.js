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
		mouseWheel: function(event) {
			var barMostTop = this.barMostTop(); //滚动条可滚动的最大距离
			var scrollTop = this.barTop(); //滚动条距离顶部的距离
			//滚动向上滚
			if(event.deltaY < 0) {
				if(scrollTop <= 0) {
					this.scrollBar[0].style.top = 0;
					return;
				}
				this.scrollBar[0].style.top = (this.barTop() - 10) + "px" ;
			}
			if(event.deltaY < 0 && scrollTop <=0 ) {
				this.scrollBar[0].style.top = 0;
				return;
			}
			else {
				if(scrollTop >= barMostTop) {
					this.scrollBar[0].style.top = barMostTop + "px";
				}
				else {
					this.scrollBar[0].style.top = (this.barTop() + 10) + "px" ;
				}
			}
			//公式计算内容距离顶部的距离
			this.contentScroll();
		},
		mouseMove: function(e) {
			var barMostTop = this.barMostTop(); //滚动条可滚动的最大距离
			var scrollTop = this.barTop(); //滚动条距离顶部的距离
			var y2 = e.clientY; 
			var direction = y2-self.y1;
			//不允许滚动条在可视范围内滚动
			if( scrollTop <= 0 && direction < 0) {
				this.scrollBar[0].style.top = 0;
				return;
			}
			else if(scrollTop >= barMostTop && direction > 0) {
				this.scrollBar[0].style.top = barMostTop + "px";
				return;
			}
			else {
				this.scrollBar[0].style.top = this.barTop() + direction + "px";
			}
			self.y1 = y2;
			//内容区滚动	
			//公式计算内容距离顶部的距离
			this.contentScroll();
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

