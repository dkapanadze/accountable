import { IsMongoId, IsISO8601, IsOptional, IsEnum } from "class-validator";

import { OperationTypeEnum } from "../models";
import { Transform } from "class-transformer";

export class ReservationQueryDto {
  @IsOptional()
  @IsISO8601()
  before: string;

  @IsOptional()
  @IsISO8601()
  after: string;

  @IsOptional()
  @IsMongoId()
  bookId: string;

  @IsOptional()
  @IsMongoId()
  walletId: string;

  @IsOptional()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @Transform((value) => value.toUpperCase())
  @IsEnum(OperationTypeEnum)
  operationType: string;
}
