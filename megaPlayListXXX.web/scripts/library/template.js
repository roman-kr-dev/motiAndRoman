Template = {
		rxInclude: /\@Include\[\"(.*?)\"\]\;/gi,
		Expand: function(Template, Dynamics, bContent) {

			

			var This = this;
			var sTemplateContent = bContent ? Template : this.GetFileContent("templates/" + Template + ".html");
			
			sTemplateContent = sTemplateContent.replace(this.rxInclude, function(s1,s2) {
				var sInclude = s2;
				if (sInclude.indexOf("Dynamic!") == 0)
					return This.Expand(Dynamics[sInclude.substring("Dynamic!".length,sInclude.length)], false);
				return This.Expand(sInclude, false);				
			});

			return sTemplateContent;

		},
		Render: function(Template, Model, Dynamics) {

			var ExpandedTemplate = this.Expand(Template, Dynamics, false);
			ExpandedTemplate = Mustache.to_html(ExpandedTemplate, Model);
			ExpandedTemplate = this.Expand(ExpandedTemplate, Dynamics, true);

			return ExpandedTemplate;
		},
		GetFileContent: function(sPath) {
			return appAPI.resources.get(sPath);
		},
		AddAssets: function(aAssets) {

			var This = this;
			var rxUrl = /^(https?|ftp)/;
			
			var oAssetTypes = {
				"javascript": {
					rx: /\.js$/i,
					start: "<script type=\"text/javascript\">",
					end: "</script>",
					startOutside: "<script type=\"text/javascript\" src=\"{file}\">",
					endOutside: "</script>",
					itemsOutside: [],
					items: []
				},
				"stylesheet": {
					rx: /\.css$/i,
					start: "<style type=\"text/css\">",
					end: "</style>",
					startOutside: "<link rel=\"stylesheet\" href=\"{file}\" />",
					endOutside: "",
					OnInsert: function(sContent,sFile) {
						return sContent.replace(/url\([\"\']?(.*?)[\"\']?\)/gi,function(s1,s2) {
							return "url(" + (rxUrl.test(s2) ? s2 : appAPI.resources.getImage(s2.indexOf("{root") > -1 ? s2.replace(/^\{root\}/,sFile.substring(0,sFile.lastIndexOf("/") + 1)) : s2)) + ")";
						});
					},
					itemsOutside: [],
					items: []
				}
			};	
			
			

			$.each(aAssets, function()
			{
				var sFile = this;
				$.each(oAssetTypes, function() {
					if (this.rx.test(sFile))
					{
						if (rxUrl.test(sFile))
						{
							this.itemsOutside.push(sFile);
						} else {
							var sContent = This.GetFileContent(sFile);
							if (this.OnInsert)
								sContent = this.OnInsert(sContent,sFile);
							this.items.push(sContent);
						}
						return false;
					}
				});
			});

			var aAssetContents = [];
			$.each(oAssetTypes, function() { 
				if (this.itemsOutside.length)
				{
					var oAsset = this;
					$.each(this.itemsOutside, function() {
						aAssetContents.push((oAsset.startOutside + oAsset.endOutside).replace("{file}", this));
					});
				}
				if (this.items.length) {
					aAssetContents.push(this.start + "\n" + this.items.join("") + "\n" + this.end); 
				}
			});
			return aAssetContents.join("\n");
			

		}
	};