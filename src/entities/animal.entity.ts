import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Vaccine } from './vaccine.entity';
import { AnimalType } from './enums/animalType.enum';


@Entity()
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  breed: string;

  @Column()
  age: string;

  @Column()
  gender: string;

  @Column({ type: 'enum', enum: AnimalType })
  type: AnimalType;

  @ManyToMany(() => Vaccine)
  @JoinTable({
    name: 'animal_vaccines', // Many-to-many join table
    joinColumn: { name: 'animal_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'vaccine_id', referencedColumnName: 'id' },
  })
  vaccines: Vaccine[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.ownedAnimals)
  owner: User;

  @ManyToOne(() => User, (user) => user.adoptedAnimals, { nullable: true })
  adoptedBy: User | null;
}
