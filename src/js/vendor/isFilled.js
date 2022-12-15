function IsFilled() {
    var self = this;

    this.checkField = function (field) {
        var field = $(field),
            formField = field.closest('.field');

        if (field.val() !== '') {
            formField.addClass('filled');
        } else {
            formField.removeClass('filled');
        }
    };

    this.checkSelect = function (select) {
        var select = $(select),
            selectField = select.closest('.field');

        if (select.val() !== '') {
            $(select.data('select2').$container).addClass('filled');
            selectField.addClass('filled');
        }
    };

    this.checkAllFields = function (blockClass) {
        var formsFields;
        var selects;

        if (blockClass !== undefined) {
            formsFields = $(blockClass).find('.input, .textarea');
            selects = $(blockClass).find('.select2');
        } else {
            formsFields = $('.input, .textarea');
            selects = $('.select2');
        }

        formsFields.each(function (i) {
            self.checkField(formsFields[i]);
        });

        formsFields.on('input change', function () {
            self.checkField(this);
        });

        selects.each(function (i) {
            self.checkSelect(selects[i]);
        });

        selects.on('change', function () {
            self.checkSelect(this);
        });
    };

    this.init = function () {
        this.checkAllFields();
    };
}