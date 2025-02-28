import { Prisma } from "@prisma/client";
import prisma from "../../../lib/prisma";

export async function createBlog(data: Prisma.BlogCreateArgs) {
  return prisma.blog.create(data);
}

export async function getBlog(data: Prisma.BlogFindUniqueArgs) {
  return prisma.blog.findUnique(data);
}

export async function getBlogs(data: Prisma.BlogFindManyArgs) {
  return prisma.blog.findMany(data);
}

export async function updateBlog(data: Prisma.BlogUpdateArgs) {
  return prisma.blog.update(data);
}

export async function deleteBlog(data: Prisma.BlogDeleteArgs) {
  return prisma.blog.delete(data);
}

export async function getBlogsCount(data: Prisma.BlogCountArgs) {
  return prisma.blog.count(data);
}
