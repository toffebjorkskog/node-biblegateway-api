"use strict";

const request = require('request');
const cheerio = require('cheerio');
const queryString = require('query-string');


/*
 * Route: /versions
 */

function getVersions() {

    // Creating a promise
    var promise = new Promise( (resolve, reject) => {

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

                resolve({status: "ok", languages: langArr, versions: versionArr});
            } else {
                reject("Unable to perform the request");
            }
        });
    });

    return promise;
}




/**
 *  Route: /search/:version/:term
 */

function search(term, version) {
    // Creating a promise
    var promise = new Promise( (resolve, reject) => {

        var retArr = [];

        var url = "https://www.biblegateway.com/quicksearch/?quicksearch=" +
            term +
            "&qs_version=" +
            version + "&limit=1500";

        // The structure of our request call
        // The first parameter is our URL
        // The callback function takes 3 parameters, an error, response status code and the html

        request(url, function (error, response, html) {
            // First we'll check to make sure no errors occurred when making the request

            if (!error) {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var $ = cheerio.load(html);

                // Finally, we'll define the variables we're going to capture

                var title, release, rating;
                var json = {title: "", release: "", rating: ""};

                $(".search-result-list article.row").each(function () {
                    console.log($(this).html());
                    var hit = {title: "", context: "", chapter: "", text: ""};
                    hit.title = $(this).find(".bible-item-title").text();
                    hit.contextRef = $(this).find("a:contains('In Context')").attr("href").replace(/.*search=/, "").replace(/\&version.*/, "").replace("+", " ");
                    hit.chapterRef = $(this).find("a:contains('Full Chapter')").attr("href").replace(/.*search=/, "").replace(/\&version.*/, "").replace("+", " ");
                    hit.verse = { id: '',
                        book: '',
                        chapter: '',
                        verse: '',
                        version: version,
                        text: '' };
                    hit.verse.text = $(this).find(".bible-item-text").text().replace(
                        $(this).find(".bible-item-extras").text(), ""
                    ).trim();
                    retArr.push((JSON.parse(JSON.stringify(hit))));

                });

                resolve({status: "ok", version: version, searchTerm: term, result: retArr});
            } else {
                reject("Unable to perform the search");
            }
        })
    });

    return promise;

}

function getPassage(url) {
    let parsedUrl = queryString.parse(url);

    // Creating a promise
    var promise = new Promise( (resolve, reject) => {
        request(url, function(error, response, html) {
            // First we'll check to make sure no errors occurred when making the request
            var verses = [];
            if (!error) {
                // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

                var $ = cheerio.load(html);
                $(".result-text-style-normal .verse").each(function(){
                    var $verse = $(this).find(".text");
                    $verse.find(".chapternum, .versenum").html("");
                    let id = $verse.attr("class").replace("text ", "");
                    let id_parts = id.split("-");
                    var verse = {
                        id: id,
                        book: id_parts[0],
                        chapter: id_parts[1],
                        verse: id_parts[2],
                        version: parsedUrl.version,
                        text: $verse.text()
                    };
                    verses.push(verse);
                });
                resolve({ "status": "ok", message: "Success", verses:verses});
            } else {
                reject("Unable to perform the lookup for " + url);
            }
        });
    });
    return promise;
}


/*
 * Route: /passage/:version/:PassageReference')
 */
function getPassageByReference(passageReference, version) {
    var url = 'https://www.biblegateway.com/passage/?search=' + passageReference +
        '&version='+version+'&interface=print';
    return getPassage(url);
}

function getPassageByBookChapterVerse(book, chapter, verse, version) {
    var url = 'https://www.biblegateway.com/passage/?search=' + book + ' ' + chapter + ':' + verse +
        '&version='+version+'&interface=print';
    return getPassage(url);
}

function removeFromToText(selector, $element) {
    return $element.text().replace(
        $element.find(selector).text(), ""
    ).trim();
}

module.exports = { getVersions, search, getPassageByReference, getPassageByBookChapterVerse};