import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity({ tableName: "teachers" })
export class Teacher {
  @PrimaryKey()
  id: number;

  @Property({ comment: "선생님명" })
  name: string;

  @Property({ comment: "선생님의 나이" })
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
