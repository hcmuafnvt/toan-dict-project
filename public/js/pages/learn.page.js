'use strict';

function resetNotice() {
    var $notice = $('#notice');
    $notice.find('.correct').addClass('hide');
    $notice.find('.incorrect').addClass('hide').text('');
    $notice.find('.btn-ignore').show();
    $('.btn-check').text('Check');
}

function check() {
    var arrQuestions = $('.question-container').toArray(), qIndex = 1;
    $('.btn-check').on('click', function (e) {
        e.preventDefault();
        var $self = $(this),
            $questionContainer = $self.parents('.question-container'),                       
            $hdfAnswer = $questionContainer.find('.hdfAnswer');

            console.log(arrQuestions);

        if ($self.text() === 'Check') {
            var userAnswer = '';
            // get userAnswer
            if($questionContainer.data('type') === 1) {
                userAnswer = $questionContainer.find('input[type=radio]:checked').val().trim().toLowerCase();
            }
            if($questionContainer.data('type') === 2 || $questionContainer.data('type') === 3 || $questionContainer.data('type') === 4) {
                userAnswer = $questionContainer.find('.txt-answer').val().trim();
            }            

            // answer
            var answer = $hdfAnswer.val().trim().toLowerCase();
            
            if (userAnswer === answer) {
                $questionContainer.addClass('passed');
                $('#notice').find('.correct').removeClass('hide');
                $('#notice').find('.incorrect').addClass('hide');
                $('#notice').find('.btn-ignore').hide();
            } else {                
                $('#notice').find('.correct').addClass('hide');
                $('#notice').find('.incorrect').removeClass('hide');
                $('#notice').find('.incorrect').text('Correct is : ' + $questionContainer.find('.hdfAnswer').val());
                $('#notice').find('.btn-ignore').hide();
            }          

            $self.text('Continue');
        } else {
            $questionContainer.fadeOut(500, function () {                
                resetNotice();
                if(arrQuestions.length > qIndex) {
                    $(arrQuestions[qIndex]).fadeIn(500);
                    qIndex++;
                } else {
                    if($('.question-container:not(.passed)').length > 0) {
                        arrQuestions = $('.question-container:not(.passed)').toArray();
                        qIndex = 1;
                         $('.question-container:not(.passed):first').fadeIn(500);
                    } else {
                        $('#finish').removeClass('hide');
                    }                        
                }                             
            });
        }
    });
}

function playSound() { 
    $('.sound').on('click', function(e) {
        e.preventDefault();
        var audio = new Audio($(this).data('src'));
        audio.play();
    })
}

function init() {
    check();
    playSound();
}

module.exports = {
    init: init
}