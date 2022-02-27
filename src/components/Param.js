function Param(props) {
   var query = window.location.search.substring(1);
   //"app=article&act=news_content&aid=160990"
   // console.log(query);
   var vars = query.split("&");
   //[ 'app=article', 'act=news_content', 'aid=160990' ]
   // console.log(vars);
   for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
      // console.log(pair);
      if (pair[0] === props) {
         return pair[1];
      }
   }
   return false;
}

export { Param };
