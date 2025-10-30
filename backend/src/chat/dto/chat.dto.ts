import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsPositive } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1000)
  text: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsNumber()
  @IsPositive()
  timestamp: number;
}

export class TypingEventDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  isTyping: boolean;
}

export class UserJoinedDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  username: string;
}
