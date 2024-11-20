import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "isPositiveIntegerString", async: false })
export class IsPositiveIntegerString implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return /^\d+$/.test(value) && Number(value) > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return "The value must be a positive whole number string";
  }
}
