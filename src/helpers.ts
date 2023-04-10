import * as hbs from "hbs";

export default {
    breaklines: function (pText: string) {
        let vText = hbs.Utils.escapeExpression(pText);
        vText = vText.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new hbs.SafeString(vText);
    },
    str2lower: function (str) {
        if (str && typeof str === "string") {
            return str.toLowerCase();
        }
        return '';
    },
    times: function (n, block) {
        var accum = '';
        for (var i = 0; i < n; ++i) {
            block.data.index = i + 1;
            block.data.first = i === 0;
            block.data.last = i === (n - 1);
            accum += block.fn(this);
        }
        return accum;
    },
    toJson: function (context: any) {
        return JSON.stringify(context);
    },
    eq: (a: any, b: any) => a == b,
    notEq: (a: number, b: number) => a !== b,
    moreThen: (a: number, b: number) => a > b,
    lessThen: (a: number, b: number) => a < b,
    langRecord: function (context: any, options) {
        let result;
        const vLanguageGroupKey = context.languageGroupKey;
        switch (options.hash.type) {
            case 'Academy':
                result = this.Academy.filter((item) => {
                    if (item.languageGroupKey === vLanguageGroupKey) {
                        return item;
                    }
                });
                break;
            case 'Cms':
                result = this.Cms.filter((item) => {
                    if (item.languageGroupKey === vLanguageGroupKey) {
                        return item;
                    }
                });
                break;
            default:
                result = this.Cms.filter((item) => {
                    if (item.languageGroupKey === vLanguageGroupKey) {
                        return item;
                    }
                });
                break;
        }
        if (result.length > 0) {
            return result[0][options.hash.field];
        } else {
            return null;
        }
    },
    RecordField: function (context: any, options) {
        let fld: string;
        let lang = context[options.hash.lang];
        if (!lang || typeof lang !== 'object') {
            return '';
        }

        if (typeof (options.hash.relation) === 'string') {
            const rel = lang[options.hash.relation];
            if (rel && typeof rel === 'object') {
                lang = lang[options.hash.relation];
            }
        }
        fld = lang[options.hash.field];
        if (fld) {
            return fld;
        } else {
            return null;
        }
    },
    compare: function (v1, op, v2, options) {
        var c = {
            "eq": function (v1, v2) {
                return v1 == v2;
            },
            "neq": function (v1, v2) {
                return v1 != v2;
            }
        }
        if (Object.prototype.hasOwnProperty.call(c, op)) {
            return c[op].call(this, v1, v2) ? options.fn(this) : options.inverse(this);
        }
        return options.inverse(this);
    },
    ifEquals: function (a, b, options) {
        if (a == b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifMoreThen: function (a, b, options) {
        if (a > b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    filter: function (arr: any[], options) {
        const vKey = options.hash.key;
        const out = arr.filter((item) => {
            if (item.languageGroupKey == vKey) {
                return item;
            }
        });
        return out.length;
    }
}