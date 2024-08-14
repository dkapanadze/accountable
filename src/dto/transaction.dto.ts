import { IsNotEmpty, IsEnum, IsMongoId, IsString } from "class-validator";

import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../models/transaction.model";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsEnum(TransactionTypeEnum)
  type: TransactionTypeEnum;

  @IsNotEmpty()
  @IsEnum(TransactionStatusEnum)
  status: TransactionStatusEnum;

  @IsNotEmpty()
  @IsString()
  bookId: string;
}
