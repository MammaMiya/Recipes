(function (global) {

var dc = {};

var allCategoriesUrl = "Pars/lib.json";
var menuItemHtml = "Snippets/menu_items_snippet.html";
// var Server = "http://localhost:3000"
var Server = "https://mammamiya.github.io/Recipes"
var IngredHtml = "Snippets/ingred_snippet.html";
var RecipeHtml = "Snippets/recipe_snippet.html";
var popupHtml = "Snippets/ingr_popup.html";
var tagsJson = "Pars/tags.json";
var ingrTags = "Pars/ingr_tags.json";

// Функция проверки наличия куки с массивом id и добавление этого массива, если куки пустая
// Общая функция проверки наличия куки с нужным именем

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function cookieCheck(data) {
  if (getCookie("arrRec") == undefined) {
    var x = arrayUpd(data);
    document.cookie = "arrRec=" + JSON.stringify(x) + ";max-age=600000";
  }
}

function arrayUpd (data) {
  let arr = [];
  for (var i = 0; i < 12; ) {
    var k = randomInteger(data.length-1);
    if (data[k]['FNjpeg'].length < 135) {
      if (arr.includes(k) == false) {
      i+=1;
      arr[i-1] = k;
      }
    }
  };
  return arr;
}
 
dc.cookiesUpd = function (data) {
  $ajaxUtils.sendGetRequest(allCategoriesUrl, cookieNew);
  function cookieNew(data) {
    var x = arrayUpd(data);
    document.cookie = "arrRec=" + JSON.stringify(x) + ";max-age=600000";
    location.reload()
  }
}

// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
}

  function randomInteger(max) {
    // случайное число до (max+1)
    let rand = Math.random() * (max + 1);
    return Math.floor(rand);
  }

var unCook = function (name) {
  var cookie1 = JSON.parse(getCookie(name));
  return cookie1;
}

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='JPEG/1480.gif'></div>";
  insertHtml(selector, html);
}

// TagsLoader section rendering

var tagsLoader = function (tagsJson) {
  var html = "";
  var tagSplited = "";
  for (var tag in tagsJson) {
    if (tagsJson[tag] != "") {
      html += '<input type="button" value="' + tagsJson[tag] + '" class="button2" onclick="$dc.clickedFu(this)">'; 
  }};
  html += '<input type="button" value="Загрузить" class="button3" onclick="$dc.idForming()">';
  insertHtml(".tagsList", html);
}

// Присваиваем новый class тегу, по которому кликнули, ну или убираем его :)

dc.clickedFu = function (el) {
  if (el.classList.contains('clicked') == true) {
    el.classList.remove('clicked');
  }
  else {
    el.classList.add('clicked');
  }
}

// функция создания массива по выбранным тегам
clickedTags = function(arrTags) {
  var clickedTags = document.querySelectorAll(".clicked.button2");
  arrTags = [];
  if (clickedTags.length > 0) {
  for (var i = 0; i < clickedTags.length; i++) {
    arrTags[i] = clickedTags[i]["value"]
  }};
  return arrTags;
}
 

// Функция выбора айди рецептов по сформированным тегам

dc.idForming = function(clickedTags) {
    $ajaxUtils.sendGetRequest(allCategoriesUrl,
    buildIdList);
}

buildIdList = function (lib) {
  var arr = [];
  var tag = clickedTags(arr);
  var arr2 = [];
  var tags = "";
  var match = 0;
  if (tag.length > 0) {
    for (var i = 0; i < lib.length; i++) {
      match = 0;
      if (lib[i]['Tags'].length > 0) {
        for (var n = 0; n < lib[i]['Tags'].length; n++) {
          for (var m = 0; m < tag.length; m++) {
            tags = new RegExp(tag[m]);
            if (lib[i]['Tags'][n].match(tags) != null) {
            match += 1;         
            }
            }
          }
        }
      if (match != tag.length) {
      delete lib[i];
      }
    }
  var p = 0;
  for (i = 0; i < lib.length; i++) {
      if (lib[i] != undefined && lib[i]['Name'].length < 135) {
      arr2[p] = lib[i];
      p += 1;
    }
  }
  createTagReciepList(arr2);
  }
}
 
