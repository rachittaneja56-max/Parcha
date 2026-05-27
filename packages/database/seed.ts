import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { usersTable } from "./models/user";
import { formsTable, FormSchemaField } from "./models/forms";
import { responsesTable } from "./models/responses";
import { analyticsTable } from "./models/analytics";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const client = postgres(connectionString);
const db = drizzle(client);

async function main() {
  console.log("Starting Database Seed...");

  console.log("Cleaning up existing data to prevent constraint crashes...");
  await db.delete(analyticsTable);
  await db.delete(responsesTable);
  await db.delete(formsTable);
  await db.delete(usersTable);
  console.log("Cleaned existing data.");

  console.log("Provisioning Accounts...");
  const passwordHash = await bcrypt.hash("parcha2026", 10);

  const [adminUser, demoUser] = await db.insert(usersTable).values([
    {
      fullName: "System Admin",
      email: "admin@parcha95.com",
      passwordHash: passwordHash,
      role: "admin",
      emailVerified: true,
    },
    {
      fullName: "Demo Creator",
      email: "demo@parcha95.com",
      passwordHash: passwordHash,
      role: "user", // or creator if it was an enum, using default standard
      emailVerified: true,
    },
  ]).returning();
  
  console.log("Created users:", adminUser.email, "&", demoUser.email);

  console.log("Seeding 4 Themed Forms...");
  
  const hackerSchema: FormSchemaField[] = [
    { id: "fld_h1", type: "short_text", name: "handle", prompt: "Enter your hacker alias:", required: true },
    { id: "fld_h2", type: "single_select", name: "os", prompt: "Preferred OS?", required: true, options: ["Kali", "Arch", "Ubuntu", "Windows"] },
    { id: "fld_h3", type: "long_text", name: "manifesto", prompt: "Why do you hack?", required: false },
  ];

  const startupSchema: FormSchemaField[] = [
    { id: "fld_s1", type: "short_text", name: "founderName", prompt: "Founder Name", required: true },
    { id: "fld_s2", type: "email", name: "founderEmail", prompt: "Founder Email", required: true },
    { id: "fld_s3", type: "number", name: "mrr", prompt: "Current MRR ($)", required: true },
    { id: "fld_s4", type: "file_upload", name: "pitchDeck", prompt: "Upload Pitch Deck (PDF)", required: true },
  ];

  const retroSchema: FormSchemaField[] = [
    { id: "fld_r1", type: "short_text", name: "gamerTag", prompt: "Player 1 Name", required: true },
    { id: "fld_r2", type: "multiple_choice", name: "consoles", prompt: "Owned Consoles", required: true, options: ["NES", "SNES", "Sega Genesis", "N64"] },
    { id: "fld_r3", type: "date", name: "firstGame", prompt: "When did you first play?", required: true },
  ];

  const devopsSchema: FormSchemaField[] = [
    { id: "fld_d1", type: "short_text", name: "clusterName", prompt: "K8s Cluster Name", required: true },
    { id: "fld_d2", type: "single_select", name: "cloud", prompt: "Cloud Provider", required: true, options: ["AWS", "GCP", "Azure"] },
    { id: "fld_d3", type: "long_text", name: "config", prompt: "Paste YAML Config", required: false },
  ];

  const [hackerExam, startupApp, retroSurvey, devopsConfig] = await db.insert(formsTable).values([
    {
      creatorId: demoUser.id,
      title: "The Hacker Exam",
      slug: "hacker-exam",
      theme: "terminal",
      visibility: "public",
      status: "published",
      schema: hackerSchema,
    },
    {
      creatorId: demoUser.id,
      title: "Startup Application",
      slug: "startup-application",
      theme: "silicon_valley",
      visibility: "public",
      status: "published",
      schema: startupSchema,
    },
    {
      creatorId: demoUser.id,
      title: "Retro Gaming Survey",
      slug: "retro-gaming-survey",
      theme: "windows95",
      visibility: "public",
      status: "published",
      schema: retroSchema,
    },
    {
      creatorId: demoUser.id,
      title: "DevOps Configurator",
      slug: "devops-configurator",
      theme: "code_editor",
      visibility: "unlisted",
      status: "published",
      schema: devopsSchema,
    },
  ]).returning();
  
  console.log("Forms seeded successfully.");

  console.log("Injecting 10 Telemetry Responses for all forms...");
  
  const hackerResponses = Array.from({ length: 10 }).map((_, i) => ({
    formId: hackerExam.id,
    payload: {
      fld_h1: `Neo_${i}`,
      fld_h2: ["Kali", "Arch", "Ubuntu", "Windows"][i % 4],
      fld_h3: "To free your mind.",
    },
    respondentFingerprint: `fingerprint_hacker_${Date.now()}_${i}`,
  }));

  const startupResponses = Array.from({ length: 10 }).map((_, i) => ({
    formId: startupApp.id,
    payload: {
      fld_s1: `Founder_${i}`,
      fld_s2: `founder${i}@startup.com`,
      fld_s3: 1000 * (i + 1),
      fld_s4: `https://fakeurl.com/pitch_${i}.pdf`,
    },
    respondentFingerprint: `fingerprint_startup_${Date.now()}_${i}`,
  }));

  const retroResponses = Array.from({ length: 10 }).map((_, i) => ({
    formId: retroSurvey.id,
    payload: {
      fld_r1: `Player_${i}`,
      fld_r2: [["NES"], ["SNES", "N64"], ["Sega Genesis"]][i % 3],
      fld_r3: `199${i}-01-01`,
    },
    respondentFingerprint: `fingerprint_retro_${Date.now()}_${i}`,
  }));

  const devopsResponses = Array.from({ length: 10 }).map((_, i) => ({
    formId: devopsConfig.id,
    payload: {
      fld_d1: `cluster-${i}`,
      fld_d2: ["AWS", "GCP", "Azure"][i % 3],
      fld_d3: `apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-pod-${i}`,
    },
    respondentFingerprint: `fingerprint_devops_${Date.now()}_${i}`,
  }));

  await db.insert(responsesTable).values([...hackerResponses, ...startupResponses, ...retroResponses, ...devopsResponses]);

  await db.insert(analyticsTable).values([
    {
      formId: hackerExam.id,
      views: 1337,
      submissions: 10,
      bounceRate: "4.2",
      lastSubmissionAt: new Date(),
    },
    {
      formId: startupApp.id,
      views: 500,
      submissions: 10,
      bounceRate: "12.5",
      lastSubmissionAt: new Date(),
    },
    {
      formId: retroSurvey.id,
      views: 800,
      submissions: 10,
      bounceRate: "8.4",
      lastSubmissionAt: new Date(),
    },
    {
      formId: devopsConfig.id,
      views: 200,
      submissions: 10,
      bounceRate: "2.1",
      lastSubmissionAt: new Date(),
    }
  ]);

  console.log("Telemetry injected.");
  console.log("Seed Completed Successfully!");
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
