import { prisma } from "../../lib/prisma.js";

/**
 * 소셜 프로필 → users 테이블
 * profile: { provider, providerUserId, email, name, avatarUrl }
 */
export async function upsertSocialUser(profile) {
  return prisma.user.upsert({
    where: {
      provider_providerUserId: {
        provider: profile.provider,
        providerUserId: profile.providerUserId,
      },
    },
    create: {
      provider: profile.provider,
      providerUserId: profile.providerUserId,
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    },
    update: {
      email: profile.email,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
    },
  });
}