import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair } from "@solana/web3.js";
import { fromWorkspace, LiteSVMProvider } from "anchor-litesvm";
import { Mycalculatordapp } from "../target/types/mycalculatordapp";
import IDL from "../target/idl/mycalculatordapp.json";

describe("mycalculatordapp", () => {
  let provider: LiteSVMProvider;
  let program: Program<Mycalculatordapp>;
  const calculator = Keypair.generate();

  beforeAll(() => {
    const svm = fromWorkspace("./").withBuiltins().withSysvars();
    provider = new LiteSVMProvider(svm);
    anchor.setProvider(provider);
    program = new Program<Mycalculatordapp>(IDL as any, provider);
  });

  it("Creates a calculator", async () => {
    await program.methods
      .create("welcome to Solana")
      .accounts({
        calculator: calculator.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([calculator])
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    expect(account.greeting).toBe("welcome to Solana");
  });

  it("Adds two numbers", async () => {
    await program.methods
      .add(new anchor.BN(2), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    expect(account.result.eq(new anchor.BN(5))).toBe(true);
  });

  it("Subtracts two numbers", async () => {
    await program.methods
      .subtract(new anchor.BN(10), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    expect(account.result.eq(new anchor.BN(7))).toBe(true);
  });

  it("Multiplies two numbers", async () => {
    await program.methods
      .multiply(new anchor.BN(4), new anchor.BN(5))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    expect(account.result.eq(new anchor.BN(20))).toBe(true);
  });

  it("Divides two numbers", async () => {
    await program.methods
      .divide(new anchor.BN(17), new anchor.BN(3))
      .accounts({
        calculator: calculator.publicKey,
      })
      .rpc();

    const account = await program.account.calculator.fetch(
      calculator.publicKey
    );
    expect(account.result.eq(new anchor.BN(5))).toBe(true);
    expect(account.reminder.eq(new anchor.BN(2))).toBe(true);
  });
});
