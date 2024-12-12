import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Vaccine } from "./vaccine.entity";
import { AnimalType } from "./enums/animalType.enum";
import { AnimalGender } from "./enums/animalGender.enum";

@Entity("animals")
export class Animal {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column({ type: "integer" })
  age: number;

  @Column({ type: "enum", enum: AnimalGender })
  gender: AnimalGender;

  @Column({ type: "enum", enum: AnimalType })
  type: AnimalType;

  @ManyToMany(() => Vaccine)
  @JoinTable({
    name: "animal_vaccines",
    joinColumn: { name: "animal_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "vaccine_id", referencedColumnName: "id" },
  })
  vaccines: Vaccine[];

  @Column({ type: "text", nullable: true })
  description: string;

  @Column()
  image_1: string;

  @Column()
  image_2: string;

  @ManyToOne(() => User, (user) => user.ownedAnimals)
  @JoinColumn({ name: "owner_id" })
  owner: User;

  @ManyToOne(() => User, (user) => user.adoptedAnimals, { nullable: true })
  @JoinColumn({ name: "adopter_id" })
  adoptedBy: User | null;
}
