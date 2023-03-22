import * as hbs from "hbs";

export default {
    "breaklines": function (pText: string) {
        let vText = hbs.Utils.escapeExpression(pText);
        vText = vText.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new hbs.SafeString(vText);
    },
    "str2lower": function (str: string) {
        if (str && typeof str === "string") {
            return str.toLowerCase();
        }
        return '';
    },
    "times": function (n: number, block:any) {
        var accum = '';
        for (var i = 0; i < n; ++i) {
            block.data.index = i + 1;
            block.data.first = i === 0;
            block.data.last = i === (n - 1);
            accum += block.fn(this);
        }
        return accum;
    },
    "toJson": function (context: any) {
        return JSON.stringify(context);
    },
    "eq": (a: any, b: any) => a == b,
    "RecordField": function (context:any, options:any) {
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
    }
}