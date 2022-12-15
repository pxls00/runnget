function formMessages() {

    function genMessage(type, text) {
        var html = '',
            cssClasses = 'form-message';

        if(type && type !== ''){
            cssClasses += ' form-message--' + type;
        }

        html += '<div class="' + cssClasses + '">';
        html += '<p>' + text + '</p>';
        html += '</div>';
        
        return html;
    }

    function addMessage(form, messageHtml) {
        var messageEl = $(messageHtml);

        form.append(messageEl);
        messageEl.fadeIn();

        return messageEl;
    }

    function removeAfter(messageEl) {
        setTimeout(function () {
            messageEl.fadeOut(function () {
                messageEl.remove();
            });
        }, 5000);
    }
    
    this.showMessage = function (form, type, text) {
        var messageHtml = genMessage(type, text),
            messageEl = addMessage(form, messageHtml);
        removeAfter(messageEl);
    }

}
