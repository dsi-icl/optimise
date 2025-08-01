(function ($) {
    'use strict';
    $(function () {
        var b = $(window),
            c = $(document.body);
        c.scrollspy({
            target: '.bs-docs-sidebar'
        }), b.on('load', function () {
            c.scrollspy('refresh');
        }), $('.bs-docs-container [href="#"]').click(function () {
            $.preventDefault();
        }), setTimeout(function () {
            var b = $('.bs-docs-sidebar');
            b.affix({
                offset: {
                    top: function () {
                        var c = b.offset().top,
                            d = parseInt(b.children(0).css('margin-top'), 10),
                            e = $('.bs-docs-nav').height();
                        return this.top = c - e - d;
                    },
                    bottom: function () {
                        return this.bottom = $('.bs-docs-footer').outerHeight(!0);
                    }
                }
            });
        }, 100), setTimeout(function () {
            $('.bs-top').affix();
        }, 100);
    });
    // @ts-ignore
    // eslint-disable-next-line no-undef
}(jQuery));
