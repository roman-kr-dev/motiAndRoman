define(['jQuery','Mustache','Helpers'],function($, Mustache, Helpers){

	var rxInclude = /\@Include\[\"(.*?)\"\]\;/gi;
	var oRenderedTemplates = {};

	return {
		

		Expand: function(Template, Dynamics, fCallback) {

			var This = this;

			if (oRenderedTemplates[Template]) {
				fCallback(oRenderedTemplates[Template]);
				return;
			}

			Helpers.Series([
				function(f) {
					require(
						[
							'modules/text!../templates/html/'+Template+'.html'
						],
						f
					);

				},
				function(f,sTemplateContent) {

					var aFoundedIncludes = [];

					sTemplateContent.replace(rxInclude, function(s1,s2) {
						var sInclude = s2;
						//if (sInclude.indexOf("Dynamic!") == 0)
						//	aFoundedIncludes.push(Dynamics[sInclude.substring("Dynamic!".length,sInclude.length)]);

						
						
						aFoundedIncludes.push(sInclude);
					});

					

					Helpers.Series([
						function(f2,a) {						
						
							if (!a.length) {
								f2();
								return;
							}

							This.Expand(a[0],null,function(s) {
								oRenderedTemplates[a[0]] = s;
								a.shift();
								if (a.length) 
									f2(a,true);
								else
									f2();
							});
						},
						function(f2) {

							//alert(JSON.stringify(sTemplateContent));
							
							
							fCallback(
								sTemplateContent.replace(rxInclude, function(s1,s2) {
									var sInclude = s2;
									//if (sInclude.indexOf("Dynamic!") == 0)
									//	return oRenderedTemplates[Dynamics[sInclude.substring("Dynamic!".length,sInclude.length)]];
									return oRenderedTemplates[sInclude];				
								})
							);

						}
					],aFoundedIncludes);
					
				


				}

			]);



		},
		Render: function(Template, Model, fCallback, options) {

			var params = {
				dynamics: null,
				wrapper: null
			}
			$.extend(true,params,options);

			var sWrapperBefore = params.wrapper ? "{{#"+params.wrapper+"}}" : "";
			var sWrapperAfter = params.wrapper ? "{{/"+params.wrapper+"}}" : "";

			this.Expand(Template, params.dynamics, function(ExpandedTemplate) {
				fCallback(Mustache.to_html(sWrapperBefore+ExpandedTemplate+sWrapperAfter, Model));
			});
		},

		RenderAndUpdate: function(sTemplate,options,fCallback) { // smarted way to render templates

			var settings = {
				sWrapper: null,
				oDynamics: null,
				model: null,
				to: null,
				mode: "replace"
			};
			$.extend(true,settings,options);

			this.Render(sTemplate,settings.model,function(s) {

				if (settings.to)
				{
					if (settings.mode == "replace") settings.to.html(s);
					else if (settings.mode == "append") settings.to.append(s);
					else if (settings.mode == "prepend") settings.to.prepend(s);
				}

				fCallback(s);

			},{
				wrapper: settings.sWrapper
			});



		}

	};


});