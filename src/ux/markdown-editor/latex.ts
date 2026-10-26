/**
 * @fileoverview Module `src/ux/markdown-editor/latex.ts` providing latex definitions and implementation.
 * @zh 模块文件 `src/ux/markdown-editor/latex.ts`，提供latex相关的定义与实现。
 */



/**
 * Constant/variable `accents1` defining accents1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `accents1`，定义 `src/ux/markdown-editor` 中的accents1。
 */
let accents1 = [
    'tilde', 'mathring',
    'widetilde', 'overgroup',
    'utilde', 'undergroup',
    'acute', 'vec', 'Overrightarrow',
    'bar', 'overleftarrow', 'overrightarrow',
    'breve', 'underleftarrow', 'underrightarrow',
    'check', 'overleftharpoon', 'overrightharpoon',
    'dot', 'overleftrightarrow', 'overbrace',
    'ddot', 'underleftrightarrow', 'underbrace',
    'grave', 'overline', 'overlinesegment',
    'hat', 'underline', 'underlinesegment',
    'widehat', 'widecheck'
];
/**
 * Constant/variable `delimiters0` defining delimiters0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `delimiters0`，定义 `src/ux/markdown-editor` 中的delimiters0。
 */
let delimiters0 = [
    'lparen', 'rparen', 'lceil', 'rceil', 'uparrow',
    'lbrack', 'rbrack', 'lfloor', 'rfloor', 'downarrow', 'updownarrow',
    'langle', 'rangle', 'lgroup', 'rgroup', 'Uparrow',
    'vert', 'ulcorner', 'urcorner', 'Downarrow',
    'Vert', 'llcorner', 'lrcorner', 'Updownarrow',
    'lvert', 'rvert', 'lVert', 'rVert', 'backslash',
    'lang', 'rang', 'lt', 'gt'
];
/**
 * Constant/variable `delimeterSizing0` defining delimeter sizing0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `delimeterSizing0`，定义 `src/ux/markdown-editor` 中的delimeterSizing0。
 */
let delimeterSizing0 = [
    'left', 'big', 'bigl', 'bigm', 'bigr',
    'middle', 'Big', 'Bigl', 'Bigm', 'Bigr',
    'right', 'bigg', 'biggl', 'biggm', 'biggr',
    'Bigg', 'Biggl', 'Biggm', 'Biggr'
];
/**
 * Constant/variable `greekLetters0` defining greek letters0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `greekLetters0`，定义 `src/ux/markdown-editor` 中的greekLetters0。
 */
let greekLetters0 = [
    'Alpha', 'Beta', 'Gamma', 'Delta',
    'Epsilon', 'Zeta', 'Eta', 'Theta',
    'Iota', 'Kappa', 'Lambda', 'Mu',
    'Nu', 'Xi', 'Omicron', 'Pi',
    'Sigma', 'Tau', 'Upsilon', 'Phi',
    'Chi', 'Psi', 'Omega',
    'varGamma', 'varDelta', 'varTheta', 'varLambda',
    'varXi', 'varPi', 'varSigma', 'varUpsilon',
    'varPhi', 'varPsi', 'varOmega',
    'alpha', 'beta', 'gamma', 'delta',
    'epsilon', 'zeta', 'eta', 'theta',
    'iota', 'kappa', 'lambda', 'mu',
    'nu', 'xi', 'omicron', 'pi',
    'rho', 'sigma', 'tau', 'upsilon',
    'phi', 'chi', 'psi', 'omega',
    'varepsilon', 'varkappa', 'vartheta', 'thetasym',
    'varpi', 'varrho', 'varsigma', 'varphi',
    'digamma'
];
/**
 * Constant/variable `otherLetters0` defining other letters0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `otherLetters0`，定义 `src/ux/markdown-editor` 中的其他Letters0。
 */
