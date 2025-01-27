import { IsIn, IsNumber, IsOptional, IsUUID, Min } from "class-validator";
import { ADOPTION_REQUESTS_PER_PAGE } from "../../common/constants/adoptionRequestsControllerDefaultConfigs";

export class ListParams {
  @IsNumber()
  @Min(1)
  page = 1;

  @IsNumber()
  @Min(10)
  limit = ADOPTION_REQUESTS_PER_PAGE;

  @IsIn(["made", "received"], {
    message: "type must be either 'made' or 'received'",
  })
  @IsOptional()
  type?: "made" | "received";
}

export class NewAdoptionRequest {
  @IsUUID()
  animal_id: string;
}
