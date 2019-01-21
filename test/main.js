const expect = require('chai').expect;
const main = require('../main');

const tagsToClose = main.tagsToClose;

describe('tagsToClose', function() {
  it('works like so', function() {
    const t = (a, b, c) => expect(tagsToClose(a, b)).to.deep.equal(c);
    t(['strong', 'em'], 'strong', ['em', 'strong']);
    t(['strong', 'strong', 'em'], 'strong', ['em', 'strong']);
    t(['strong', 'em', 'em', 'em'], 'strong', ['em', 'em', 'em', 'strong']);
    t(['strong', 'em', 'em', 'strong'], 'strong', ['strong']);
    t(['em', 'strong', 'em', 'strong'], 'strong', ['strong'])
    t([], 'strong', []);
    t(['strong', 'em'], 'potato', ['em', 'strong']);
  });
});

const tagsToOpen = main.tagsToOpen;

describe('tagsToOpen', function() {
  it('works like so', function() {
    const t = (a, b, c) => expect(tagsToOpen(a, b)).to.deep.equal(c);
    t(['strong', 'em'], 'strong', ['em']);
    t(['strong', 'em', 'em'], 'strong', ['em', 'em']);
    t(['em', 'em', 'strong'], 'strong', []);
    t(['strong', 'em', 'em', 'strong'], 'strong', []);
    t(['strong', 'em'], 'strong', ['em']);
    t([], 'strong', []);
    t(['strong', 'em'], 'potato', ['strong', 'em']);
    t(['em', 'strong', 'u'], 'em', ['strong', 'u']);
  });
});

const newTagStack = main.newTagStack;

describe('newTagStack', function() {
  it('works like so', function() {
    const t = (a, b, c) => expect(newTagStack(a, b)).to.deep.equal(c);
    t(['strong', 'em'], 'strong', ['em']);
    t(['strong', 'em', 'em'], 'strong', ['em', 'em']);
    t(['em', 'em', 'strong'], 'strong', ['em', 'em']);
    t(['strong', 'em', 'em', 'strong'], 'strong', ['strong', 'em', 'em']);
    t(['strong', 'em'], 'strong', ['em']);
    t([], 'strong', []);
    t(['strong', 'em'], 'potato', ['strong', 'em']);
  });
});