let otherLetters0 = [
    'imath', 'nabla', 'Im', 'Reals',
    'jmath', 'partial', 'image', 'wp',
    'aleph', 'Game', 'Bbbk', 'weierp',
    'alef', 'Finv', 'N', 'Z',
    'alefsym', 'cnums', 'natnums',
    'beth', 'Complex', 'R',
    'gimel', 'ell', 'Re',
    'daleth', 'hbar', 'real',
    'eth', 'hslash', 'reals'
];
/**
 * Constant/variable `annotation1` defining annotation1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `annotation1`，定义 `src/ux/markdown-editor` 中的annotation1。
 */
let annotation1 = [
    'cancel', 'overbrace',
    'bcancel', 'underbrace',
    'xcancel', 'not =',
    'sout', 'boxed',
    'tag', 'tag*'
];
/**
 * Constant/variable `verticalLayout0` defining vertical layout0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `verticalLayout0`，定义 `src/ux/markdown-editor` 中的垂直Layout0。
 */
let verticalLayout0 = ['atop']
/**
 * Constant/variable `verticalLayout2` defining vertical layout2 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `verticalLayout2`，定义 `src/ux/markdown-editor` 中的垂直Layout2。
 */
let verticalLayout2 = ['stackrel', 'overset', 'underset', 'raisebox'];
/**
 * Constant/variable `overlap1` defining overlap1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `overlap1`，定义 `src/ux/markdown-editor` 中的overlap1。
 */
let overlap1 = ['mathllap', 'mathrlap', 'mathclap', 'llap', 'rlap', 'clap', 'smash'];
/**
 * Constant/variable `spacing0` defining spacing0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `spacing0`，定义 `src/ux/markdown-editor` 中的spacing0。
 */
let spacing0 = [
    'thinspace', 'medspace', 'thickspace', 'enspace',
    'quad', 'qquad', 'negthinspace', 'negmedspace',
    'nobreakspace', 'negthickspace'
];
/**
 * Constant/variable `spacing1` defining spacing1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `spacing1`，定义 `src/ux/markdown-editor` 中的spacing1。
 */
let spacing1 = [
    'kern', 'mkern', 'mskip', 'hskip',
    'hspace', 'hspace*', 'phantom', 'hphantom', 'vphantom'
];
/**
 * Constant/variable `logicAndSetTheory0` defining logic and set theory0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `logicAndSetTheory0`，定义 `src/ux/markdown-editor` 中的logicAnd集合Theory0。
 */
let logicAndSetTheory0 = [
    'forall', 'complement', 'therefore', 'emptyset',
    'exists', 'subset', 'because', 'empty',
    'exist', 'supset', 'mapsto', 'varnothing',
    'nexists', 'mid', 'to', 'implies',
    'in', 'land', 'gets', 'impliedby',
    'isin', 'lor', 'leftrightarrow', 'iff',
    'notin', 'ni', 'notni', 'neg', 'lnot'
];
/**
 * Constant/variable `bigOperators0` defining big operators0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `bigOperators0`，定义 `src/ux/markdown-editor` 中的bigOperators0。
 */
let bigOperators0 = [
    'sum', 'prod', 'bigotimes', 'bigvee',
    'int', 'coprod', 'bigoplus', 'bigwedge',
    'iint', 'intop', 'bigodot', 'bigcap',
    'iiint', 'smallint', 'biguplus', 'bigcup',
    'oint', 'oiint', 'oiiint', 'bigsqcup'
];
/**
 * Constant/variable `binaryOperators0` defining binary operators0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `binaryOperators0`，定义 `src/ux/markdown-editor` 中的binaryOperators0。
 */
