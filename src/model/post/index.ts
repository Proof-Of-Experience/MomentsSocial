export interface StatelessPostProps {
    NumToFetch?: number,
    OrderBy?: string,
}

export interface PublicPostProps {
    MediaRequired?: boolean,
    NumToFetch?: number,
    ReaderPublicKeyBase58Check?: string,
    Username: string,
}

interface BodyObjProps {
    Body: string;
    ImageURLs: any;
    VideoURLs: any;
};
interface PostExtraDataProps {
    Language: string;
    LivepeerAssetId: string;
    Node: string;
};

export interface SubmitPostProps {
    BodyObj: BodyObjProps,
    IsHidden?: boolean,
    MinFeeRateNanosPerKB?: number,
    ParentStakeID?: string,
    PostExtraData?: PostExtraDataProps,
    RepostedPostHashHex?: string,
    UpdaterPublicKeyBase58Check?: string,
}
export interface PostTransactionProps {
    TransactionHex: string,
}

