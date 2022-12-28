(function (global) {

var dc = {};

var allCategoriesUrl = "Pars/lib.json";
var menuItemHtml = "Snippets/menu_items_snippet.html";
var Server = "http://localhost:3000/"
var IngredHtml = "Snippets/ingred_snippet.html";
var RecipeHtml = "Snippets/recipe_snippet.html";

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

  function randomInteger(max) {
    // случайное число до (max+1)
    let rand = Math.random() * (max + 1);
    return Math.floor(rand);
  }


// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='JPEG/1480.gif'></div>";
  insertHtml(selector, html);
};

  // Return substitute of '{{propName}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    string = string.replace(new RegExp(propToReplace, "g"), propValue);
    return string;
  }

var spaceRepl = function (string) {
  string = string.replace(" g", /%20/)
}


// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowMenuItemsHTML);
  console.log("function sendGetRequest done")
     });


// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML (Data) {
       $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(Data, menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    }

      // Using category and menu items data and snippets html
      // build menu items view HTML to be inserted into page
      function buildMenuItemsViewHtml(Data, menuItemHtml) {

        var finalHtml = "";
        //finalHtml += "<section class='row'>";

        // Loop over menu items
        var menuItems = Data;
        
        for (var i = 0; i < 12; i++) {
          console.log(i);
         //Insert menu item values
        //var i = 10;
        var k = randomInteger(menuItems.length);
        console.log(k);

          var html = menuItemHtml;
                    
          html =
            insertProperty(html, "FNjpeg", Server + menuItems[k].FNjpeg);
      
          html =
            insertProperty(html, "Time", menuItems[k].Time);
          html =
            insertProperty(html, "Weight", menuItems[k].Weight);
          html =
            insertProperty(html, "Complexity", menuItems[k].Complexity);
          html =
            insertProperty(html, "EnergyValue", menuItems[k].EnergyValue);
          html =
            insertProperty(html, "Name", menuItems[k].Name);
            html =
            insertProperty(html, "Tags", menuItems[k].Tags);
            console.log(html)

              finalHtml += html;
            }
            // finalHtml += "</section>";
        return finalHtml;
      }


})(window);