let binaryOperators0 = [
    'cdot', 'gtrdot', 'pmod',
    'cdotp', 'intercal', 'pod',
    'centerdot', 'land', 'rhd',
    'circ', 'leftthreetimes', 'rightthreetimes',
    'amalg', 'circledast', 'ldotp', 'rtimes',
    'And', 'circledcirc', 'lor', 'setminus',
    'ast', 'circleddash', 'lessdot', 'smallsetminus',
    'barwedge', 'Cup', 'lhd', 'sqcap',
    'bigcirc', 'cup', 'ltimes', 'sqcup',
    'bmod', 'curlyvee', 'times',
    'boxdot', 'curlywedge', 'mp', 'unlhd',
    'boxminus', 'div', 'odot', 'unrhd',
    'boxplus', 'divideontimes', 'ominus', 'uplus',
    'boxtimes', 'dotplus', 'oplus', 'vee',
    'bullet', 'doublebarwedge', 'otimes', 'veebar',
    'Cap', 'doublecap', 'oslash', 'wedge',
    'cap', 'doublecup', 'pm', 'plusmn', 'wr'
];
/**
 * Constant/variable `fractions0` defining fractions0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `fractions0`，定义 `src/ux/markdown-editor` 中的fractions0。
 */
let fractions0 = ['over', 'above'];
/**
 * Constant/variable `fractions2` defining fractions2 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `fractions2`，定义 `src/ux/markdown-editor` 中的fractions2。
 */
let fractions2 = ['frac', 'dfrac', 'tfrac', 'cfrac', 'genfrac'];
/**
 * Constant/variable `binomialCoefficients0` defining binomial coefficients0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `binomialCoefficients0`，定义 `src/ux/markdown-editor` 中的binomialCoefficients0。
 */
let binomialCoefficients0 = ['choose'];
/**
 * Constant/variable `binomialCoefficients2` defining binomial coefficients2 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `binomialCoefficients2`，定义 `src/ux/markdown-editor` 中的binomialCoefficients2。
 */
let binomialCoefficients2 = ['binom', 'dbinom', 'tbinom', 'brace', 'brack'];
/**
 * Constant/variable `mathOperators0` defining math operators0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `mathOperators0`，定义 `src/ux/markdown-editor` 中的mathOperators0。
 */
let mathOperators0 = [
    'arcsin', 'cotg', 'ln', 'det',
    'arccos', 'coth', 'log', 'gcd',
    'arctan', 'csc', 'sec', 'inf',
    'arctg', 'ctg', 'sin', 'lim',
    'arcctg', 'cth', 'sinh', 'liminf',
    'arg', 'deg', 'sh', 'limsup',
    'ch', 'dim', 'tan', 'max',
    'cos', 'exp', 'tanh', 'min',
    'cosec', 'hom', 'tg', 'Pr',
    'cosh', 'ker', 'th', 'sup',
    'cot', 'lg', 'argmax',
    'argmin', 'limits'
];
/**
 * Constant/variable `mathOperators1` defining math operators1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `mathOperators1`，定义 `src/ux/markdown-editor` 中的mathOperators1。
 */
let mathOperators1 = ['operatorname'];
/**
 * Constant/variable `sqrt1` defining sqrt1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `sqrt1`，定义 `src/ux/markdown-editor` 中的sqrt1。
 */
let sqrt1 = ['sqrt'];
/**
 * Constant/variable `relations0` defining relations0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `relations0`，定义 `src/ux/markdown-editor` 中的relations0。
 */
