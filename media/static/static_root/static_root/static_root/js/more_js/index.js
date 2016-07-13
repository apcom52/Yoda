$(function() {
	var commentHtml = $('#addFeedComment').html();

	$('body').on('click', '#commentButton', function() {
		var feed_parent = $(this).parent().parent();
		console.log(feed_parent.find('.card__footer'));
		if (feed_parent.find('.card__footer').length == 0) {
			feed_parent.append('<div class="card__footer">' + commentHtml + '</div>');
			var commentArea = feed_parent.find('.card__footer');
			commentArea.hide().slideDown();
		} else {
			feed_parent.find('.card__footer').remove();
		}		
	});

	/*$('#sendPostForm').submit(function(e) {
		e.preventDefault();
		console.log($('#sendPostForm').val());
		return false;
	});*/

	$('#feed_addpost_more_attachments').click(function() {
		$('#feed_addpost_attach_note').toggle(300);
		$('#feed_addpost_attach_poll').toggle(300);
	});

	var addFeedEventAttachment = new Select($('#feed_addpost_event_attachment_select'), ['Хоздень', 'Ботинки', 'Васька']);

	$('#sendPost').click(function() {
		console.log('start posting');
		$('body #postMessage').remove();
		var type = 0;
		if (type == 0) {
			var value = $('.postValueText').val();
			console.log(value);
			if (value.length < 2) {
				$('#postContent').append('<div class="red-fg" id="postMessage">Сообщение должно быть не менее 2-х символов</div>');
			} else {
				$('#sendPost').attr('disabled', true).text('Сохранение...');
				$.ajax({
					type: "POST",
					url: "/api/feed/",
					data: {
						type: 0,
						value: value
					},
					success: function(data) {
						console.log('success');
						console.log(data);
						$('#sendPost').html('<i class="flaticon-ok bold"></i> Отправлено');
						setTimeout(function() {
							$('#sendPost').attr('disabled', false).html('ОТПРАВИТЬ');
						}, 1500);
						exp.add(1);
					},
					error: function(data) {
						$('#postContent').append('<div class="red-fg" id="postMessage">' + data + '</div>');
						console.log(data);
					}
				});
			}
		}
	});


				/*$.post('/api/feed', {
					type: 0,
					value: value
				}, function (data) {
					$('#postContent').append('<div class="red-fg" id="postMessage">' + data + '</div>');
					$('#sendPost').addClass('button--color-green').html('<i class="flaticon-ok bold"></i>&nbsr;Отправлено');
					setTimeout(function() {
						$('#sendPost').attr('disabled', false).removeClass('button--color-green').html('Отправить');
					}, 1500);
				});*/
		/*	}
		}
	});*/
});