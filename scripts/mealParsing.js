const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs")

const log = console.log;

let mealResult = {
    time: "",
    date: [],
    meal: []
};

showMeal_List = [];

const getHtml = async () => {
  try {
    return await axios.get("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=%EB%82%A8%EC%A3%BC%EA%B3%A0%EB%93%B1%ED%95%99%EA%B5%90+%EA%B8%89%EC%8B%9D");
  } catch (error) {
    console.error(error);
  }
};

function mealSearch(){
getHtml()
  .then(html => {
    let ulList = [];
    let dateStrong_List = [];
    let mealUl_List = [];
    const $ = cheerio.load(html.data);
    const $dataList = $("ul").children("li.menu_info");

    $dataList.each(function(i, elem){
        dateStrong_List.push($(this).find('strong').text().split(' ')[1] + $(this).find('strong').text().split(' ')[2]);
        mealUl_List.push($(this).find('ul').text())
      })

    mealResult["time"] = new Date().getMonth() + "/" + new Date().getDate();
    mealResult["date"] = dateStrong_List;
    mealResult["meal"] = mealUl_List;

    fs.writeFileSync("../json/mealData.json", JSON.stringify(mealResult, null, 2));
    // for(k=0; k < mealResult["date"].length; k++){
    //     if(mealResult["date"][k].indexOf(todayDate)!=-1){
    //         showMeal_List.push(mealResult["date"][k] + ": " +  mealResult["meal"][k])
    //     }
    // }
  })
  .then(res => log(res));
}

mealSearch()

module.exports = mealSearch;