let relations0 = [
    'eqcirc', 'lesseqgtr', 'sqsupset',
    'eqcolon', 'lesseqqgtr', 'sqsupseteq',
    'Eqcolon', 'lessgtr', 'Subset',
    'eqqcolon', 'lesssim', 'subset',
    'approx', 'Eqqcolon', 'll', 'subseteq', 'sube',
    'approxeq', 'eqsim', 'lll', 'subseteqq',
    'asymp', 'eqslantgtr', 'llless', 'succ',
    'backepsilon', 'eqslantless', 'lt', 'succapprox',
    'backsim', 'equiv', 'mid', 'succcurlyeq',
    'backsimeq', 'fallingdotseq', 'models', 'succeq',
    'between', 'frown', 'multimap', 'succsim',
    'bowtie', 'ge', 'owns', 'Supset',
    'bumpeq', 'geq', 'parallel', 'supset',
    'Bumpeq', 'geqq', 'perp', 'supseteq',
    'circeq', 'geqslant', 'pitchfork', 'supseteqq',
    'colonapprox', 'gg', 'prec', 'thickapprox',
    'Colonapprox', 'ggg', 'precapprox', 'thicksim',
    'coloneq', 'gggtr', 'preccurlyeq', 'trianglelefteq',
    'Coloneq', 'gt', 'preceq', 'triangleq',
    'coloneqq', 'gtrapprox', 'precsim', 'trianglerighteq',
    'Coloneqq', 'gtreqless', 'propto', 'varpropto',
    'colonsim', 'gtreqqless', 'risingdotseq', 'vartriangle',
    'Colonsim', 'gtrless', 'shortmid', 'vartriangleleft',
    'cong', 'gtrsim', 'shortparallel', 'vartriangleright',
    'curlyeqprec', 'in', 'sim', 'vcentcolon',
    'curlyeqsucc', 'Join', 'simeq', 'vdash',
    'dashv', 'le', 'smallfrown', 'vDash',
    'dblcolon', 'leq', 'smallsmile', 'Vdash',
    'doteq', 'leqq', 'smile', 'Vvdash',
    'Doteq', 'leqslant', 'sqsubset',
    'doteqdot', 'lessapprox', 'sqsubseteq'
];
/**
 * Constant/variable `negatedRelations0` defining negated relations0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `negatedRelations0`，定义 `src/ux/markdown-editor` 中的negatedRelations0。
 */
let negatedRelations0 = [
    'gnapprox', 'ngeqslant', 'nsubseteq', 'precneqq',
    'gneq', 'ngtr', 'nsubseteqq', 'precnsim',
    'gneqq', 'nleq', 'nsucc', 'subsetneq',
    'gnsim', 'nleqq', 'nsucceq', 'subsetneqq',
    'gvertneqq', 'nleqslant', 'nsupseteq', 'succnapprox',
    'lnapprox', 'nless', 'nsupseteqq', 'succneqq',
    'lneq', 'nmid', 'ntriangleleft', 'succnsim',
    'lneqq', 'notin', 'ntrianglelefteq', 'supsetneq',
    'lnsim', 'notni', 'ntriangleright', 'supsetneqq',
    'lvertneqq', 'nparallel', 'ntrianglerighteq', 'varsubsetneq',
    'ncong', 'nprec', 'nvdash', 'varsubsetneqq',
    'ne', 'npreceq', 'nvDash', 'varsupsetneq',
    'neq', 'nshortmid', 'nVDash', 'varsupsetneqq',
    'ngeq', 'nshortparallel', 'nVdash',
    'ngeqq', 'nsim', 'precnapprox'
];
/**
 * Constant/variable `arrows0` defining arrows0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `arrows0`，定义 `src/ux/markdown-editor` 中的arrows0。
 */
