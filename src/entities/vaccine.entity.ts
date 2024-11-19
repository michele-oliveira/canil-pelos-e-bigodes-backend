import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AnimalType } from "./enums/animalType.enum";

@Entity()
export class Vaccine {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "enum", enum: AnimalType })
  type: AnimalType;
}
