import { IsUUID } from "class-validator";

export class NewAdoptionRequest {
  @IsUUID()
  animal_id: string;
}
