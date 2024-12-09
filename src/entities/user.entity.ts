import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Animal } from "./animal.entity";
import { Exclude } from "class-transformer";

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
  @Exclude()
  password: string;

  @Column()
  @Exclude()
  salt: string;

  @OneToMany(() => Animal, (animal) => animal.owner)
  ownedAnimals: Animal[];

  @OneToMany(() => Animal, (animal) => animal.adoptedBy)
  adoptedAnimals: Animal[];
}
