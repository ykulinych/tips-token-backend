import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { PrismaService } from '../prisma/prisma.service';
import { AirdropDto } from './dto/airdrop.dto';
import {
  TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TipstokenService {
  private provider: anchor.AnchorProvider;
  private program: anchor.Program;
  private connection: Connection;
  private mintPublicKey: PublicKey;

  constructor(private prisma: PrismaService) {
    this.connection = new Connection(
      'https://api.devnet.solana.com', // todo: get rpc endpoint from env
      'confirmed',
    );

    const keypairData = JSON.parse(
      readFileSync(join(homedir(), '.config/solana/id.json'), 'utf-8'), // todo: get path from env
    );
    const walletKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    const wallet = new anchor.Wallet(walletKeypair);

    this.provider = new anchor.AnchorProvider(this.connection, wallet, {
      preflightCommitment: 'confirmed',
    });

    anchor.setProvider(this.provider);

    const idl = JSON.parse(
      readFileSync(
        join(process.cwd(), '..', 'tips-token/target/idl/tipstoken.json'),
        'utf-8',
      ),
    ); // todo: get path from env or put program idl inside application

    this.program = new anchor.Program(idl, this.provider);

    this.mintPublicKey = new PublicKey(
      '4jS3cTiv2z8xidHDLqCZFdVSBGaVWvmCSH9K2tacfgw7',
    ); // todo: get key from env
  }

  async airdrop(body: AirdropDto, amount: number): Promise<{ tx: string }> {
    const { recipientAddress } = body;
    try {
      const recipientWallet = new PublicKey(recipientAddress);

      const payer = (this.provider.wallet as any).payer as Keypair;
      const userTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        payer,
        this.mintPublicKey,
        recipientWallet,
      );

      const amountDecimalBN = new anchor.BN(amount).mul(
        new anchor.BN(10).pow(new anchor.BN(9)),
      );

      const tx = await this.program.methods
        .airdrop(amountDecimalBN)
        .accounts({
          mint: this.mintPublicKey,
          tokenAccount: userTokenAccount.address,
          authority: this.provider.wallet.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();

      await this.prisma.transaction.create({
        data: {
          type: TransactionType.AIRDROP,
          sender: this.provider.wallet.publicKey.toBase58(),
          recipient: recipientWallet.toBase58(),
          amount,
          token: 'tips-token', // todo: get token name from const
        },
      });

      return { tx };
    } catch (error) {
      throw new HttpException(
        'Airdrop failed: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
