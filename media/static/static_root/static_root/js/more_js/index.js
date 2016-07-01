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
});