/*!
 * jQuery wmuSlider v2.1
 * 
 * Copyright (c) 2011 Brice Lechatellier
 * http://brice.lechatellier.com/
 *
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {


    
    $.fn.wmuSlider = function(options) {

        /* Default Options
        ================================================== */       
        var defaults = {
            animation: 'slide',
            animationDuration: 600,
            slideToStart: 0,
            navigationControl: true,
            previousText: 'Previous',
            nextText: 'Next',
            slide: 'article',
            items: 1
        };
        var options = $.extend(defaults, options);
        
        return this.each(function() {

            /* Variables
            ================================================== */
            var $this = $(this);
            var currentIndex = options.slideToStart;
            var wrapper = $this.find('.wmuSliderWrapper');
            var defaultImage = $this.find('.default_image');
            var slides = $this.find(options.slide);
            var slidesCount = slides.length;
            
            /* Load Slide
            ================================================== */ 
            var loadSlide = function(index, infinite) {
                currentIndex = index;
                var slide = $(slides[index]);
                $this.animate({ height: slide.innerHeight() });
                if (options.animation == 'fade') {
                    slides.css({
                        position: 'absolute',
                        opacity: 0
                    });
                    slide.css('position', 'relative');
                    slide.animate({ opacity:1 }, options.animationDuration, function() {
                        isAnimating = false;
                    });
                } else if (options.animation == 'slide') {
                    if (!infinite) {
                        wrapper.animate({ marginLeft: -$this.width() / options.items * index }, options.animationDuration, function() {
                            isAnimating = false;
                        });
                    } else {
                        if (index == 0) {
                            wrapper.animate({ marginLeft: -$this.width() / options.items * slidesCount }, options.animationDuration, function() {
                                wrapper.css('marginLeft', 0);
                                isAnimating = false;
                            });
                        } else {
                            wrapper.css('marginLeft', -$this.width() / options.items * slidesCount);
                            wrapper.animate({ marginLeft: -$this.width() / options.items * index }, options.animationDuration, function() {
                                isAnimating = false;
                            });
                        }
                    }
                }
                                                    
                // Trigger Event
                $this.trigger('slideLoaded', index); 
            };
            
            
            /* Navigation Control
            ================================================== */
            var navigation = function() {
                if (options.navigationControl) {
                    var prev = $('<a class="wmuSliderPrev">' + options.previousText + '</a>');
                    prev.click(function(e) {
                        e.preventDefault();
                        if (currentIndex == 0) {
                            loadSlide(slidesCount - 1, true);
                        } else {
                            loadSlide(currentIndex - 1);
                        }
                    });
                    $this.append(prev);  

                    var next = $('<a class="wmuSliderNext">' + options.nextText + '</a>');
                    next.click(function(e) {
                        e.preventDefault();
                        if (currentIndex + 1 == slidesCount) {    
                            loadSlide(0, true);
                        } else {
                            loadSlide(currentIndex + 1);
                        }
                    });       
                    $this.append(next);
                } else {
                    $( ".wmuSliderPrev" ).remove();
                    $( ".wmuSliderNext" ).remove();
                }
            }
            
            // var navigation = function() {
            //     wrapper.css('marginLeft', -$this.width() / options.items * slidesCount);
            //     // currentIndex = index;
            //     // var slide = $(slides[index]);
            //     // $this.animate({ height: slide.innerHeight() });
            //     // if (currentIndex == 0) {
            //     //     wrapper.animate({ marginLeft: -$this.width() / options.items * index }, options.animationDuration, function() {
            //     //             isAnimating = false;
            //     //         });
            //     // }
            // }
                        
            /* Resize Slider
            ================================================== */ 
            var resize = function() {
                var slide = $(slides[currentIndex]);
                $this.animate({ height: slide.innerHeight() });
                if (options.animation == 'slide') {
                     //slides.css({width: $this.width() / options.items});
                     //slides.css({paddingLeft: $this.width()-1000})
                     //slides.css({paddingRight: $this.width()-1000})
                    for(var i = 0; i < slides.length; i++) {
                        var padRight = 0;
                        var padLeft = 0;
                        if ( i != slides.length-1 )
                            padRight = ( $this.width()/2 - slides[i].clientWidth/2 - slides[i+1].clientWidth/4 ) / 2
                        if ( i != 0 )
                            padLeft = ( $this.width()/2 - slides[i].clientWidth/2 - slides[i-1].clientWidth/4 ) / 2
                        slides[i].style.paddingLeft=padLeft+"px"
                        slides[i].style.paddingRight=padRight+"px"
                    }
                    wrapper.css({
                        marginLeft: -500,
                        width: $this.width() * slides.length
                    });                    
                }    
            };
            
            
            /* Init Slider
            ================================================== */ 
            var init = function() {
                var slide = $(slides[currentIndex]);
                var img = slide.find('img');
                img.load(function() {
                    wrapper.show();
                    $this.animate({ height: slide.innerHeight() });
                });
                if (options.animation == 'fade') {
                    slides.css({
                        position: 'absolute',
                        width: '100%',
                        opacity: 0
                    });
                    $(slides[currentIndex]).css('position', 'relative');
                } else if (options.animation == 'slide') {
                    if (options.items > slidesCount) {
                        options.items = slidesCount;
                    }
                    slides.css('float', 'left');                    
                    slides.each(function(i){
                        var slide = $(this);
                        slide.attr('data-index', i);
                    });
                    wrapper.prepend($(slides[slidesCount-1]).clone());
                    for(var i = 0; i < options.items; i++) {
                        wrapper.append($(slides[i]).clone());
                    }
                    slides = $this.find(options.slide);
                }
                resize();
                
                $this.trigger('hasLoaded');
                
                loadSlide(currentIndex);
            }

            init();

            defaultImage.click(function(){
                navigation();
                options.navigationControl = !options.navigationControl;
            })
                                                
            /* Bind Events
            ================================================== */
            // Resize
            $(window).resize(resize); //may not be needed
            
            //dont think this is needed
            // // Load Slide
            // $this.bind('loadSlide', function(e, i) {
            //     clearTimeout(slideshowTimeout);
            //     loadSlide(i);
            // });
                        
        });
    }
    
})(jQuery);