let arrows0 = [
    'circlearrowleft', 'leftharpoonup', 'rArr',
    'circlearrowright', 'leftleftarrows', 'rarr',
    'curvearrowleft', 'leftrightarrow', 'restriction',
    'curvearrowright', 'Leftrightarrow', 'rightarrow',
    'Darr', 'leftrightarrows', 'Rightarrow',
    'dArr', 'leftrightharpoons', 'rightarrowtail',
    'darr', 'leftrightsquigarrow', 'rightharpoondown',
    'dashleftarrow', 'Lleftarrow', 'rightharpoonup',
    'dashrightarrow', 'longleftarrow', 'rightleftarrows',
    'downarrow', 'Longleftarrow', 'rightleftharpoons',
    'Downarrow', 'longleftrightarrow', 'rightrightarrows',
    'downdownarrows', 'Longleftrightarrow', 'rightsquigarrow',
    'downharpoonleft', 'longmapsto', 'Rrightarrow',
    'downharpoonright', 'longrightarrow', 'Rsh',
    'gets', 'Longrightarrow', 'searrow',
    'Harr', 'looparrowleft', 'swarrow',
    'hArr', 'looparrowright', 'to',
    'harr', 'Lrarr', 'twoheadleftarrow',
    'hookleftarrow', 'lrArr', 'twoheadrightarrow',
    'hookrightarrow', 'lrarr', 'Uarr',
    'iff', 'Lsh', 'uArr',
    'impliedby', 'mapsto', 'uarr',
    'implies', 'nearrow', 'uparrow',
    'Larr', 'nleftarrow', 'Uparrow',
    'lArr', 'nLeftarrow', 'updownarrow',
    'larr', 'nleftrightarrow', 'Updownarrow',
    'leadsto', 'nLeftrightarrow', 'upharpoonleft',
    'leftarrow', 'nrightarrow', 'upharpoonright',
    'Leftarrow', 'nRightarrow', 'upuparrows',
    'leftarrowtail', 'nwarrow', 'leftharpoondown', 'Rarr'
];
/**
 * Constant/variable `extensibleArrows1` defining extensible arrows1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `extensibleArrows1`，定义 `src/ux/markdown-editor` 中的extensibleArrows1。
 */
let extensibleArrows1 = [
    'xleftarrow', 'xrightarrow',
    'xLeftarrow', 'xRightarrow',
    'xleftrightarrow', 'xLeftrightarrow',
    'xhookleftarrow', 'xhookrightarrow',
    'xtwoheadleftarrow', 'xtwoheadrightarrow',
    'xleftharpoonup', 'xrightharpoonup',
    'xleftharpoondown', 'xrightharpoondown',
    'xleftrightharpoons', 'xrightleftharpoons',
    'xtofrom', 'xmapsto',
    'xlongequal'
];
/**
 * Constant/variable `classAssignment1` defining class assignment1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `classAssignment1`，定义 `src/ux/markdown-editor` 中的类名Assignment1。
 */
let classAssignment1 = [
    'mathbin', 'mathclose', 'mathinner', 'mathop',
    'mathopen', 'mathord', 'mathpunct', 'mathrel'
];
/**
 * Constant/variable `color2` defining color2 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `color2`，定义 `src/ux/markdown-editor` 中的color2。
 */
let color2 = ['color', 'textcolor', 'colorbox'];
/**
 * Constant/variable `font0` defining font0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `font0`，定义 `src/ux/markdown-editor` 中的font0。
 */
let font0 = ['rm', 'bf', 'it', 'sf', 'tt'];
/**
 * Constant/variable `font1` defining font1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `font1`，定义 `src/ux/markdown-editor` 中的font1。
 */
let font1 = [
    'mathrm', 'mathbf', 'mathit',
    'mathnormal', 'textbf', 'textit',
    'textrm', 'bold', 'Bbb',
    'textnormal', 'boldsymbol', 'mathbb',
    'text', 'bm', 'frak',
    'mathsf', 'mathtt', 'mathfrak',
    'textsf', 'texttt', 'mathcal', 'mathscr'
];
/**
 * Constant/variable `size0` defining size0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `size0`，定义 `src/ux/markdown-editor` 中的size0。
 */
let size0 = [
    'Huge', 'huge', 'LARGE', 'Large', 'large',
    'normalsize', 'small', 'footnotesize', 'scriptsize', 'tiny'
];
/**
 * Constant/variable `style0` defining style0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `style0`，定义 `src/ux/markdown-editor` 中的style0。
 */
let style0 = [
    'displaystyle', 'textstyle', 'scriptstyle', 'scriptscriptstyle',
    'limits', 'nolimits', 'verb'
];
/**
 * Constant/variable `symbolsAndPunctuation0` defining symbols and punctuation0 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `symbolsAndPunctuation0`，定义 `src/ux/markdown-editor` 中的symbolsAndPunctuation0。
 */
