import { type SQLiteDatabase } from 'expo-sqlite/next';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;
  const userVersionQueryResult = await db.getFirstAsync<{ user_version: number }>(`PRAGMA user_version`);
  let currentDbVersion = userVersionQueryResult?.user_version || 0;
  // 버전이 일치하면 완료
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  // 버전이 일치하지 않음 -> 초기화 진행
  if (currentDbVersion === 0) {
    // 테이블 생성
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';
      CREATE TABLE chat_room (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT,
        status TEXT,
        created_at DATETIME,
        updated_at DATETIME
      );
    `);
    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
