import {
  IsEmail,
  IsMobilePhone,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

export class NewUser {
  @IsString()
  @MinLength(6)
  name: string;

  @IsEmail()
  email: string;

  @IsMobilePhone("pt-BR")
  @ValidateIf((o) => /^\d+$/.test(o.phone), {
    message: "phone number must contain only numbers",
  })
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UserCredentials {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
