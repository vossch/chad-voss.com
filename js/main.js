
// this is the target position for content scrolling
var contentTarget = 0;
var timelineTarget = 0;
var timelineLength = 0;

// used for touch deltas
var start = {x:0,y:0};

// an array of project info
var jobs = new Array();

// offset due to header
var offset = 200;

// timeline colors cycle
var timelineColors = ["49cb71", "a5cb14", "fed30c", "1ab4c6", "fc5d1b"];

// parse date string "M/YYYY" to decimal year
function parseStartDate(dateStr) {
	var parts = dateStr.split("/");
	var month = parseFloat(parts[0]);
	var year = parseFloat(parts[1]);
	return (month - 1) / 12 + year;
}

// get current date as decimal year
function getCurrentDecimalYear() {
	var now = new Date();
	var day = now.getDate();
	var month = now.getMonth(); // 0-indexed
	var year = now.getFullYear();
	return year + (day / 31 + month) / 12;
}

// calculate and apply timeline heights based on job start dates
function calculateTimelineHeights() {
	var jobElements = $('.job');
	var timelineElements = $('.timeline-project');
	var currentYear = getCurrentDecimalYear();

	jobElements.each(function(i) {
		var startDate = $(this).data('start');
		if (!startDate) return;

		var jobStart = parseStartDate(startDate);
		var jobEnd;

		if (i === 0) {
			// First/most recent job goes to current date
			jobEnd = currentYear;
		} else {
			// Other jobs go to the start of the previous job
			var prevStart = jobElements.eq(i - 1).data('start');
			jobEnd = parseStartDate(prevStart);
		}

		var jobLength = jobEnd - jobStart;
		var height = Math.round(jobLength * 100 - 18); // 100px per year, minus padding/border

		// Apply height and color to corresponding timeline element
		if (timelineElements.eq(i).length) {
			timelineElements.eq(i).css({
				'height': height + 'px',
				'border-right-color': '#' + timelineColors[i % timelineColors.length]
			});
		}
	});
}

// generate timeline ticks based on current year
function generateTimelineTicks() {
	var currentYear = getCurrentDecimalYear();
	var fullYear = new Date().getFullYear();
	var ticksContainer = $('#timeline-ticks');

	// Calculate margin-top to offset time
	var marginTop = -100 * (fullYear + 2 - currentYear);
	ticksContainer.css('margin-top', marginTop + 'px');

	// Clear existing ticks and regenerate
	ticksContainer.empty();

	for (var i = fullYear + 2; i > fullYear - 20; i--) {
		var displayYear = i - Math.round(i * 0.01) * 100;
		var yearStr = displayYear < 10 ? '0' + displayYear : '' + displayYear;
		ticksContainer.append('<div class="timeline-tick">' + yearStr + '</div>');
	}
}

// get job info to be used for scrolling
function updateJobs()
{
	// Temporarily reset timeline scroller to top for consistent measurements
	var currentScrollerTop = $('#timeline-scroller').css('top');
	$('#timeline-scroller').css('top', '0px');

	var i = 0;
	$('.job').each(function(){
		$(this).attr("id", i);
		var jobby = new Object();
		jobby.job = $(this);
		jobby.id = i;
		jobby.height = $(this).outerHeight();
		jobby.y = $(this).offset().top - offset;
		jobs[i] = jobby;
		i++;
	});

	i = 0;
	$('.timeline-project').each(function(){
		$(this).attr("id", i);
		jobs[i].timeJob = $(this);
		jobs[i].timeHeight = $(this).outerHeight();
		timelineLength += $(this).outerHeight();
		// Calculate with scroller at 0, so use 0 instead of contentTarget
		jobs[i].timeY = $(this).offset().top - offset;
		$(this).click(jobSelect);
		i++;
	});

	// Restore timeline scroller position
	$('#timeline-scroller').css('top', currentScrollerTop);
}

