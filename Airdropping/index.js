import {
    createSolanaRpc,
    createSolanaRpcSubscriptions,
    generateKeyPairSigner,
    airdropFactory,
    lamports,
} from "@solana/kit";

const LAMPORTS_PER_SOL = BigInt(1_000_000_000);

const RPC_URL = "http://127.0.0.1:8899";
const WS_URL = "ws://127.0.0.1:8900";

const rpc = createSolanaRpc(RPC_URL);
const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);

const signer = await generateKeyPairSigner();

const getWalletBalance = async () => {
    try {
        const { value: balance } = await rpc.getBalance(signer.address).send();
        console.log(`Wallet: ${signer.address}`);
        console.log(`Wallet Balance is ${Number(balance) / Number(LAMPORTS_PER_SOL)} SOL`);
    } catch (error) {
        console.error(error);
    }
};

const airDropSol = async () => {
    try {
        const airdrop = airdropFactory({ rpc, rpcSubscriptions });
        await airdrop({
            commitment: "confirmed",
            recipientAddress: signer.address,
            lamports: lamports(LAMPORTS_PER_SOL),
        });
        console.log("Airdrop success!");
    } catch (error) {
        console.error("Airdrop failed:", error.message);
    }
};

const main = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
};

main();
