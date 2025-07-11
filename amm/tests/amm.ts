import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Amm } from "../target/types/amm";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

describe("amm", () => {
  // Set up the provider to use local cluster
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.amm as Program<Amm>;

  it("Is initialized!", async () => {
    // Step 1: Create a keypair for the person initializing the AMM
    const initializer = anchor.web3.Keypair.generate();

    // Step 2: Give the initializer some SOL to pay for transactions
    const signature = await anchor.getProvider().connection.requestAirdrop(
      initializer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await anchor.getProvider().connection.confirmTransaction(signature);

    // Step 3: Create two token mints (X and Y) that will be traded in the AMM
    // These are like the "currencies" that can be swapped
    const mintX = await createMint(
      anchor.getProvider().connection,
      initializer,
      initializer.publicKey,
      null,
      6 // 6 decimal places
    );
    const mintY = await createMint(
      anchor.getProvider().connection,
      initializer,
      initializer.publicKey,
      null,
      6 // 6 decimal places
    );

    // Step 4: Calculate Program Derived Addresses (PDAs) for the AMM
    // These are deterministic addresses that the program will use
    const seed = new anchor.BN(123456789); // Unique identifier for this AMM
    
    // Config PDA - stores AMM settings and state
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config"), seed.toArrayLike(Buffer, "le", 8)],
      program.programId
    );
    
    // LP token mint PDA - represents liquidity provider tokens
    const [mintLpPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("lp"), configPda.toBuffer()],
      program.programId
    );
    
    // Vault PDAs - where the AMM stores the actual tokens
    const vaultXPda = await getAssociatedTokenAddress(mintX, configPda, true);
    const vaultYPda = await getAssociatedTokenAddress(mintY, configPda, true);

    // Step 5: Set up AMM parameters
    const fee = 500; // 0.5% trading fee (500 basis points)
    const authority = anchor.web3.Keypair.generate().publicKey; // Who can update the AMM

    // Step 6: Call the initialize instruction to create the AMM
    const tx = await program.methods
      .initialize(seed, fee, authority)
      .accounts({
        initializer: initializer.publicKey, // Who's paying for this
        mintX: mintX, // Token X mint
        mintY: mintY, // Token Y mint
        mintLp: mintLpPda, // LP token mint (created by program)
        vaultX: vaultXPda, // Where Token X is stored
        vaultY: vaultYPda, // Where Token Y is stored
        config: configPda, // AMM configuration account
        tokenProgram: TOKEN_PROGRAM_ID, // SPL Token program
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, // For creating token accounts
        systemProgram: SystemProgram.programId, // For creating accounts
      })
      .signers([initializer]) // Who's signing the transaction
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
