/**
 * Migration script: seed the Appwrite `courses` collection from the mock data
 * in src/hooks/useAcademicHubData.ts.
 *
 * This is a one-time, manually-run admin script. It is NOT part of the app's
 * runtime bundle (it lives in scripts/, outside src/).
 *
 * It is safely re-runnable: for every course it first checks whether a
 * document with ID === course.code already exists, and only creates it when it
 * does not. Running it twice will simply skip everything the second time.
 *
 * Run with:
 *   npx tsx scripts/migrate-courses.ts
 *
 * (Node 22.6+ can also run it via:
 *   node --experimental-strip-types scripts/migrate-courses.ts)
 *
 * Required environment variables:
 *   APPWRITE_API_KEY              Admin API key (REQUIRED, never hardcoded)
 *
 * Optional (sensible defaults match this project's appwrite.config.json):
 *   APPWRITE_ENDPOINT            default: https://syd.cloud.appwrite.io/v1
 *   APPWRITE_PROJECT_ID          default: 6a5298ae00025336f799
 *   APPWRITE_DATABASE_ID         default: iaas_ug
 *   APPWRITE_COURSES_COLLECTION_ID default: courses
 */

import { mockCoursesData } from '../src/hooks/useAcademicHubData.ts';
import { Client, ID, Databases, type Models } from 'node-appwrite';

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://syd.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a5298ae00025336f799';
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'iaas_ug';
const COLLECTION_ID = process.env.APPWRITE_COURSES_COLLECTION_ID || 'courses';

if (!API_KEY) {
  console.error('ERROR: APPWRITE_API_KEY environment variable is required.');
  console.error('Set it before running, e.g.:');
  console.error('  $env:APPWRITE_API_KEY = "your-admin-api-key"');
  process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

interface CourseRecord {
  code: string;
  title: string;
  credits: number;
  type: string;
  semester: number;
  level: number;
  description: string;
  prerequisites: string[];
  specialization: string[];
}

function toCourseDocument(course: Record<string, unknown>): CourseRecord {
  return {
    code: course.code as string,
    title: course.title as string,
    credits: course.credits as number,
    type: course.type as string,
    semester: course.semester as number,
    level: course.level as number,
    description: course.description as string,
    prerequisites: (course.prerequisites as string[]) ?? [],
    specialization: (course.specialization as string[]) ?? []
  };
}

async function documentExists(documentId: string): Promise<boolean> {
  try {
    await databases.getDocument<Models.Document>(DATABASE_ID, COLLECTION_ID, documentId);
    return true;
  } catch (err: unknown) {
    const code = (err as { code?: number })?.code;
    if (code === 404) {
      return false;
    }
    throw err;
  }
}

async function main(): Promise<void> {
  const courses: Record<string, unknown>[] = [];
  for (const levelKey of Object.keys(mockCoursesData)) {
    const levelData = (mockCoursesData as Record<string, Record<string, Record<string, unknown>[]>>)[levelKey];
    for (const semesterKey of Object.keys(levelData)) {
      const semesterCourses = levelData[semesterKey];
      for (const course of semesterCourses) {
        courses.push(course);
      }
    }
  }

  const total = courses.length;
  let created = 0;
  let skipped = 0;
  const failed: { code: string; error: string }[] = [];

  console.log(`Found ${total} courses in mockCoursesData. Starting migration...`);
  console.log(`Target: endpoint=${ENDPOINT} project=${PROJECT_ID} database=${DATABASE_ID} collection=${COLLECTION_ID}\n`);

  let processed = 0;
  for (const rawCourse of courses) {
    processed += 1;
    const code = rawCourse.code as string | undefined;
    if (!code) {
      const label = (rawCourse.id as string) || `#${processed}`;
      failed.push({ code: label, error: 'Course has no `code` field; cannot use as document ID.' });
      console.log(`[${processed}/${total}] ${label}: FAILED (missing code)`);
      continue;
    }

    try {
      const exists = await documentExists(code);
      if (exists) {
        skipped += 1;
        console.log(`[${processed}/${total}] ${code}: SKIPPED (already exists)`);
        continue;
      }

      const data = toCourseDocument(rawCourse);
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.custom(code), data, [
        'read("any")'
      ]);
      created += 1;
      console.log(`[${processed}/${total}] ${code}: CREATED`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      failed.push({ code, error: message });
      console.log(`[${processed}/${total}] ${code}: FAILED (${message})`);
    }
  }

  console.log('\n==== Migration summary ====');
  console.log(`Total courses found : ${total}`);
  console.log(`Created             : ${created}`);
  console.log(`Skipped (existed)   : ${skipped}`);
  console.log(`Failed              : ${failed.length}`);
  if (failed.length > 0) {
    console.log('\nFailures:');
    for (const f of failed) {
      console.log(`  - ${f.code}: ${f.error}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});