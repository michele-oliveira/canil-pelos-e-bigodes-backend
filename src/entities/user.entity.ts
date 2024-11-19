import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Animal, (animal) => animal.owner)
  ownedAnimals: Animal[];

  @OneToMany(() => Animal, (animal) => animal.adoptedBy)
  adoptedAnimals: Animal[];
}
