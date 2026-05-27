import bcrypt from "bcrypt";
import type { UpdateSettingsInput } from "@repo/validators";

type FormSettingsUpdate = UpdateSettingsInput["updates"];
type PersistedFormSettingsUpdate = Omit<FormSettingsUpdate, "password" | "expiresAt"> & {
  password?: null;
  passwordHash?: string | null;
  expiresAt?: Date | null;
};

export const prepareSettingsUpdate = async (
  updates: FormSettingsUpdate,
): Promise<PersistedFormSettingsUpdate> => {
  const { password, expiresAt, ...persistedUpdates } = updates;
  const finalUpdates: PersistedFormSettingsUpdate = { ...persistedUpdates };

  if (password !== undefined) {
    finalUpdates.passwordHash = password ? await bcrypt.hash(password, 10) : null;
    finalUpdates.password = null;
  }

  if (expiresAt !== undefined) {
    finalUpdates.expiresAt = expiresAt ? new Date(expiresAt) : null;
  }

  return finalUpdates;
};
