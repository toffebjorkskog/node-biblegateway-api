"use strict";

let request = require('request');
let cheerio = require('cheerio');


/*
* Route: /versions
*/

function getVersions(req, res) {

    var url = "https://www.biblegateway.com/quicksearch/";

    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var lang = {shortcode: "", name: "", defaultVersion: ""};
            var regExBetweenParenthesis = /\(([^)]+)\)/;
            var json = { title : "", release : "", rating : ""};
            var langArr = [];
            var versionArr = [];

            $(".search-translation-select option").each(function(){
                if($(this).attr("class") && $(this).attr("class") === "spacer") {
                    return; // do nothing
                } else if($(this).attr("class") && $(this).attr("class") === "lang") {
                    lang.shortcode = regExBetweenParenthesis.exec($(this).text())[1];
                    lang.defaultVersion = $(this).val();
                    lang.name = $(this).text();
                    langArr.push((JSON.parse(JSON.stringify(lang)))); // adding a clone to the arr
                } else {
                    versionArr.push({
                        id: $(this).attr("value"),
                        name: $(this).text(),
                        lang: lang.shortcode
                    });
                }

            });

            res.json({status: "ok", languages: langArr, versions: versionArr});
        } else {
            res.json({ "status": "error", message: "Unable to perform the search"});
        }
    })

};

/**
 *  Route: /search/:version/:term
 */

function search(req, res) {

    var retArr = [];

    var url = "https://www.biblegateway.com/quicksearch/?quicksearch=" +
        req.params.term +
        "&qs_version=" +
        req.params.version + "&limit=1500";

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){
        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            // Finally, we'll define the variables we're going to capture

            var title, release, rating;
            var json = { title : "", release : "", rating : ""};

            $(".search-result-list article.row").each(function(){
                var verse = {title : "", context : "", chapter : "", text : ""};
                verse.title = $(this).find(".bible-item-title").text();
                verse.context = $(this).find("a:contains('In Context')").attr("href").replace(/.*search=/,"").replace(/\&version.*/,"").replace("+"," ");
                verse.chapter = $(this).find("a:contains('Full Chapter')").attr("href").replace(/.*search=/,"").replace(/\&version.*/,"").replace("+"," ");
                verse.text = $(this).find(".bible-item-text").text().replace(
                    $(this).find(".bible-item-extras").text(), ""
                ).trim();
                retArr.push((JSON.parse(JSON.stringify(verse))));

            });

            res.json({status: "ok", version: req.params.version, searchTerm: req.param.term, result:retArr});
        } else {
            res.json({ "status": "error", message: "Unable to perform the search"});
        }
    })

}

function getPassage(req, res, url) {
    request(url, function(error, response, html) {
        // First we'll check to make sure no errors occurred when making the request
        var verses = [];
        if (!error) {
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);
            $(".result-text-style-normal .versenum").each(function(){
                var $verse = $(this).parent();
                var verse = {
                    id: $verse.attr("class").replace("text ", ""),
                    text: removeFromToText("sup", $verse),
                    version: req.params.version
                };
                verses.push(verse);



            });
            res.json({ "status": "ok", message: "Success", verses:verses});
        } else {
            res.json({ "status": "error", message: "Unable to perform the lookup for " + url});
        }
    });
}

/*
* Route: /passage/:version/:PassageReference')
*/
function getPassageByReference(req, res) {
    var url = 'https://www.biblegateway.com/passage/?search=' + req.params.PassageReference +
        '&version='+req.params.version+'&interface=print';
    getPassage(req, res, url);
}

function getPassageByBookChapterVerse(req, res) {
    var url = 'https://www.biblegateway.com/passage/?search=' + req.params.book + ' ' + req.params.chapter + ':' + req.params.verse +
        '&version='+req.params.version+'&interface=print';
    getPassage(req, res, url);
}

function removeFromToText(selector, $element) {
    return $element.text().replace(
        $element.find(selector).text(), ""
    ).trim();
}

module.exports = { getVersions, search, getPassageByReference, getPassageByBookChapterVerse };