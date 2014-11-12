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
            var defaultImage = $this.find('.default_image');
            var slides = $this.find(options.slide);
            var slidesCount = slides.length;
                
            // /* Resize Slider
            // ================================================== */ 
            var resize = function() {

                for(var i = 0; i < slides.length; i++) {
                    slides[i].style.paddingRight = 0 +"px"
                }

                var screenWidth = $this.width()/2;
                var startPhotoWidth = slides[1].children[0].offsetWidth/2;

                var padRight = ( screenWidth - startPhotoWidth - slides[2].children[0].offsetWidth/8 );
                var wrapperWidth = padRight;
                slides[1].style.paddingRight=padRight+"px"

                var slide0Width = slides[0].children[0].offsetWidth;
                padRight = ( screenWidth - startPhotoWidth - slide0Width/8 );
                wrapperWidth += padRight*slides.length-2

                for(var i = 0; i < slides.length-1; i++) {
                    if ( i != 1)
                        slides[i].style.paddingRight=padRight+"px"
                    wrapperWidth += slides[i].children[0].offsetWidth;
                }

                var marginLeft = $this.width() - slides[0].offsetWidth - slides[1].children[0].offsetWidth;
                var startPosition = slide0Width*7/8 + marginLeft;
                wrapper.css({
                    width: wrapperWidth,
                    marginLeft: marginLeft,
                    visibility: 'visible'
                });
                $this.scrollLeft(startPosition);
            };

            /* Init Slider
            ================================================== */ 
            var init = function() {

                slides.css('float', 'left');        

                wrapper.prepend($(slides[slidesCount-1]).clone());
                wrapper.append($(slides[0]).clone());
                slides = $this.find(options.slide);

                resize();
                $this.css({
                    overflow: 'scroll'
                })

                $('body').bind('mousewheel', function(e) { // on scroll
                    $this.scrollLeft($this.scrollLeft() - e.originalEvent.wheelDelta);
                    if ($this[0].offsetWidth + $this[0].scrollLeft >= $this[0].scrollWidth) {
                        $this.scrollLeft(0);
                        // wrapper.css({
                        //     marginLeft: $this.width() - slides[0].offsetWidth - slides[1].children[0].offsetWidth
                        // });
                    } else if ($this[0].scrollLeft <= 0) {
                        $this.scrollLeft($this[0].scrollWidth);
                        // wrapper.css({
                        //     marginLeft: $this.width() - slides[0].offsetWidth - slides[1].children[0].offsetWidth
                        // });
                    }
                    return false; // prevent body scrolling
                });
            }

            defaultImage.click(function(){
                if (!options.initialized) {
                    init();            
                    options.initialized = true;
                }
            })
                                                
            /* Bind Events
            ================================================== */
            // Resize

            //TODO -- develop a clean way for the window to be resized and slideshow to still work well
            //$(window).resize(resize);

                        
        });
    }
    
})(jQuery);