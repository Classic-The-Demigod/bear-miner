import type { WalletContextState } from "@solana/wallet-adapter-react";
import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionMessage,
    VersionedTransaction,
} from "@solana/web3.js";

interface SendSolTransferParams {
    amountSol: number;
    connection: Connection;
    destination: string;
    publicKey: PublicKey;
    sendTransaction: WalletContextState["sendTransaction"];
    wallet: WalletContextState["wallet"];
}

export async function sendSolTransfer({
    amountSol,
    connection,
    destination,
    publicKey,
    sendTransaction,
    wallet,
}: SendSolTransferParams) {
    if (!Number.isFinite(amountSol) || amountSol <= 0) {
        throw new Error("Please enter a valid amount.");
    }

    const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);
    const recipient = new PublicKey(destination);
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transferIx = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipient,
        lamports,
    });

    const supportsV0 = !!wallet?.adapter?.supportedTransactionVersions?.has?.(0);
    const isPhantom = wallet?.adapter?.name === "Phantom";

    let signature: string;

    if (supportsV0 && !isPhantom) {
        const messageV0 = new TransactionMessage({
            payerKey: publicKey,
            recentBlockhash: blockhash,
            instructions: [transferIx],
        }).compileToV0Message();
        const transaction = new VersionedTransaction(messageV0);
        signature = await sendTransaction(transaction, connection);
    } else {
        const transaction = new Transaction({
            feePayer: publicKey,
            recentBlockhash: blockhash,
        }).add(transferIx);
        signature = await sendTransaction(transaction, connection);
    }

    await connection.confirmTransaction(
        {
            blockhash,
            lastValidBlockHeight,
            signature,
        },
        "confirmed"
    );

    return signature;
}
