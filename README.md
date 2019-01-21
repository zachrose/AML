# AML: Alien Markdown Language

This is a coding challenge type of thing. The idea is that there are some aliens who have a markup language that's like HTML except that it has a different syntax and it allows tags to be closed without being strictly nested. In HTML syntax, this would look like:

  <b>This is bold <i>and italic</b> and just italic</i> and normal.

The coding challenge part is to make a JavaScript function that takes a string of AML and returns a valid and equivalent HTML string.

## Other Solutions

[holdenchristiansen](https://github.com/holdenchristiansen/aml/blob/master/aml.js) Iterates through the AML string and looks at two characters at a time, managing a mutable list of open tags.

[imagineux](https://github.com/imagineux/aml-translator/blob/master/aml_translator.js) Converts the AML markup into invalid HTML, and then re-wraps tags as valid HTML.

## This solution

This solution is a `reduce` over each character of the HTML. The memo for this reduce keeps a list of open tags and also the state of the translator, which is one of "normal" (just looking for the next character), "awaiting tag" (looking for an AML tag name, having seen a "^"), and "awaiting closing tag" (looking for an AML tag name, having seen a "^!").

This isn't necessarily better or worse than the other approaches, but using a reduce and keeping the "state" in the memo means that there's no mutable state and the biggest thing individual thing to reason about is the input and output for the reduce's iterator function.
