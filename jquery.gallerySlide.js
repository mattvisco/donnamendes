/*!
 * jQuery wmuSlider v2.1.
 * 
 * Copyright (c) 2011 Brice Lechatellier
 * http://brice.lechatellier.com/
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

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

                var startPhotoWidth = slides[1].children[0].offsetWidth/2;

                var padRight = ( screenWidth - startPhotoWidth - slides[2].children[0].offsetWidth/8 );
                slides[1].style.paddingRight=padRight+"px"

                var slide0Width = slides[0].children[0].offsetWidth;
                padRight = ( screenWidth - startPhotoWidth - slide0Width/8 );

                var wrapperWidth = 0;
                for(var i = 0; i < slides.length-1; i++) {
                    if ( i != 1)
                        slides[i].style.paddingRight=padRight+"px"
                    wrapperWidth += slides[i].offsetWidth;
                }
                wrapperWidth += slides[slides.length-1].offsetWidth +1;

                var marginLeft = $this.width() - slides[0].offsetWidth - slides[1].children[0].offsetWidth;

                
                if ( !resizing )
                    slideAmount = slide0Width*7/8 + marginLeft;
                else {
                    var marginTop = Math.max(options.marginTopMin,$( window ).height()/2 - slides[0].children[0].offsetHeight/2);
                    $('.container').css({ marginTop: marginTop });
                    options.headerResize();
                }
                wrapper.css({
                    width: wrapperWidth,
                    marginLeft: marginLeft,
                    visibility: 'visible'
                });
                $this.scrollLeft(slideAmount);
                
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

            //TODO -- develop a clean way for the window to be resized and slideshow to still work well
            $(window).resize(resize);
            
                        
        });
    }
    
})(jQuery);