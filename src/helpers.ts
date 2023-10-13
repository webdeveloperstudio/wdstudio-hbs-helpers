import { handlebars, registerHelper, registerPartial, registerPartials, localsAsTemplateData, create } from "hbs";
import { HelperOptions } from "handlebars";

const vHBS = create().handlebars;

export default {
    replace: function (pText: string, pSearch: string, pReplace: string) {
        let vText = vHBS.Utils.escapeExpression(pText);
        vText = vText.replace(pSearch, pReplace);
        return new vHBS.SafeString(vText);
    },
    breaklines: function (pText: string) {
        let vText = vHBS.Utils.escapeExpression(pText);
        vText = vText.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new vHBS.SafeString(vText);
    },
    str2lower: function (str: string) {
        if (str && typeof str === "string") {
            return str.toLowerCase();
        }
        return '';
    },
    times: function (n: number, block: any) {
        var accum = '';
        for (var i = 0; i < n; ++i) {
            block.data.index = i + 1;
            block.data.first = i === 0;
            block.data.last = i === (n - 1);
            accum += block.fn(this);
        }
        return accum;
    },
    foreach: function (arr: any, length: number = 0, options: HelperOptions) {
        const vTypeOfArray = arr == null ? null : typeof arr;
        const vArrayLength = vTypeOfArray == "object" ? arr.length : 0;
        if (options.inverse && !vArrayLength) {
            return options.inverse(this);
        }
        const vLength = length > 0 ? length - 1 : vArrayLength;
        if (typeof arr === 'object') {
            return arr.map(function (item: any, index: number) {
                item.$index = index;
                item.$first = index === 0;
                item.$last = index === vArrayLength - 1;
                return options.fn(item);
            }).slice(0, vLength).join('');
        } else {
            return [];
        }
    },
    toJson: function (context: any) {
        return JSON.stringify(context);
    },
    JSONParse: function (context: any) {
        return JSON.parse(context);
    },
    JSONParseKey: function (context: any, key: string, pelse: string = ''): any {
        try {
            const vResult = JSON.parse(context);
            if (key.split('.').length > 1) {
                const vKeys = key.split('.');
                let vTemp = vResult;
                for (let index = 0; index < vKeys.length; index++) {
                    const element = vKeys[index];
                    vTemp = vTemp[element];
                }
                return vTemp;
            } else {
                return vResult[key];
            }
        } catch (e) {
            if (pelse) {
                return pelse;
            } else {
                return '';
            }
        }
    },
    JSONStringify: function (context: any, key: string = ''): string {
        if (key !== '' && context.length > 0) {
            const result = [];
            for (let index = 0; index < context.length; index++) {
                const element = context[index];
                result.push(element[key]);
            }
            return JSON.stringify(result);
        }
        return JSON.stringify(context);
    },
    eq: (a: any, b: any) => a == b,
    notEq: (a: number, b: number) => a !== b,
    moreThen: (a: number, b: number) => a > b,
    lessThen: (a: number, b: number) => a < b,
    RecordField: function (context: any, options: HelperOptions) {
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
    compare: function (v1: any, op: any, v2: any, options: HelperOptions) {
        switch (op) {
            case "eq":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
                break;
            case "neq":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
                break;
            case "gt":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
                break;
            case "gte":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
                break;
            case "lt":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
                break;
            case "lte":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
                break;
            case "and":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
                break;
            case "or":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
                break;
            case "typeof":
                return typeof v1 == v2 ? options.fn(this) : options.inverse(this);
                break;
            case "in":
                return v1 in v2 ? options.fn(this) : options.inverse(this);
                break;
            case "nin":
                return !(v1 in v2) ? options.fn(this) : options.inverse(this);
                break;
            case "contains":
                return v1.indexOf(v2) > -1 ? options.fn(this) : options.inverse(this);
                break;
            case "notcontains":
                return !(v1.indexOf(v2) > -1) ? options.fn(this) : options.inverse(this);
                break;
            case "exist":
                return v1 ? options.fn(this) : options.inverse(this);
                break;
            case "notexist":
                return !v1 ? options.fn(this) : options.inverse(this);
                break;
            case "empty":
                return v1 == "" ? options.fn(this) : options.inverse(this);
                break;
            case "notempty":
                return v1 != "" ? options.fn(this) : options.inverse(this);
                break;
            case "null":
                return v1 == null ? options.fn(this) : options.inverse(this);
                break;
            case "notnull":
                return v1 != null ? options.fn(this) : options.inverse(this);
                break;
            case "mod":
                return v1 % v2 == 0 ? options.fn(this) : options.inverse(this);
                break;
            case "divisibleby":
                return v1 % v2 == 0 ? options.fn(this) : options.inverse(this);
                break;
            case "odd":
                return v1 % 2 != 0 ? options.fn(this) : options.inverse(this);
                break;
            case "even":
                return v1 % 2 == 0 ? options.fn(this) : options.inverse(this);
                break;
            case "startwith":
                return v1.indexOf(v2) == 0 ? options.fn(this) : options.inverse(this);
                break;
            case "endwith":
                return v1.indexOf(v2, v1.length - v2.length) !== -1 ? options.fn(this) : options.inverse(this);
                break;
            case "regex":
                return new RegExp(v2).test(v1) ? options.fn(this) : options.inverse(this);
                break;
            case "regexi":
                return new RegExp(v2, "i").test(v1) ? options.fn(this) : options.inverse(this);
                break;
            default:
                break;
        }        
    },
    ifEquals: function (a: any, b: any, options: HelperOptions) {
        if (a == b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifMoreThen: function (a: any, b: any, options: HelperOptions) {
        if (a > b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifNotNUll: function (value: any, options: any) {
        if (value != null) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifStrLenMoreThen: function (str: string, count: number, options: HelperOptions) {
        if (str.length > count) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    filter: function (arr: any[], options: HelperOptions) {
        const vKey = options.hash.key;
        if (!arr || arr.length == 0 || arr === null || arr === undefined) {
            return 0;
        }
        const out = arr.filter((item) => {
            if (item.languageGroupKey == vKey) {
                return item;
            }
        });
        return out.length;
    },
    ifArrayLength: function (value: any[], options: any) {
        if (value.length > 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifNotArrayLength: function (value: any[], options: any) {
        if (value.length === 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    dateF: function (date: string) {
        try {
            if (!date) throw new Error('No Date');
            return new Date(date).toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\./g, '-');
        } catch (e) {
            return '-----';
        }
    },
    dateF2Str: function (date: string): string {
        try {
            if (!date) throw new Error('No Date');
            return new Date(date).toLocaleString();
        } catch (e) {
            return '-----';
        }
    },
    dateOnly: function (date: string): string {
        try {
            if (!date) throw new Error('No Date');
            const vDate = new Date(date);
            let result = vDate.getDate() + '-' + (vDate.getMonth() + 1) + '-' + vDate.getFullYear();
            return result;
        } catch (e) {
            return '-----';
        }
    },
    dateTime: function (date: string): string {
        try {
            if (!date) throw new Error('No Date');
            return new Date(date).toLocaleString();
        } catch (e) {
            return '-----';
        }
    },
    blockquote: function (pText: string) {
        let vText = vHBS.Utils.escapeExpression(pText);
        vText = vText.replace(/(\r\n|\n|\r)/gm, '<br>');
        return new vHBS.SafeString(vText);
    },
    printHtmlById: function (pId: string) {
        const vElement = document.getElementById(pId);
        if (vElement) {
            return vElement.innerHTML;
        }
        return '';
    }
}