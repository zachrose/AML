/**
 * Types:
 *
 * An HTML tag name, eg "strong"
 * @typedef {string} HtmlTagName
 *
 * An HTML opening tag, eg "<strong>"
 * @typedef {string} HtmlOpeningTag
 *
 * An HTML closing tag, eg "</strong>"
 * @typedef {string} HtmlClosingTag
 *
 * An AML tag name, eg "%"
 * @typedef {string} AmlTagName
 *
 * A stack of HTML tag names representing the level of embedding at a
 * given point, eg ['STRONG', 'EM', 'EM']
 * @typedef {HtmlTagName[]} TagStack
 *
 * A constant representing what the translator is looking to do with
 * the next character, like open a tag or close a tag
 * @typedef {Number} TranslatorState
 *
 * The complete state of the translator at a given point
 * @typedef {Object} TranslatorMemo
 * @property {TranslatorState} state
 * @property {TagStack} tagStack
 * @property {String} html - Currently collected HTML output
 */


/**
 * A mapping of known AML tags to their HTML equivalents
 * @type {Object.<AmlTagName, HtmlTagName}
 * @const
 */
const amlToHtml = {
  '%': 'STRONG',
  '*': 'U',
  '~': 'EM'
};


/**
 * @type {TranslatorState}
 * @const
 */
const NORMAL = 0;


/**
 * @type {TranslatorState}
 * @const
 */
const AWAITING_TAG_NAME = 1;


/**
 * @type {TranslatorState}
 * @const
 */
const AWAITING_CLOSING_TAG_NAME = 2;


/**
 * @type {TranslatorMemo}
 * @const
 */
const initialState = {
  state: NORMAL,
  tagStack: [],
  html: ''
};


/* @param {string} character - one character of AML
 * @returns {?HtmlTagName}
 */
const amlTagToHtml = function(character) {
  return amlToHtml[character] || null;
};

/* @param {HTMLTagName} tag
 * @returns {HtmlOpeningTag}
 */
const opening = (tag) => `<${tag}>`;

/* @param {HTMLTagName} tag
 * @returns {HtmlClosingTag}
 */
const closing = (tag) => `</${tag}>`;


/*
 * @param {TagStack} tagStack
 * @param {HtmlTagName} tag A tag to close
 * @returns {HtmlTagName[]} A list of tags to close
 * @example
 * // returns ['em', 'strong']
 * tagsToClose(['strong', 'em'], 'strong')
 */
const tagsToClose = function(tagStack, tag) {
  return tagStack.reduceRight(function(memo, tagFromStack) {
    if (memo.done) return memo;
    return {
      done: tagFromStack === tag,
      output: memo.output.concat(tagFromStack)
    };
  }, {
    done: false,
    output: []
  }).output;
};


/*
 * @param {TagStack} tagStack
 * @param {HtmlTagName} tag A tag to close
 * @returns {HtmlTagName[]} A list of tags to re-open
 * @example
 * // returns ['strong', 'u']
 * tagsToOpen(['em', 'strong', 'u'], 'em')
 */
const tagsToOpen = function(tagStack, tag) {
  return tagStack.reduceRight(function(memo, tagFromStack) {
    if (memo.done) return memo;
    const match = (tagFromStack === tag);
    return {
      done: match,
      output: match ? memo.output : [tagFromStack, ...memo.output]
    };
  }, {
    done: false,
    output: []
  }).output;
};


/*
 * @param {TagStack} tagStack
 * @param {HtmlTagName} htmlTag
 * @returns {TagStack} A new TagStack after closing htmlTag
 * @example
 * // returns ['em', 'em']
 * newTagStack(['em', 'em', 'strong'], 'strong')
 */
const newTagStack = function(tagStack, htmlTag) {
  return tagStack.reduceRight(function(memo, tag){
    return (!memo.done && tag === htmlTag)
      ? { ...memo, done: true }
      : { ...memo, output: [tag, ...memo.output] };
  },{
    done: false,
    output: []
  }).output;
};

/*
 * @param {TranslatorMemo} memo
 * @param {string} A character of AML
 * @returns {TranslatorMemo}
 */
const acceptCharacterWhileNormal = function(memo, amlChar) {
  return (amlChar === '^')
    ? { ...memo, state: AWAITING_TAG_NAME }
    : { ...memo, html: memo.html += amlChar };
};

/*
 * @param {TranslatorMemo} memo
 * @param {string} A character of AML
 * @returns {TranslatorMemo}
 */
const acceptCharacterWhileAwaitingTag = function(memo, amlChar) {
  if (amlChar === '!') {
    // actually a closing tag
    return {
      ...memo,
      state: AWAITING_CLOSING_TAG_NAME
    };
  }
  const htmlTag = amlTagToHtml(amlChar);
  if (htmlTag) {
    return {
      ...memo,
      state: NORMAL,
      tagStack: memo.tagStack.concat(htmlTag),
      html: memo.html += opening(htmlTag)
    };
  } else {
    // not an opening tag after all
    return {
      ...memo,
      state: NORMAL,
      html: memo.html += '^' + amlChar
    };
  }
};


/*
 * @param {TranslatorMemo} memo
 * @param {string} A character of AML
 * @returns {TranslatorMemo}
 */
const acceptCharacterWhileAwaitingClosingTag = function(memo, amlChar) {
  const htmlTag = amlTagToHtml(amlChar);
  if (htmlTag) {
    const toClose = tagsToClose(memo.tagStack, htmlTag);
    const toOpen = tagsToOpen(memo.tagStack, htmlTag);
    const newHtml = toClose.map(closing).join('') + toOpen.map(opening).join('');
    return {
      state: NORMAL,
      tagStack: newTagStack(memo.tagStack, htmlTag),
      html: memo.html += newHtml
    };
  } else {
    // not a closing tag after all
    return {
      ...memo,
      state: NORMAL,
      html: memo.html += '^!' + amlChar
    };
  }
};


/*
 * @param {TranslatorMemo} memo
 * @param {string} A character of AML
 * @returns {TranslatorMemo}
 */
const acceptCharacter = function(memo, amlChar) {
  return {
    [NORMAL]: acceptCharacterWhileNormal,
    [AWAITING_TAG_NAME]: acceptCharacterWhileAwaitingTag,
    [AWAITING_CLOSING_TAG_NAME]: acceptCharacterWhileAwaitingClosingTag,
  }[memo.state](memo, amlChar);
};

/*
 * @param {string} amlString A string of AML
 * @returns {string} A string of HTML
 */
const translate = function(amlString) {
  return amlString.split('').reduce(acceptCharacter, {...initialState}).html;
};

module.exports.translate = translate;

// for quick unit testing of the smaller parts
module.exports.tagsToClose = tagsToClose;
module.exports.tagsToOpen = tagsToOpen;
module.exports.newTagStack = newTagStack;