// do job scroll animation
function jobSelect(e)
{
	var i = $(this).attr("id");
	
	timelineTarget = -jobs[i].timeY;
	
	// derive contentTarget from timelineTarget
	contentTarget = -jobs[i].y;
	
	// start scrolling
	//animateScrolling();

	$('html, body').animate({
        scrollTop: -contentTarget
      }, 800, function(){});
}
/*
// use this function to scroll content by a fixed amount
function moveContentBy(dy)
{
	contentTarget += dy;
	constrainScrolling();
	updateTimelineTarget();
	animateScrolling();
}

// use this function to scroll to a spot on the y-axis
function moveContentTo(y){
	contentTarget = y;
	constrainScrolling();
	updateTimelineTarget();
	animateScrolling();
}

// constrain content scrolling
function constrainScrolling()
{
	// constrain scrolling
	contentTarget = Math.max(Math.min(contentTarget, 0), -$("#content").height() + $(window).height());
}*/

// new scroll handler
function updateScroll()
{
	contentTarget = -$(document).scrollTop();
	updateTimelineTarget();
	//$("#timeline").css({ top: -contentTarget});

	$("#timeline-scroller").css({ top: timelineTarget });
	
}


// gets job id based on content taret location
function getJobId()
{
	// If we're above the first job, return 0
	if (jobs.length > 0 && -contentTarget < jobs[0].y) {
		return 0;
	}

	for(var i = 0; i < jobs.length; i++)
	{
		if(i == jobs.length - 1)
		{
			return i;
		}
		if(-contentTarget >= jobs[i].y && -contentTarget < jobs[i + 1].y)
		{
			return i;
		}
	}

}

//update timeline target based on content target
function updateTimelineTarget()
{

	// get the current job index
	var j = getJobId();

	// get current job progress
	var progress = (-contentTarget - jobs[j].y) / jobs[j].height;

	// If we're above the first job, clamp progress to 0
	if (-contentTarget < jobs[0].y) {
		progress = 0;
	}

	if(j == jobs.length - 1)
	{
		// do something special for pogress through the last project
		progress = ((-contentTarget) - jobs[j].y) / (jobs[j].height + offset - $(window).height());

	}

	// Mobile: use proportional scroll mapping
	if (window.innerWidth <= 850) {
		var maxScroll = $("#content").height() - $(window).height();
		var scrollProgress = -contentTarget / maxScroll;
		var timelineHeight = $("#timeline-projects").height();
		timelineTarget = -scrollProgress * timelineHeight;
		timelineTarget = Math.max(Math.min(timelineTarget, 0), -timelineHeight);
	} else {
		// Desktop: use original per-job mapping
		timelineTarget = -(jobs[j].timeHeight * progress + jobs[j].timeY);
		timelineTarget = Math.max(timelineTarget, -$("#timeline-projects").height());
	}
}


// start scrolling animations
function animateScrolling()
{
	// stop animation
	//$("#content").stop();
	$("#timeline-scroller").stop();
	//$("body").stop();
		
		/*
	// restart it with new values
	$("#content").animate({
		top: contentTarget
		
		}, 500, 'easeOutCubic');
		*/
	
	$("#timeline-scroller").animate({
		top: timelineTarget
		
		}, 500, 'easeOutCubic');
}

function updateHeight()
{
	$("#timeline").height($(window).height());

	// Recalculate job positions after resize
	jobs = [];
	timelineLength = 0;
	updateJobs();
	updateScroll();
}



// set up everything
$(document).ready(function () {

	/*
    //disable touch scrolling and enable my custom scrolling
    $(document).bind('touchmove', function (e) {
        e.preventDefault();
        moveContentBy(e.originalEvent.touches[0].pageY - start.Y);
        start.Y = e.originalEvent.touches[0].pageY;
    });
    $(document).bind('touchstart', function (e) {
        e.preventDefault();
        start.x = e.originalEvent.touches[0].pageX;
        start.y = e.originalEvent.touches[0].pageY;
    });

    // set up mouse wheel scrolling
    $(document).mousewheel(function (event, delta, deltaX, deltaY) {
        moveContentBy(deltaY * 100);
    });

	*/

	// calculate timeline heights from job start dates
	calculateTimelineHeights();

	// generate timeline ticks based on current year
	generateTimelineTicks();

	// update height
	$(window).resize(updateHeight);
	updateHeight();

	// update job info for scrolling
	contentTarget = -$(document).scrollTop();
	updateJobs();

	// scrolling
	$(document).scroll( updateScroll );
	updateScroll();

});