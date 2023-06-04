const formatUSDMemo: any = {};
const nanosPerUSDExchangeRate = 1e9
const formatUSDFunc = (num: number, decimal: number): string => {
    if (formatUSDMemo[num] && formatUSDMemo[num][decimal]) {
        return formatUSDMemo[num][decimal];
    }

    formatUSDMemo[num] = formatUSDMemo[num] || {};

    formatUSDMemo[num][decimal] = Number(num).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
    });
    return formatUSDMemo[num][decimal];
}

/*
   * Converts long numbers to convenient abbreviations
   * Examples:
   *   value: 12345, decimals: 1 => 12.3K
   *   value: 3492311, decimals: 2 => 3.49M
   * */
const abbreviateNumber = (value: number, decimals: number, formatUSD: boolean = false): string => {
    let shortValue: any;
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixNum = Math.floor((("" + value.toFixed(0)).length - 1) / 3);
    if (suffixNum === 0) {
        // if the number is less than 1000, we should only show at most 2 decimals places
        decimals = Math.min(2, decimals);
    }
    shortValue = (value / Math.pow(1000, suffixNum)).toFixed(decimals);
    if (formatUSD) {
        shortValue = formatUSDFunc(shortValue, decimals);
    }
    return shortValue + suffixes[suffixNum];
}

const nanosToUSDNumber = (nanos: number): number => {
    return nanos / nanosPerUSDExchangeRate;
}

const creatorCoinNanosToUSDNaive = (creatorCoinNanos: any, coinPriceDeSoNanos: any, abbreviate: boolean = false): string => {
    const usdValue = nanosToUSDNumber((creatorCoinNanos / 1e9) * coinPriceDeSoNanos);
    return abbreviate ? abbreviateNumber(usdValue, 2, true) : formatUSDFunc(usdValue, 2);
}

const formatUSD = (num: number, decimal: number): string => {
    if (formatUSDMemo[num] && formatUSDMemo[num][decimal]) {
        return formatUSDMemo[num][decimal];
    }

    formatUSDMemo[num] = formatUSDMemo[num] || {};

    formatUSDMemo[num][decimal] = Number(num).toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: decimal,
        maximumFractionDigits: decimal,
    });
    return formatUSDMemo[num][decimal];
}

export const nanosToUSD = (nanos: number, decimal?: number): string => {
    if (decimal == null) {
        decimal = 4;
    }
    return formatUSD(nanosToUSDNumber(nanos), decimal);
}


export const parseStringInnerHtml = (str: string) => {
    return str.replace(/\n/g, '<br />')
}

export const desoPrice = (str: number) => {
    return (str / 100)
}