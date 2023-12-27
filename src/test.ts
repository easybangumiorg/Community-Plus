import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getOverview() {
  const [
    user,
    totalPost,
    onReadyPubPost,
    publishedPost,
    recentlyUpdatedPost,
    category,
    totalCollection,
    draftCollection,
    publishedCollection,
    recentlyUpdatedCollection,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { onReadyPub: true } }),
    prisma.post.count({ where: { published: true } }),
    prisma.post.count({
      where: {
        lastUpdate: { gt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            posts: true,
          },
        },
      },
    }),
    prisma.collection.count(),
    prisma.collection.count({ where: { state: 'DRAFT' } }),
    prisma.collection.count({
      where: { state: { notIn: ['DRAFT'] } },
    }),
    prisma.collection.count({
      where: {
        lastUpdate: { gt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    user: { count: user },
    post: {
      count: totalPost,
      onReadyPub: onReadyPubPost,
      published: publishedPost,
      recentlyUpdated: recentlyUpdatedPost,
    },
    category: category.map((c) => ({
      name: c.name,
      count: c._count.posts,
    })),
    collection: {
      count: totalCollection,
      draft: draftCollection,
      published: publishedCollection,
      recentlyUpdated: recentlyUpdatedCollection,
    },
  };
}

async function getUserOverview(userId: number) {
  const [post, pubPost, draftPost, collection, pubCollection, draftCollection] =
    await Promise.all([
      prisma.post.count({ where: { authorId: userId } }),
      prisma.post.count({
        where: { authorId: userId, published: true },
      }),
      prisma.post.count({
        where: { authorId: userId, published: false },
      }),
      prisma.collection.count({ where: { userId: userId } }),
      prisma.collection.count({
        where: { userId: userId, state: { notIn: ['DRAFT'] } },
      }),
      prisma.collection.count({
        where: { userId: userId, state: 'DRAFT' },
      }),
    ]);
  return {
    post: { count: post, published: pubPost, draft: draftPost },
    collection: {
      count: collection,
      published: pubCollection,
      draft: draftCollection,
    },
  };
}

async function main() {
  console.log(await getOverview());
  console.log(await getUserOverview(1));
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
