import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Animal } from "./animal.entity";
import { User } from "./user.entity";
import { AdoptionRequestStatus } from "./enums/adoptionRequestStatus.enum";

@Entity("adoption_requests")
export class AdoptionRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Animal)
  @JoinColumn({ name: "animal_id" })
  animal: Animal;

  @ManyToOne(() => User)
  @JoinColumn({ name: "intender_id" })
  intender: User;

  @Column({
    type: "enum",
    enum: AdoptionRequestStatus,
    default: AdoptionRequestStatus.PENDING,
  })
  status: AdoptionRequestStatus;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
