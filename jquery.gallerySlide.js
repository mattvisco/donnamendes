;(function($) {


    
    $.fn.slider = function(options) {

        /* Default Options
        ================================================== */       
        var defaults = {
            slideToStart: 0,
            replaceText: "",
            initialized: false,
            slide: 'article'
        };
        var options = $.extend(defaults, options);
        
        return this.each(function() {

            /* Variables
            ================================================== */
            var $this = $(this);
            var currentIndex = options.slideToStart;
            var wrapper = $this.find('.slideWrapper');
            var defaultImage = $this.find('.default_image')[0];
            var slides = $this.find(options.slide);
            var slidesCount = slides.length;
            var resizing = false;
            var slideAmount = 0;
                
            // /* Resize Slider
            // ================================================== */ 
            var resize = function() {

                for(var i = 0; i < slides.length; i++) {
                    slides[i].style.paddingRight = 0 +"px"
                }

                var screenWidth = $this.width()/2;
                var startPhotoWidth = $(slides[1].children[1]).width()/2;
                var ratioSlide1 = 50/$(slides[2].children[1]).width()
                var padRight = ( screenWidth - startPhotoWidth - $(slides[2].children[1]).width()*ratioSlide1);
                slides[1].style.paddingRight=padRight+"px"
                var slide0Width = $(slides[0].children[1]).width();
                var ratioSlide0 = 50/slide0Width;
                padRight = ( screenWidth - startPhotoWidth - slide0Width*ratioSlide0);

                var wrapperWidth = 0;
                for(var i = 0; i < slides.length-1; i++) {
                    if ( i != 1)
                        slides[i].style.paddingRight=padRight+"px"
                    wrapperWidth += slides[i].offsetWidth;
                }
                wrapperWidth += slides[slides.length-1].offsetWidth +1;

                var marginLeft = $this.width() - slides[0].offsetWidth - slides[1].children[1].offsetWidth;
                var marginTop = Math.max(options.marginTopMin,$( window ).height()/2 - slides[0].children[1].offsetHeight/2);
                
                if ( !resizing )
                    slideAmount = slide0Width*(1-ratioSlide0) - slides[0].children[0].offsetHeight + marginLeft;
                else {
                    $('.container').css({ marginTop: marginTop });
                    options.headerResize();
                }

                
                wrapper.css({
                    width: wrapperWidth,
                    marginLeft: marginLeft,
                    visibility: 'visible'
                });
                $this.scrollLeft(slideAmount);

                for(var i = 0; i < slides.length-1; i++) {
                    if ( i != 1 ) {
                        var top =  $(slides[i].children[1]).height()/2 - $(slides[i].children[0]).width()/2;
                        var left = $(slides[i].children[1]).position().left + slideAmount - $(slides[i].children[0]).width();
                        $(slides[i].children[0]).css({
                            top: top,
                            left: left,
                            visibility: 'visible'
                        });
                    }
                }
                
            };

            /* Init Slider
            ================================================== */ 
            var init = function() {
                      
                wrapper.prepend($(slides[slidesCount-1]).clone());
                wrapper.prepend($(slides[slidesCount-2]).clone());
                slides = $this.find(options.slide);

                slides.css('float', 'left');  

                resize();
                resizing = true;
                $this.css({
                    overflow: 'scroll'
                })

                $(defaultImage).css( {cursor: "default"} );

                var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? 'DOMMouseScroll' : 'mousewheel'

                $('body').on(mousewheelevt, function(e) { // on scroll
                     var wheel=(/Firefox/i.test(navigator.userAgent))? e.originalEvent.detail*-20: e.originalEvent.wheelDelta
                     slideAmount = $this.scrollLeft() - wheel;
                     $this.scrollLeft(slideAmount);

                    if ($this[0].offsetWidth + $this[0].scrollLeft >= $this[0].scrollWidth) {
                        $this.scrollLeft(0);
                    } else if ($this[0].scrollLeft <= 0) {
                        $this.scrollLeft($this[0].scrollWidth);
                    }
                    return true;
                });
            }

            init();

            options.backButton.click(function(){
                $(window).off("resize", resize);
            });
                                      
            /* Bind Events
            ================================================== */
            // Resize
            $(window).resize(resize);
            
                        
        });
    }
    
})(jQuery);