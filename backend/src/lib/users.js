import { prisma } from "../../lib/prisma.js";

/**
 * 소셜 프로필 → users 테이블
 * profile: { provider, providerUserId, email, name, avatarUrl }
 * 다시 로그인해도 계정에서 저장한 이름은 덮지 않는다. 비어 있을 때만 채운다.
 */
export async function upsertSocialUser(profile) {
  const user = await prisma.user.upsert({
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
      avatarUrl: profile.avatarUrl,
    },
  });

  if (!user.name?.trim() && profile.name) {
    return prisma.user.update({
      where: { id: user.id },
      data: { name: profile.name },
    });
  }

  return user;
}

/** 이미 parseDisplayName을 통과한 이름만 넣는다. */
export async function updateDisplayName(userId, name) {
  return prisma.user.update({
    where: { id: userId },
    data: { name },
    select: {
      id: true,
      provider: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  });
}
