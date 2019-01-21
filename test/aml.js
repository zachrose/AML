var translateModule = '../main';
    AMLTranslator = require(translateModule);

var testStrings = [
   ["Hello, World!",
    "Hello, World!"],
   ["Hello, ^%World!^!%",
    "Hello, <STRONG>World!</STRONG>"],
   ["^~Hello, ^%Earth!^!~ You are ^~welcome^!% here.^!~",
    "<EM>Hello, <STRONG>Earth!</STRONG></EM><STRONG> You are <EM>welcome</EM></STRONG><EM> here.</EM>"],
   ["This is ^almost a tag, but not",
    "This is ^almost a tag, but not"],
   ["This is ^%almost a ^!closing tag, but not^!%",
    "This is <STRONG>almost a ^!closing tag, but not</STRONG>"],
   ["^~Hello^%world^*this^!~is^!%a^!*test",
    "<em>hello<strong>world<u>this</u></strong></em><strong><u>is</u></strong><u>a</u>test"
   ]
];

testStrings.forEach(function (testString, idx) {
  translated = AMLTranslator.translate(testString[0]);
  if (translated.toLowerCase() === testString[1].toLowerCase()) {
    console.log("Example " + (idx + 1) + " is correct.");
  } else {
    console.log('  Input:    ' + testString[0]);
    console.log('  Expected: ' + testString[1]);
    console.log('  Received: ' + translated);
    throw new Error("Example " + (idx + 1) + " is incorrect!");
  }
});
