(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['comment'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<article class=\"comment\">\r\n\r\n  <div class=\"info-container\">\r\n    <p class=\"username\">\r\n      <a href=\""
    + alias4(((helper = (helper = helpers.animalUrl || (depth0 != null ? depth0.animalUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalUrl","hash":{},"data":data}) : helper)))
    + "\">An anonymous "
    + alias4(((helper = (helper = helpers.postedBy || (depth0 != null ? depth0.postedBy : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"postedBy","hash":{},"data":data}) : helper)))
    + "&nbsp;</a>\r\n    </p>\r\n    <p class=\"timestamp\"> at "
    + alias4(((helper = (helper = helpers.timestamp || (depth0 != null ? depth0.timestamp : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timestamp","hash":{},"data":data}) : helper)))
    + "</p>\r\n  </div>\r\n\r\n  <div class=\"content-container\">\r\n    <p class=\"content\">\r\n      "
    + alias4(((helper = (helper = helpers.commentContent || (depth0 != null ? depth0.commentContent : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"commentContent","hash":{},"data":data}) : helper)))
    + "\r\n    </p>\r\n  </div>\r\n\r\n</article>\r\n";
},"useData":true});
templates['postLink'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"post-link\">\r\n  <h3 class=\"title\"><a href=\"/posts/"
    + alias4(((helper = (helper = helpers.postid || (depth0 != null ? depth0.postid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"postid","hash":{},"data":data}) : helper)))
    + "\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a></h3>\r\n  <div class=\"info-container\">\r\n    <p class=\"username\">\r\n      <a href=\""
    + alias4(((helper = (helper = helpers.animalUrl || (depth0 != null ? depth0.animalUrl : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"animalUrl","hash":{},"data":data}) : helper)))
    + "\">An anonymous "
    + alias4(((helper = (helper = helpers.postedBy || (depth0 != null ? depth0.postedBy : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"postedBy","hash":{},"data":data}) : helper)))
    + "&nbsp;</a>\r\n    </p>\r\n    <p class=\"timestamp\"> at "
    + alias4(((helper = (helper = helpers.timestamp || (depth0 != null ? depth0.timestamp : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"timestamp","hash":{},"data":data}) : helper)))
    + "</p>\r\n  </div>\r\n</div>\r\n";
},"useData":true});
})();