// Загрузка рецептов по выбранным тегам

var createTagReciepList = function(arr2) {
   $ajaxUtils.sendGetRequest(menuItemHtml,
  function (menuItemHtmlTags) {
    var menuItemsViewHtmlTags =
      buildMenuItemsViewHtmlTags(arr2, menuItemHtmlTags);
    insertHtml("#main-content", menuItemsViewHtmlTags);
  },
  false);
 }

var buildMenuItemsViewHtmlTags = function (arr2, menuItemHtmlTags) {
  var finalHtml = "";
  for (var n = 0; n < Math.ceil(arr2.length/12); n++) {
    var clcTag = "";
    if (n == 0) {
      clcTag = " clicked";
    }
    else {
      clcTag = "";
    }
    finalHtml += "<div class='tagBlock page" + (n+1) + clcTag +  "'>";
    if (n < Math.ceil(arr2.length/12) - 1) {
      var k = 12;
    }
    else {
      k = arr2.length - n * 12;
    }
    // Loop over menu items
    for (var i = 0; i < k; i++) {
      var html = menuItemHtmlTags;
      html =
        insertProperty(html, "Id", arr2[i+12*n].id+1);          
      html =
        insertProperty(html, "FNjpeg", Server + arr2[i+12*n].FNjpeg);
      html =
        insertProperty(html, "Time", arr2[i+12*n].Time);
      html =
        insertProperty(html, "Weight", arr2[i+12*n].Weight);
      html =
        insertProperty(html, "Complexity", arr2[i+12*n].Complexity);
      html =
        insertProperty(html, "EnergyValue", arr2[i+12*n].EnergyValue);
      html =
        insertProperty(html, "Name", arr2[i+12*n].Name);
      html =
        insertProperty(html, "Tags", arr2[i+12*n].Tags);
      html =
        insertProperty(html, "FNjson", arr2[i+12*n].FNjson);
      html =
        insertProperty(html, "Week", arr2[i+12*n].Week);
      finalHtml += html;
        }
    finalHtml += "</div>";
  }
  finalHtml += '<div class="pages col-lg-12 col-md-12 col-sm-12"><input type="button" value="' + 1 + '" class="button4 clicked" onclick="$dc.clickedPageAction(this)">';
  for (var n = 1; n < Math.ceil(arr2.length/12); n++) {
    finalHtml += '<input type="button" value="' + (n + 1) + '" class="button4" onclick="$dc.clickedPageAction(this)">';
  }  
  finalHtml += '</div>';
return finalHtml;
}
        
dc.clickedPageAction = function(el) {
  if (el.classList.contains("clicked") != true) {
    el.classList.add("clicked");
  }
  var btn4 = document.getElementsByClassName('button4')
  for (var i = 0; i < btn4.length; i++) {
    if (btn4[i].value != el.value) {
      if (btn4[i].classList.contains("clicked") == true) {
      btn4[i].classList.remove("clicked")
      }
    } 
  }
    newClassName = "page" + el.value;
    var tagged = document.getElementsByClassName('tagBlock');
    for (var i = 0; i < tagged.length; i++) {
      if (tagged[i].classList.contains(newClassName) == true) {
        if (tagged[i].classList.contains("clicked") != true) {
          tagged[i].classList.add("clicked");
        }
      }
      else {
        if (tagged[i].classList.contains("clicked") == true) {
          tagged[i].classList.remove("clicked");
        }
      }
    }
}


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

// Раздел выкачки рецептуры из жейсона

