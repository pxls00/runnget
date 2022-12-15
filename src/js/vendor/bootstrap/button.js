(function($) {
    $.fn.button = function(action) {
        if (action === 'loading' && this.data('loading-text')) {
            this.data('original-text', this.html()).html(this.data('loading-text')).prop('disabled', true);
        }
        if (action === 'reset' && this.data('original-text')) {
            this.html(this.data('original-text')).prop('disabled', false);
        }
    };
}(jQuery));
