(function($, window, document, undefined){  

$.fn.forma = function(options) {  

	var defaults = {
		"method": 'POST',
		"action": '#',
		"wrap": '',
		"attrs": {'class':'forma'}
	};
	var options = $.extend(defaults, options);  
	
	try{
		var handlebars_available = (Handlebars) ? true : false;
	}
	catch(e){
		var message = '<p>This plugin requires <a href="https://github.com/wycats/handlebars.js" target="_blank">Handlebars</a> templates to work.</p>';
		$(this).append(message);
		return undefined;
	}
	
	var Common = {
		init: function(){
			this.register_partials();
		},
		render: function(){
			var context = arguments[0],
				tag = arguments[1],
				template;
			
			template = Handlebars.compile(tag);
			return template(context);
		},
		register_partials: function(){
			var self = this;
			Handlebars.registerPartial('attrs', self.set_attributes );
		},
		set_attributes: function(context){
			var result = '',
				attributes = context.attrs;
			
			if(attributes){
				for (var attr in attributes){
					if ( attributes.hasOwnProperty(attr) ){
						result += ' '+attr+'="'+attributes[attr]+'"';
					}
				}
			}
			return result;
		},
		set_tags: function(){
			if (arguments){
				var types = arguments;
				
				for (var i=0, type; type = types[i]; i++){
					this[type] = this.text;
				}
			}
		},
		wrap: function(){
			var start_tag = this.wrapper,
				close_tag = '',
				splitted = start_tag.split(' '),
				sliced = splitted[0].slice(1);
			
			//No tag attributes found
			var no_attrs = (splitted.length === 1);
			if (no_attrs) {
				close_tag = '</'+sliced;
			}
			else {
				close_tag = '</'+sliced+'>';
			}
			this.wrapped_html = start_tag+this.inner_html+close_tag;
		},
		render_input: function(input, wrap){
			var self = this,
				input_obj = {},
				input_html = '',
				rendered_input = '',
				
				wrapper = input.wrap || wrap || false,
				wrapper_obj = {wrapped_html:'', inner_html:'', wrap:self.wrap, wrapper:''};
			
			try {
				input_html += self.render(input, TAGS['label']);
			} catch(e) {}
			try {
				input_html += self.render(input, TAGS[input.type]);
				
				if (wrapper && wrapper !== '') {
					wrapper_obj.inner_html = input_html;
					wrapper_obj.wrapper = wrapper;
					
					input_obj = wrapper_obj;
					input_obj.wrap.call(input_obj);
					input_html = input_obj.wrapped_html;
				}
				
				rendered_input = input_html;
			} catch(e) {
				console.log(e);
				rendered_input = '<p style="color:#f44">The selected input ['+input.type+'] is not available.</p>';
			}
				
			return rendered_input;
		},
		render_fieldset: function(fieldset, wrap){
			var self = this,
				inputs = fieldset.inputs,
				fieldset_obj = {},
				fieldset_html = '',
				legend_html,
				rendered_fieldset = [],
				
				wrapper = fieldset.wrap || wrap || false,
				wrapper_obj = {wrapped_html:'', inner_html:'', wrap:self.wrap, wrapper:''};
			
			legend_html = self.render(fieldset, TAGS['legend']);
			
			for(var i=0, input; input = inputs[i]; i++){
				rendered_fieldset.push( self.render_input(input, wrapper) );
			}
			rendered_fieldset = rendered_fieldset.join("");
			rendered_fieldset = legend_html+rendered_fieldset;
			
			fieldset_html = self.render(fieldset, TAGS['fieldset']);
			wrapper_obj.inner_html = rendered_fieldset;
			wrapper_obj.wrapper = fieldset_html;
			
			fieldset_obj = wrapper_obj;
			fieldset_obj.wrap();
			
			return fieldset_obj.wrapped_html;
		},
		get_rendered_collection: function(collections, wrap){
			var self = this,
				rendered_collection = [],
				is_fieldset = function() { return (this.fieldset) ? true : false; }
			
			for(var i=0, collection; collection = collections[i]; i++){
				collection.is_fieldset = is_fieldset;
				
				if ( collection.is_fieldset() ){
					rendered_collection.push( self.render_fieldset(collection, wrap) );
				}
				else{
					rendered_collection.push( self.render_input(collection, wrap) );
				}
			}
			
			return rendered_collection;
		}
	};
	Common.init();
	
	var TAGS = {
		form:		'<form action="{{action}}" method="{{method}}"{{> attrs}}>',
		fieldset:	'<fieldset {{> attrs}}>',
		legend:		'{{#if fieldset}}<legend>{{fieldset}}</legend>{{/if}}',
		label:		'<label {{#if for}}for="{{for}}"{{/if}}>{{#if required}}<em title="Required field">*</em>{{/if}}{{label}}</label>',
		text:		'<input {{#if for}}id="{{for}}"{{/if}} {{#if value}}value="{{value}}"{{/if}} type="{{type}}" {{> attrs}}/>',
		select:		'<select {{#if for}}id="{{for}}"{{/if}} {{> attrs}}>{{#if value}}<option value="">{{value}}</option>{{/if}}{{#if options}} {{#each options}}<option value="{{value}}" {{> attrs}}>{{#if inner_value}}{{inner_value}}{{else}}{{value}}{{/if}}</option>{{/each}} {{/if}}</select>',
		textarea:	'<textarea {{#if for}}id="{{for}}"{{/if}} {{> attrs}}>{{#if value}}{{value}}{{/if}}</textarea>'
	};
	Common.set_tags.call(TAGS, 'password', 'radio', 'checkbox', 'file', 'reset', 'submit', 'hidden');
	
	var forma = {};
	forma = (function(){
				var form = {},
					rendered_collections = [],
					wrapper_obj = {wrapped_html:'', inner_html:'', wrap:Common.wrap, wrapper:''};
					
				rendered_collections = Common.get_rendered_collection(options.collections, options.wrap);
				rendered_collections = rendered_collections.join('');
				
				wrapper_obj.inner_html = rendered_collections;
				wrapper_obj.wrapper = Common.render(options, TAGS['form']);
				
				form = wrapper_obj;
				form.wrap();
				
				return {html:form.wrapped_html};
			})();
			
	$(this).append(forma.html);
	return $(forma.html);
};

})(jQuery, this, this.document);
