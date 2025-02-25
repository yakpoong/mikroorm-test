import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  wrap,
} from "@mikro-orm/core";
import { Teacher } from "./Teacher";

@Entity({ tableName: "courses" })
export class Course {
  @PrimaryKey()
  id: number;

  @Property({ comment: "강의명" })
  title: string;

  @ManyToOne(() => Teacher, {
    joinColumn: "teacher_id",
    ref: true,
  })
  teacher: Ref<Teacher>;

  constructor(title: string, teacher: Teacher) {
    this.title = title;
    this.teacher = wrap(teacher).toReference();
  }

  getTeacherName(): string {
    return this.teacher.unwrap().name;
  }
}
