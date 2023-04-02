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
