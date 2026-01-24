<?php
	// read in json
	$file = file_get_contents("data/main.json");
	$data = json_decode($file);

	// check for mobile browser
	$mobile_browser = '0';
	 
	if (preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android)/i', strtolower($_SERVER['HTTP_USER_AGENT']))) {
		$mobile_browser++;
	}
	 
	if ((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') > 0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))) {
		$mobile_browser++;
	}    
	 
	$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
	$mobile_agents = array(
		'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
		'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
		'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
		'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
		'newt','noki','oper','palm','pana','pant','phil','play','port','prox',
		'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
		'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
		'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
		'wapr','webc','winw','winw','xda ','xda-');
	 
	if (in_array($mobile_ua,$mobile_agents)) {
		$mobile_browser++;
	}
	 
	if (strpos(strtolower($_SERVER['ALL_HTTP']),'OperaMini') > 0) {
		$mobile_browser++;
	}
	 
	if (strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'windows') > 0) {
		$mobile_browser = 0;
	}

?>
<!DOCTYPE html>
<html>
	
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Chad Voss - Portfolio</title>
    
    <link href="css/main.css" rel="stylesheet" type="text/css" />
    
	<script src="js/jquery.js"></script>
    <script src="js/jquery.easing.1.3.js"></script>
    <script src="js/jquery.mousewheel.js"></script>
    <script src="js/jquery.animate-colors-min.js"></script>
	<script src="js/main.js"></script>
    <?php if($mobile_browser > 0){ ?>
    <meta name="viewport" content="width=850">
    <?php }?>
</head>

<body style="background-color:#f8f8f8;">

<div id="wrapper">
	<div id="content"  style="top:0px;">
		
   		<!-- Header -->
    	<div id="header">
            <p class="font-bb">Chad Voss</p>
            <p class="font-b indent-0"><a href="data/other/voss.pdf">Resume</a></p>
            <p class="font-b indent-1"><a href="http://www.linkedin.com/in/chadvoss">Linked In</a></p>
            <p class="font-b indent-2"><a href="#">chad(at)chad-voss.com</a></p>
    	</div>
    	
    	<!-- Jobs -->
        <div id="jobs">
        	
        	<?php foreach($data->jobs as $job){ ?>
        	<div class="job">
            	<div class="job-title font-c"><?php echo $job->title; ?></div>
                
				<?php foreach($job->projects as $project){ ?>
                <div class="project">
                    <div class="project-header">
                        <p class="font-ab"><?php echo $project->title; ?></p>
                        <p class="font-a indent-0"><?php echo $project->subtitle; ?></p>
                        <p class="font-a indent-1"><?php echo $project->role; ?></p>
                        <p class="font-a indent-2"><?php echo $project->start; ?></p>
                        <p class="project-description font-d"><?php echo $project->description; ?></p>
                    </div>
                        
                    <div class="project-body">
                    
                    	<?php foreach($project->media as $media){ 
							if($media->type == "video"){?>
                        <div class="video" style="width:<?php echo $media->width?>px; height:<?php echo $media->height?>px;">
                            <video controls="true" width="<?php echo $media->width?>" height="<?php echo $media->height?>" poster="<?php echo $media->thumb;?>">
                            	<?php foreach($media->source as $src){?>
                                <source src="<?php echo $src->src;?>"></source>
                                <?php }?>
                            </video>
                            <!--<div class="video-controls">
                                <div class="video-play"></div >
                                <div class="video-pause" style="visibility:collapse"></div >
                            </div>-->
                        </div>
                        <?php } else {?>
                        <div class="image" style="width:<?php echo $media->width?>px; height:<?php echo $media->height?>px;">
                        	<img width="<?php echo $media->width?>" height="<?php echo $media->height?>" src="<?php echo $media->source?>"/>
                        </div>
                        <?php }}?>
                    </div>
                </div>
                <?php }?>
            </div>
            
            <?php } ?>
            
            
        <!-- end jobs -->
        </div>
        
    <!-- end content -->
    </div>
        
    <!-- Timeline -->
    <div id="timeline">
        
        <!-- Background -->
        <div id="timeline-bg"></div>

        <!-- Scrolling Content -->
        <div id="timeline-scroller" style="top: 0px; position: absolute;">

            <!-- set height to offset design -->
            <div id="timeline-offset" style="height: 200px;"></div>
            
            <?php
            $day = (float)date("d");
			$month = (float)date("m") - 1;
			$year = (float)date("Y");
			$colors = array("49cb71", "a5cb14", "fed30c", "1ab4c6","fc5d1b");
			$c = 0;
			 ?>
            
            <!-- Projects -->
            <div id="timeline-projects">
            
            	<?php for($i = 0; $i < count($data->jobs); $i++){ ?>
                <div class="timeline-project" onClick="void(0);" style="height: <?php
					$jobStart = explode("/",$data->jobs[$i]->start);
					$job0 = ((float)$jobStart[0] - 1)/ 12 + (float)$jobStart[1];
					$job1 = 0;
					if($i == 0)
					{
						$job1 = ($year + ($day/31 + $month)/12);
						
					}
					else
					{
						$jobEnd = explode("/",$data->jobs[$i - 1]->start);
						$job1 = ((float)$jobEnd[0] - 1)/ 12 + (float)$jobEnd[1];
					}
					$jobLength = $job1 - $job0;
					echo round($jobLength * 100 - 18); // subtract out padding and border
				?>px; border-right-color: #<?php
                echo $colors[$c];
				$c++; if($c > count($colors) - 1){ $c = 0;}
				?>">
                    <p class="font-ab"><?php echo $data->jobs[$i]->title ?></p>
                    <p class="font-a"><?php echo $data->jobs[$i]->company ?></p>
                </div>
                
                <?php }?>
            </div>
            
            <!-- Timeline Ticks (set top margin to offset time) -->
            <div id="timeline-ticks" style="margin-top:-<?php echo 100*($year+2-($year + ($day/31 + $month)/12)); ?>px">
            	<?php for($i =$year + 2; $i > $year - 20; $i--){?>
            	<div class="timeline-tick"><?php
            		
            		$year =  $i - round($i * 0.01) * 100;
            		if($year < 10)
					{
						echo "0" . $year;
					}else{echo $year;}
            		?></div>
                <?php }?>
            </div>
            
        </div>
        
        <!-- Scroller UI -->
        <div id="timeline-scroller-ui"></div>
        
    </div>
    
</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-43450062-2', 'chad-voss.com');
  ga('send', 'pageview');

</script>
</body>

</html>