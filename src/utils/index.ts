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
    if (!nanos || !nanosPerUSDExchangeRate) {
        return 0;
    }
    return nanos / nanosPerUSDExchangeRate;
}

// export const creatorCoinNanosToUSDNaive = (creatorCoinNanos: number, coinPriceDeSoNanos: number, abbreviate: boolean = false): string => {
//     const usdValue = nanosToUSDNumber((creatorCoinNanos / 1e9) * coinPriceDeSoNanos);
//     return abbreviate ? abbreviateNumber(usdValue, 2, true) : formatUSDFunc(usdValue, 2);
// }

export const creatorCoinNanosToUSDNaive = (creatorCoinNanos: any, coinPriceDeSoNanos: any, abbreviate: boolean = false): string => {
    const usdValue = nanosToUSDNumber((creatorCoinNanos / 1e9) * coinPriceDeSoNanos);
    return abbreviate ? abbreviateNumber(usdValue, 2, true) : formatUSD(usdValue, 2);
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
    if (!nanos || isNaN(nanos)) {
        return "$0.00";
    }

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

const CREATOR_COIN_RESERVE_RATIO = 0.3333333
const CREATOR_COIN_TRADE_FEED_BASIS_POINTS = 1

export const desoNanosYouWouldGetIfYouSold = (creatorCoinAmountNano: number, coinEntry: any): number => {
    if (!creatorCoinAmountNano || !coinEntry?.DeSoLockedNanos || !coinEntry?.CoinsInCirculationNanos) {
        return 0;
    }
    // This is the formula:
    // - B0 * (1 - (1 - dS / S0)^(1/RR))
    // - where:
    //     dS = bigDeltaCreatorCoin,
    //     B0 = bigCurrentDeSoLocked
    //     S0 = bigCurrentCreatorCoinSupply
    //     RR = params.CreatorCoinReserveRatio
    const desoLockedNanos = coinEntry?.DeSoLockedNanos;
    const currentCreatorCoinSupply = coinEntry?.CoinsInCirculationNanos;
    const desoBeforeFeesNanos =
        desoLockedNanos *
        (1 -
            Math.pow(
                1 - creatorCoinAmountNano / currentCreatorCoinSupply,
                1 / CREATOR_COIN_RESERVE_RATIO
            ));

    return (desoBeforeFeesNanos * (100 * 100 - CREATOR_COIN_TRADE_FEED_BASIS_POINTS)) / (100 * 100);
}

export const usdYouWouldGetIfYouSoldDisplay = (creatorCoinAmountNano: number, coinEntry: any, abbreviate: boolean = true): string => {
    if (creatorCoinAmountNano == 0) return "$0";
    const usdValue = nanosToUSDNumber(desoNanosYouWouldGetIfYouSold(creatorCoinAmountNano, coinEntry));
    return abbreviate ? abbreviateNumber(usdValue, 2, true) : formatUSD(usdValue, 2);
}


export const mergeVideoData = (prevVideoData: any[], newVideoData: any[]) => {
    const existingPostHashes = new Set(prevVideoData.map((video: any) => video.PostHashHex));
    const uniqueNewData = newVideoData.filter((item: any) => !existingPostHashes.has(item.PostHashHex));

    return [...prevVideoData, ...uniqueNewData];
}
