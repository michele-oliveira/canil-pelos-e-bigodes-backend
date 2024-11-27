import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  UpdateDateColumn,
} from "typeorm";
import { Animal } from "./animal.entity";
import { User } from "./user.entity";
import { AdoptionRequestStatus } from "./enums/adoptionRequestStatus.enum";

@Entity("adoption_requests")
export class AdoptionRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Animal)
  animal: Animal;

  @ManyToOne(() => User)
  intender: User;

  @ManyToOne(() => User)
  owner: User;

  @Column({
    type: "enum",
    enum: AdoptionRequestStatus,
    default: AdoptionRequestStatus.PENDING,
  })
  status: AdoptionRequestStatus;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;
}
