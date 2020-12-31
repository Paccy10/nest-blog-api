import { IsNotEmpty, MinLength } from 'class-validator';

export class PostDTO {
  @IsNotEmpty()
  @MinLength(4)
  readonly title: string;

  @IsNotEmpty()
  readonly body: string;
}
