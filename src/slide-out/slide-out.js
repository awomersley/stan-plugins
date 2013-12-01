/*
 * SlideOut
 */

(function($){
	
	// Define Global Vars
	var Selectors=[];

	/*
	 * Resize Listener for resizing slideshow height
	 */
	$(window).resize(function(){

		if(!Selectors.length) return;
		
		for(i in Selectors){
			
	        $(Selectors[i]).each(function(){

	        	settings=$(this).data('slideOut');

	    		if(!settings.devices[$('body').attr('data-current-device')] && settings.open){
	    			settings.reopen=true;
	    			methods['hide'].apply(this);
	    		}else if(settings.devices[$('body').attr('data-current-device')] && settings.reopen && settings.auto_reopen){
	    			settings.reopen=false;
	    			methods['show'].apply(this);
	    		}

	        });

	    }

	}).resize();

	/*
	 * Click Listeners
	 */
	$(window).ready(function(){
		
		// Show
		$("[data-toggle='slideout.show']").click(function(){

			return methods['show'].apply($($(this).attr('data-target')));

		});

		// Hide
		$("[data-toggle='slideout.hide']").click(function(){

			return methods['hide'].apply($($(this).attr('data-target')));

		});

		// Toggle
		$("[data-toggle='slideout.toggle']").click(function(){

			return methods['toggle'].apply($($(this).attr('data-target')));

		});

	});


	// Define Methods
	var methods={
	    
	    init: function(options){ 

			// Save selector in array
			Selectors.push(this.selector);
		    
			// Iterate Through Selectors
	    	return this.each(function(index){

	    		// Set this
				var $this=$(this);

	    		// Set Options
				var settings=$.extend({
					pos:'left',
					open:false,
					speed:300,
					auto_reopen:true,
					auto_close:false,
					devices:{ xs:true, sm:true, md:true, lg:true }
				},options);
				

		    	// Save settings
				$this.data('slideOut',settings);


				// Hide if not open or if not set for current device
				if(!settings.open || !settings.devices[$('body').attr('data-current-device')]){

					// Set CSS to closed position
					$this.css(methods['getPosValue'].apply(this,[settings.pos]));
				
				}else{

					// Turn on display
					$this.css({display:'block'});
				
				}

				// Set Mouseover listeners
				if(settings.auto_close){

					$(this).mouseover(function(){
						methods['clearTmr'].apply(this);
					}).mouseout(function(){
						methods['setTmr'].apply(this);
					});

				}
		    
		    });

	    },

	    getPosValue:function(pos){

	    	if(pos=='top' || pos=='bottom') val=$(this).outerHeight();
	    	if(pos=='left' || pos=='right') val=$(this).outerWidth();
			
			css={}
			css[pos]=val*-1;
			
			return css;

	    },

	    clearTmr:function(){

	    	settings=$(this).data('slideOut');
	    	clearTimeout(settings.tmr);

	    },

	    setTmr:function(){

	    	settings=$(this).data('slideOut');

	    	methods['clearTmr'].apply(this);

	    	$this=this;
    		settings.tmr=setTimeout(function(){ 
    			methods['hide'].apply($this);
    		},parseInt(settings.auto_close)*1000);

	    },

	    show:function(){

	    	settings=$(this).data('slideOut');

	    	if(settings.devices[$('body').attr('data-current-device')]){

	    		if(!settings.open){

		    		// Recalculate hidden position incase the height of div has changed
		    		css=methods['getPosValue'].apply(this,[settings.pos]);
		    		css['display']='block';
		    		$(this).css(css);

		    		// Set 0 position
			    	css={}
					css[settings.pos]=0;

					// Animate
			    	$(this).animate(css,settings.speed,function(){
			    		
			    		// Set open to true			
			    		settings.open=true;
			    	
			    	});

			    }

			    // Set auto close timer
		    	if(settings.auto_close) methods['setTmr'].apply(this);


		    	// Return false to stop default action
		    	return false;

	    	}else{

	    		// Return true to allow default action
	    		return true;
	    	
	    	}

	    },

	    hide:function(){

	    	settings=$(this).data('slideOut');

	    	if(settings.open){

		    	// Get CSS data
		    	css=methods['getPosValue'].apply(this,[settings.pos]);

		    	// Animate
		    	$(this).animate(css,settings.speed,function(){
		    		$(this).css({display:'none'});

		    		// Set open to false
		    		settings.open=false;

		    	});

		    	// Return false to stop default action
		    	return false;

		    }
			
	    },

	    toggle:function(){

	    	settings=$(this).data('slideOut');

	    	if(settings.open) return methods['hide'].apply(this);
	    	else return methods['show'].apply(this);
			
	    }
	
	};

 	$.fn.SlideOut=function(method){

		if(methods[method]){

			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));

		}else if( typeof method === 'object' || ! method ){

			return methods.init.apply( this, arguments );

		}else{

			$.error( 'Method ' +  method + ' does not exist on jQuery.Datatable' );

		}    
  
  	};

}(jQuery));