// Load recipe according pic Name
dc.loadRecipe = function (el, name, FNjson, Week) {
  showLoading("#Ingredients");
  $ajaxUtils.sendGetRequest(
    Server + "/Pars/" + Week + "/" + FNjson,
    buildAndShowRecipe);
 }

dc.loadFlow = function (FNjson, Week) {
  showLoading("#Ingredients");
  $ajaxUtils.sendGetRequest(
    Server + "/Pars/" + Week + "/" + FNjson,
    buildAndShowFlow);
  setTimeout(() => popupsRun(), 1500);
}

// попытка добавить картинку в раздел с ингредиентами для выбранного блюда

dc.getLink = function(el, name) {

var link = el.querySelector('img').getAttribute('src');

var finalHtml = "";
finalHtml += '<div class = "picPic">';
finalHtml += '<img src=' + link.replace(/ /ig, "%20") +' id = "lowPic">';
finalHtml += '<div id="smallText">'+ name +'</div></div>';

insertHtml("#Ingredients", finalHtml)
}


// Строим скелет раздела с ингридиентами

function buildAndShowRecipe(recipeJSON) {
  $ajaxUtils.sendGetRequest(
    IngredHtml,
    function (IngredHtml) {
      var ingredViewHtml = buildIngredViewHtml(recipeJSON, IngredHtml);
      insertHtml("#IngrTable", ingredViewHtml);
      },
    false);

  var ingrPopup = buildIngredPopup(recipeJSON);

}

function popupsRun () {
  const popupLinks = document.querySelectorAll(".popup-link");
  if (popupLinks.length > 0) {
    for (var i = 0; i < popupLinks.length; i++) {
      const popupLink = popupLinks[i];
      popupLink.addEventListener("click",function(e) {
        const currentPopup = 'ingr' + i;
        popupOpen(e);
        e.preventDefault();
      })
    }
  }
}
       
      // Using category and menu items data and snippets html
      // build menu items view HTML to be inserted into page
      function buildIngredViewHtml(recipeJSON, IngredHtml) {
        var finalHtml = "";
        var ingredList = recipeJSON.We_ll_bring;
        var id = 0;
        for (var key in ingredList) {
          //Insert ingred values - их две штуки ровно
        var html = IngredHtml;
                    
          html =
            insertProperty(html, "key", key);
          html =
            insertProperty(html, "id", id);
          html =
            insertProperty(html, "value", ingredList[key]);
          finalHtml += html;
          id++;
            }
        return finalHtml;
      }


      // создаем невидимую пока секцию с кучей попапов по ингридиентному листу
      function buildIngredPopup(recipeJSON) {
          $ajaxUtils.sendGetRequest(ingrTags,  
          function (ingrTags) {
            var someFinalPopups = buildIngredPopupHtml (ingrTags, recipeJSON);
            insertHtml("#ingr_popups", someFinalPopups);
        })
      }

      function buildIngredPopupHtml (ingrTags, recipeJSON) {
        var finalHtml = "";
        var ingredList = recipeJSON.IngrDescr;
        var index = 0;
        for (var key in ingredList) {
          //ingredList - список, в котором куча параметров ингридиентов
          var html = '<div id="ingr' + index + '" class="popup popup_closed"><div class="popup_body col-sm-10"><div class="ingr_data">';
          finalHtml += html;
          for (var key2 in ingredList[key]) {
            var newKey2 = ingrTags[0][key2];
            var descr = ingredList[key][key2]
            if (newKey2 != undefined && newKey2.length > 2 && descr.length > 2) {
              html = '<div class="ingr_data_prop col-lg-4 col-md-4 col-sm-4">' + newKey2 + '</div>';  
              finalHtml += html;    
              html = '<div class="ingr_data_value col-lg-8 col-md-8 col-sm-8">' + descr + '</div>';
              finalHtml += html;
            }
          }
          html = '</div></div></div>';
          finalHtml += html;
          index++;
        }
        return finalHtml;
      }


