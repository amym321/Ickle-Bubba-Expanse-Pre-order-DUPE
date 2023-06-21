

    (function( jQuery ){
  var $module = jQuery('#m-1682498763387').children('.module');
  $module.gfV3Product();
})( window.GemQuery || jQuery );
  
    
  
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1682500799278').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1682506196483').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    (function( jQuery ){
  var $module = jQuery('#m-1682498763317').children('.module');
  $module.gfV3ProductCartButton({ onItemAdded: function(data) {}});
})( window.GemQuery || jQuery );
  
    
  
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1682509243548').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1682498763350').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  (function( jQuery ){
  // var $module = jQuery('#m-1679325869592').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
    
  
    
  
    (function(jQuery) {
    var $module = jQuery('#m-1682498763324').children('.module');
    $module.gfV3ProductPrice({
        displayCurrency: true
    });
})(window.GemQuery || jQuery);
  (function(jQuery) {
  var $module = jQuery('#m-1682498763297').children('.module');
  var swatchText = $module.attr('data-swatch-text') != undefined ? $module.attr('data-swatch-text') : '1';
  $module.gfV3ProductSwatches({
    swatchText: swatchText,
    onSwatchSelected: function(variant, $swatch) {}
  });
})(window.GemQuery || jQuery);(function(jQuery) {
  var $module = jQuery('#m-1682498763296').children('.module');
  var swatchText = $module.attr('data-swatch-text') != undefined ? $module.attr('data-swatch-text') : '1';
  $module.gfV3ProductSwatches({
    swatchText: swatchText,
    onSwatchSelected: function(variant, $swatch) {
      document.dispatchEvent(new CustomEvent('variant:change', {
        detail : {
          variant: variant
        }
      }));
    }
  });
})(window.GemQuery || jQuery);
    (function( jQuery ){
  // var $module = jQuery('#m-1682500864127').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    (function( jQuery ){
  // var $module = jQuery('#m-1682498763259').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    (function( jQuery ){
  try {
    var $module = jQuery('#m-1682498763320').children('.module');
    var single = $module.attr('data-single');
    var openDefault = $module.attr('data-openDefault');
    var openTab = $module.attr('data-openTab');
    var mode = jQuery('.gryffeditor').hasClass('editing') ? 'dev' : 'production';

    if(openDefault == 0 || openDefault == '0') {
      openTab = '0';
    }

    $module.gfAccordion({
      single: single,
      openTab: openTab,
      mode: mode,
      onChanged: function() {	
        // Fix (P) Desc read more bug	
        $module.find('.module-wrap[data-label="(P) Description"]').each(function(index, el) {	
          if (jQuery(el).children('.module').data('gfv3productdesc') != undefined) {	
            jQuery(el).children(".module").data("gfv3productdesc").initReadMore();	
          }	
        })	
      }
    });

    var borderColor = $module.attr('data-borderColor');
    var borderSize = $module.attr('data-borderSize');

    $module.children('[data-accordion]').children('[data-control]').css('border-bottom', borderSize + ' solid ' + borderColor);
    $module.children('[data-accordion]').children('[data-content]').children().css('border-bottom', borderSize + ' solid ' + borderColor);
  } catch(err) {}
})( window.GemQuery || jQuery );
  
    
  
    (function( jQuery ){
  var $module = jQuery('#m-1682498763250').children('.module');
  $module.gfV3ProductDesc();
})( window.GemQuery || jQuery );
  
    
  (function( jQuery ){
  // var $module = jQuery('#m-1682498763323').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1682498763252').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  
    
  
    
  
    
  
    
  
    (function( jQuery ){
  // var $module = jQuery('#m-1682501084243').children('.module');
  // You can add custom Javascript code right here.
})( window.GemQuery || jQuery );
  