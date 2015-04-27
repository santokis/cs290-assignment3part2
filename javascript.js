function getList(){
  var gistArray = [];
  var dataExchange = new XMLHttpRequest(); //exchange data with server
  var pages = document.getElementsByName("numPages")[0].value;
  var url = "https://api.github.com/gists/public";
  var parameters = {
    mode: "JSON",
    page: pages
  };
  //referenced “demo.js”
  url += '?' + urlStringify(parameters); //construct url
  dataExchange.onreadystatechange = function(){ //function call when ready state changes
    if(this.readyState === 4){ //request finished & response ready
      gistArray = JSON.parse(this.responseText);
      for(var i = 0; i < pages; i++){
        printList(gistArray);
      }
    }
  };
  dataExchange.open('GET', url);
  dataExchange.send();
};

function printList(gistList){
  var resultsList = document.getElementById("results");
  var favoritesList = document.getElementById("favorites");
  //determine # childnodes
  for(var i = resultsList.childNodes.length - 1; i >= 0; i--){
    resultsList.removeChild(resultsList.childNodes[i]);
  }
  for(var j = favoritesList.childNodes.length - 1; j >= 0; j--){
    favoritesList.removeChild(favoritesList.childNodes[j]);
  }
  for(var k = 0; k < gistList.length; k++){
    var div = document.createElement("div");
    var favorite = document.createElement("button");
    
    /*referenced “http://stackoverflow.com/questions/4772774/how-do-i-create-a-link-using-
    javascript” for creating link*/
    var a = document.createElement("a");
    var text = document.createTextNode(gistList[k].description);
    var space = document.createTextNode("  ");
    if (text.length === 0){
      text = document.createTextNode("null");
    }
    a.appendChild(text); //returns new child node
    a.title = text;
    a.href = gistList[k].html_url;
    favorite.setAttribute("gistID", gistList[k].id);
    if(localStorage.getItem(gistList[k].id)){
      favorite.innerHTML = "remove";
      favorite.onclick = function(){
        var gistID = this.getAttribute("gistID");
        localStorage.removeItem(gistID);
        printList(gistList);
      };
    }
    else{
      favorite.innerHTML = "add";
      favorite.onclick = function(){
        var gistID = this.getAttribute("gistID");
        localStorage.setItem(gistID, gistID);
        printList(gistList);
      };
    }
    div.appendChild(favorite);
    div.appendChild(space);
    div.appendChild(a);
    if(localStorage.getItem(gistList[k].id)){
      favoritesList.appendChild(div);
    }
    else{
      resultsList.appendChild(div);
    }
  }
};

//referenced “demo.js”
function urlStringify(obj){
  var str = [];
  var prop;
  var s;
  for(prop in obj){
    //javascript built in function to URI encode
    s = encodeURIComponent(prop) + '=' + encodeURIComponent(obj[prop]);
    str.push(s);
  }
  return str.join('&');
}