function popupOpen(currentPopup) {
  const popupActive = currentPopup.srcElement.id;
  const popupActive2 = document.querySelector('.popup#'+popupActive);
  popupActive2.classList.remove('popup_closed');
  popupActive2.classList.add('popup_opened');
  popupActive2.addEventListener("click", function (e) {
    if (!e.target.closest('.ingr_data')) {
      popupClose(e.target.closest('.ingr_popups'));
    }
  });
}

function popupClose(popupActive2) {
  const popupActive = document.querySelector('.popup_opened');
  popupActive.classList.remove('popup_opened');
  popupActive.classList.add('popup_closed');
}

// закончили ингр, пошли делать последовательность приготовления, БЛИН!

function buildAndShowFlow(flowList) {
      $ajaxUtils.sendGetRequest(
        RecipeHtml,
        function (RecipeHtml) {
          var flowViewHtml =
            buildFlowViewHtml(flowList, RecipeHtml);
          insertHtml("#Flow", flowViewHtml);
        },
        false);
      setTimeout (() => top.location = '#IngrSection', 100);
}

      // Using category and menu items data and snippets html
      // build menu items view HTML to be inserted into page
      function buildFlowViewHtml (flowList, RecipeHtml) {

        var finalHtml = "";
        // Loop over recipe items
        var flow = flowList.Cooking;
        var i = 1;
        for (var key in flow) {
          //Insert ingred values - их две штуки ровно
        var html = RecipeHtml;
          html =
            insertProperty(html, "key", key);
          html =
            insertProperty(html, "value", flow[key]);
          html =
            insertProperty(html, "id", i);
          i += 1;
              finalHtml += html;
            };
        return finalHtml;
      }

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

  // On first load, show home view
  showLoading("#main-content");
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowMenuItemsHTML);
  $ajaxUtils.sendGetRequest(allCategoriesUrl, cookieCheck);
  $ajaxUtils.sendGetRequest(tagsJson, tagsLoader);
});

// Builds HTML for the single category page based on the data
// from the server
function buildAndShowMenuItemsHTML(Data) {
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
    var k = unCook("arrRec");
    
    // Loop over menu items
    var menuItems = Data;
    for (var i = 0; i < 12; i++) {
      var html = menuItemHtml;
      html =
        insertProperty(html, "Id", menuItems[k[i]].id+1);          
      html =
        insertProperty(html, "FNjpeg", Server + menuItems[k[i]].FNjpeg);
      html =
        insertProperty(html, "Time", menuItems[k[i]].Time);
      html =
        insertProperty(html, "Weight", menuItems[k[i]].Weight);
      html =
        insertProperty(html, "Complexity", menuItems[k[i]].Complexity);
      html =
        insertProperty(html, "EnergyValue", menuItems[k[i]].EnergyValue);
      html =
        insertProperty(html, "Name", menuItems[k[i]].Name);
      html =
        insertProperty(html, "Tags", menuItems[k[i]].Tags);
      html =
        insertProperty(html, "FNjson", menuItems[k[i]].FNjson);
      html =
        insertProperty(html, "Week", menuItems[k[i]].Week);
      finalHtml += html;
        }
    return finalHtml;
  }

  document.addEventListener("submit", function (event) {
    event.preventDefault();
    var form = event['srcElement'][0]['value'];
    $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    function (RecipeHtml) {
      var searchRec = buildIdSearchList(form, RecipeHtml);
      });
    });

  //создаем перечень рецептур по поисковому запросу

  buildIdSearchList = function (form, lib) {
    var arr2 = [];
    var p = 0;
    //var match = 0;
    if (form.length > 0) {
      var tag = new RegExp(form, "i");
      for (var i = 0; i < lib.length; i++) {
        if (lib[i]['Name'].match(tag) != null) {
        arr2[p] = lib[i];
        p += 1;
        }
      }
    createTagReciepList(arr2);
    }
  }


global.$dc = dc;

})(window);
