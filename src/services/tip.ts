import { SendDiamondsRequest, SendDiamondsResponse, sendDiamonds } from "deso-protocol"
import { ConstructedAndSubmittedTx } from "deso-protocol/src/types"

export enum DiamonLevel {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6
}

export const sendTip = async (senderId: string, receiverId: string, postId: string, diamonLevel: DiamonLevel): Promise<ConstructedAndSubmittedTx<SendDiamondsResponse>> => {
    const params : SendDiamondsRequest = {
        SenderPublicKeyBase58Check: senderId,
        ReceiverPublicKeyBase58Check: receiverId,
        DiamondPostHashHex: postId,
        DiamondLevel: diamonLevel,
        MinFeeRateNanosPerKB: 1000, // fixed after checking network
        TransactionFees: null,
        InTutorial: false
    }

    return sendDiamonds(params)
}
