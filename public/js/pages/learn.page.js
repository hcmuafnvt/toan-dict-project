'use strict';

function check() {
    $('.btn-check').on('click', function(e) {
        e.preventDefault();
        var $self = $(this);
        var $questionWrapper = $self.parents('.question-container');

        if($self.data('checked') === 'true') {
            $questionWrapper.fadeOut(500, function() {
                $(this).next().fadeIn(500);
            });
        } else {
            var userAnswer = $questionWrapper.find('.txt-answer').val().trim();
            var answer = $questionWrapper.find('.hdfAnswer').val().trim();
            $self.data('checked', 'true').text('Continue');
            if(userAnswer === answer) {
                $questionWrapper.find('.hdfAnswer').data('correct', 'true');            
                $('#notice').find('.correct').removeClass('hide');
                $('#notice').find('.incorrect').addClass('hide');
                $('#notice').find('.btn-ignore').hide();
            } else {
                $('#notice').find('.correct').addClass('hide');
                $('#notice').find('.incorrect').removeClass('hide');
                $('#notice').find('.incorrect').text('Correct is : ' + $questionWrapper.find('.hdfAnswer').val());
                $('#notice').find('.btn-ignore').hide();
            }
        }        
    });
}

function init() {
    check();
}

module.exports = {
    init: init
}