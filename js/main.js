
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

// get job info to be used for scrolling
function updateJobs()
{
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
		jobs[i].timeY = $(this).offset().top - offset + contentTarget;
		$(this).click(jobSelect);
		i++;
	});
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
	if(j == jobs.length - 1)
	{
		// do something special for pogress through the last project
		progress = ((-contentTarget) - jobs[j].y) / (jobs[j].height + offset - $(window).height());
		
	}
	
	
	// find timeline Target
	timelineTarget = -(jobs[j].timeHeight * progress + jobs[j].timeY);
	timelineTarget = Math.max(timelineTarget, -$("#timeline-projects").height());
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