let symbolsAndPunctuation0 = [
    'cdots', 'LaTeX',
    'ddots', 'TeX',
    'ldots', 'nabla',
    'vdots', 'infty',
    'dotsb', 'infin',
    'dotsc', 'checkmark',
    'dotsi', 'dag',
    'dotsm', 'dagger',
    'dotso',
    'sdot', 'ddag',
    'mathellipsis', 'ddagger',
    'Box', 'Dagger',
    'lq', 'square', 'angle',
    'blacksquare', 'measuredangle',
    'rq', 'triangle', 'sphericalangle',
    'triangledown', 'top',
    'triangleleft', 'bot',
    'triangleright',
    'colon', 'bigtriangledown',
    'backprime', 'bigtriangleup', 'pounds',
    'prime', 'blacktriangle', 'mathsterling',
    'blacktriangledown',
    'blacktriangleleft', 'yen',
    'blacktriangleright', 'surd',
    'diamond', 'degree',
    'Diamond',
    'lozenge', 'mho',
    'blacklozenge', 'diagdown',
    'star', 'diagup',
    'bigstar', 'flat',
    'clubsuit', 'natural',
    'copyright', 'clubs', 'sharp',
    'circledR', 'diamondsuit', 'heartsuit',
    'diamonds', 'hearts',
    'circledS', 'spadesuit', 'spades',
    'maltese'
];

/**
 * Constant/variable `_c1` defining c1 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `_c1`，定义 `src/ux/markdown-editor` 中的c1。
 */
export let _c1 = Array.from(new Set(
    [
        ...delimiters0, ...delimeterSizing0,
        ...greekLetters0, ...otherLetters0,
        ...spacing0, ...verticalLayout0,
        ...logicAndSetTheory0, ...bigOperators0,
        ...binaryOperators0, ...binomialCoefficients0,
        ...fractions0, ...mathOperators0,
        ...relations0, ...negatedRelations0,
        ...arrows0, ...font0, ...size0,
        ...style0, ...symbolsAndPunctuation0
    ]
))

/**
 * Constant/variable `_c2` defining c2 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `_c2`，定义 `src/ux/markdown-editor` 中的c2。
 */
export let _c2 = Array.from(new Set(
    [
        ...accents1, ...annotation1,
        ...overlap1, ...spacing1,
        ...mathOperators1, ...sqrt1,
        ...extensibleArrows1, ...font1,
        ...classAssignment1
    ]
))

/**
 * Constant/variable `_c3` defining c3 in `src/ux/markdown-editor`.
 * @zh 常量/变量 `_c3`，定义 `src/ux/markdown-editor` 中的c3。
 */
export let _c3 = Array.from(new Set(
    [
        ...verticalLayout2, ...binomialCoefficients2,
        ...fractions2, ...color2
    ]
))

/**
 * Constant/variable `_begin` defining begin in `src/ux/markdown-editor`.
 * @zh 常量/变量 `_begin`，定义 `src/ux/markdown-editor` 中的开始。
 */
export let _begin = ['begin', 'end']

/**
 * Constant/variable `begin_args` defining begin args in `src/ux/markdown-editor`.
 * @zh 常量/变量 `begin_args`，定义 `src/ux/markdown-editor` 中的开始参数列表。
 */
export let begin_args = ['aligned', 'alignedat', 'array', 'bmatrix', 'Bmatrix', 'cases',
    'darray', 'dcases', 'gathered', 'matrix', 'pmatrix', 'vmatrix', 'Vmatrix']

/**
 * Constant/variable `all` defining all in `src/ux/markdown-editor`.
 * @zh 常量/变量 `all`，定义 `src/ux/markdown-editor` 中的全部。
 */
export let all = [..._c1, ..._c2, ..._c3, ..._begin].map(i => '\\' + i)
