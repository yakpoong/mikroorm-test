import { EntityManager, MikroORM } from "@mikro-orm/core";
import { BetterSqliteDriver } from "@mikro-orm/better-sqlite";
import { Course } from "./entity/Course";
import { Teacher } from "./entity/Teacher";

/**
 * DB 와 연결 후, 생성된 EntityManager로 함수를 실행해 준다.
 */
async function withEntityManager(fn: (orm: EntityManager) => Promise<void>) {
  const orm = await MikroORM.init<BetterSqliteDriver>({
    entities: [Course, Teacher],
    dbName: "school",
    driver: BetterSqliteDriver,
    debug: true,
  });
  try {
    await orm.getSchemaGenerator().dropSchema();
    await orm.getSchemaGenerator().updateSchema();
    await orm.getSchemaGenerator().refreshDatabase();
    await fn(orm.em.fork());
  } finally {
    await orm.close();
  }
}

/**
 * seed 데이터를 생성한다.
 */
async function seed(em: EntityManager) {
  for (let i = 0; i < 10; i++) {
    const teacherName = `teacher${i}`;
    const teacher = new Teacher(teacherName, 50);
    const course1 = new Course(`course-${teacherName}-1`, teacher);
    const course2 = new Course(`course-${teacherName}-2`, teacher);
    em.persist([teacher, course1, course2]);
  }
  // 시드 데이터 저장
  await em.flush();
  // 앤티티 캐시를 초기화한다
  em.clear();
}

async function main() {
  await withEntityManager(async (em) => {
    await seed(em);
    /** 1번 실행문 */
    await em.findOne(
      Teacher,
      { name: "teacher1" },
      {
        fields: ["id", "age"],
      },
    );
    /** 2번 실행문 */
    const course = await em.findOne(
      Course,
      { title: "course-teacher1-1" },
      {
        populate: ["teacher"],
      },
    );
    console.log(
      `courseTitle : ${course?.title}, teacherName : ${course?.getTeacherName()}`,
    );
  });
}

void main();
