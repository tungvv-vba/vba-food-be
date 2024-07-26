import { IsNotEmpty } from "class-validator";

export class MenuImageDto {
  @IsNotEmpty()
  url: string;
}
