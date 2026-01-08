import {
   CommentStatus,
   type Post,
   type PostStatus,
} from "../../../generated/prisma/client";
import type { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
   data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
   userId: string
) => {
   const result = await prisma.post.create({
      data: {
         ...data,
         authorId: userId,
      },
   });
   return result;
};

const getAllPost = async ({
   search,
   tags,
   isFeatured,
   status,
   authorId,
   page,
   limit,
   skip,
   sortBy,
   sortOrder,
}: {
   search: string | undefined;
   tags: string[] | [];
   isFeatured: boolean | undefined;
   status: PostStatus | undefined;
   authorId: string | undefined;
   page: number;
   limit: number;
   skip: number;
   sortBy: string;
   sortOrder: string;
}) => {
   const andConditions: PostWhereInput[] = [];

   if (search) {
      andConditions.push({
         OR: [
            {
               title: {
                  contains: search as string,
                  mode: "insensitive",
               },
            },
            {
               content: {
                  contains: search as string,
                  mode: "insensitive",
               },
            },
            {
               tag: {
                  has: search as string,
               },
            },
         ],
      });
   }

   if (tags.length > 0) {
      andConditions.push({
         tag: {
            hasEvery: tags as string[],
         },
      });
   }

   if (typeof isFeatured === "boolean") {
      andConditions.push({
         isFeatured,
      });
   }

   if (status) {
      andConditions.push({
         status,
      });
   }

   if (authorId) {
      andConditions.push({
         authorId,
      });
   }

   const allPost = await prisma.post.findMany({
      take: limit,
      skip,
      where: {
         AND: andConditions,
      },
      orderBy: {
         [sortBy]: sortOrder,
      },
      include: {
         _count: {
            select: {
               comments: true,
            },
         },
      },
   });

   const totalPosts = await prisma.post.count({
      where: {
         AND: andConditions,
      },
   });

   return {
      data: allPost,
      pagination: {
         totalPosts,
         page,
         limit,
         totalPages: Math.ceil(totalPosts / limit),
      },
   };
};

const getPostById = async (postId: string) => {
   const result = await prisma.$transaction(async (tx) => {
      await tx.post.update({
         where: {
            id: postId,
         },
         data: {
            views: {
               increment: 1,
            },
         },
      });

      return await tx.post.findUnique({
         where: {
            id: postId,
         },
         include: {
            comments: {
               where: {
                  parentId: null,
                  status: CommentStatus.APPROVED,
               },
               orderBy: { createdAt: "desc" },

               include: {
                  replies: {
                     where: {
                        status: CommentStatus.APPROVED,
                     },
                     orderBy: { createdAt: "asc" },

                     include: {
                        replies: {
                           where: {
                              status: CommentStatus.APPROVED,
                           },
                           orderBy: { createdAt: "asc" },
                        },
                     },
                  },
               },
            },
            _count: {
               select: { comments: true },
            },
         },
      });
   });

   return result;
};

const getMyPosts = async (authorId: string) => {
   await prisma.user.findUniqueOrThrow({
      where: {
         id: authorId,
         status: "ACTIVE",
      },
      select: {
         id: true,
      },
   });

   const result = await prisma.post.findMany({
      where: {
         authorId,
      },
      orderBy: {
         createdAt: "desc",
      },
      include: {
         _count: {
            select: {
               comments: true,
            },
         },
      },
   });

   const total = await prisma.post.aggregate({
      where: {
         authorId,
      },
      _count: {
         id: true,
      },
   });

   return {
      data: result,
      total,
   };
};

const updatePost = async (
   postId: string,
   data: Partial<Post>,
   authorId: string
) => {
   const postData = await prisma.post.findUniqueOrThrow({
      where: {
         id: postId,
      },
      select: {
         id: true,
         authorId: true,
      },
   });

   if (postData.authorId !== authorId) {
      throw new Error("You are not the owner of the post!");
   }

   const result = await prisma.post.update({
      where: {
         id: postData.id,
      },
      data,
   });

   return result;
};

export const postService = {
   createPost,
   getAllPost,
   getPostById,
   getMyPosts,
   updatePost,
};
