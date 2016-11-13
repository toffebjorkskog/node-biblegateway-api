

const cheerio = require('cheerio');

var html = `<div class="passage-text"><div class='passage-wrap'><div class='passage-content passage-class-0'><div class="version-KJ21 result-text-style-normal text-html ">
    <h1 class="passage-display"> <span class="passage-display-bcv">Genesis 1:1</span><span class="passage-display-version">21st Century King James Version (KJ21)</span></h1> <p class="verse chapter-1"><span id="en-KJ21-1" class="text Gen-1-1"><span class="chapternum">1 </span>In the beginning God created the heaven and the earth.</span></p> </div>
`;

var $ = cheerio.load(html);
verses = [];
$(".result-text-style-normal .verse").each(function(){
    var $verse = $(this).find(".text");
    $verse.find(".chapternum, .versenum").html("");

    var verse = {
        id: $verse.attr("class").replace("text ", ""),
        text: $verse.text(),
        version: "FOO"
    };
    verses.push(verse);
});

console.log(verses);

function removeFromToText(selector, $element) {
    return $element.text().replace(
        $element.find(selector).text(), ""
    ).trim();
}